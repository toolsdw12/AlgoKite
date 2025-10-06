import Token from '../models/Token.js';
import Account from '../models/Account.js';
import Log from '../models/Log.js';
import KiteAPI from './KiteAPI.js';
import CryptoService from './CryptoService.js';

class TokenService {
  /**
   * Calculate expiry time: Always 6 AM next day
   * @returns {Date} - Expiry timestamp (6:00:00 AM tomorrow)
   */
  static getExpiryTime() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0); // 6:00:00 AM
    return tomorrow;
  }

  /**
   * Generate and save access token
   * @param {string} accountId - MongoDB account ID
   * @param {string} requestToken - Request token from Kite callback
   * @returns {Promise<Object>} - Saved token document
   */
  static async generateToken(accountId, requestToken) {
    try {
      // Get account details
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      // Decrypt API secret
      const apiSecret = CryptoService.decrypt(account.apiSecret);

      // Call Kite API to generate session
      const sessionData = await KiteAPI.generateSession(
        account.apiKey,
        apiSecret,
        requestToken
      );

      // Encrypt access token
      const encryptedToken = CryptoService.encrypt(sessionData.access_token);

      // Delete old token for this account (if exists)
      await Token.deleteMany({ accountId });

      // Calculate expiry
      const expiresAt = this.getExpiryTime();

      // Save new token
      const token = await Token.create({
        accountId,
        accessToken: encryptedToken,
        userId: sessionData.user_id,
        generatedAt: new Date(),
        expiresAt,
        isValid: true
      });

      // Update account status
      await Account.findByIdAndUpdate(accountId, {
        status: 'active',
        updatedAt: new Date()
      });

      // Log authentication event
      await Log.create({
        accountId,
        event: 'authenticated',
        message: `Token generated successfully for user ${sessionData.user_id}`,
        metadata: {
          userId: sessionData.user_id,
          userName: sessionData.user_name,
          expiresAt
        }
      });

      console.log(`✅ Token generated for account ${account.accountName} (expires at ${expiresAt.toLocaleString()})`);

      return token;
    } catch (error) {
      console.error('TokenService.generateToken error:', error);

      // Log error
      await Log.create({
        accountId,
        event: 'error',
        message: `Failed to generate token: ${error.message}`,
        metadata: { error: error.stack }
      });

      throw error;
    }
  }

  /**
   * Check if token is still valid
   * @param {Object} token - Token document from DB
   * @returns {boolean} - True if valid, false otherwise
   */
  static isTokenValid(token) {
    if (!token) return false;

    const now = new Date();
    return token.isValid && now < token.expiresAt;
  }

  /**
   * Get decrypted access token for an account
   * @param {string} accountId - MongoDB account ID
   * @returns {Promise<string>} - Decrypted access token
   * @throws {Error} - If token expired or not found
   */
  static async getAccessToken(accountId) {
    const token = await Token.findOne({ accountId });

    if (!token) {
      throw new Error('Token not found. Please authenticate first.');
    }

    if (!this.isTokenValid(token)) {
      throw new Error('Token expired. Please re-authenticate.');
    }

    // Decrypt and return
    return CryptoService.decrypt(token.accessToken);
  }

  /**
   * Get token info (without decrypting)
   * @param {string} accountId - MongoDB account ID
   * @returns {Promise<Object>} - Token info
   */
  static async getTokenInfo(accountId) {
    const token = await Token.findOne({ accountId });

    if (!token) {
      return {
        exists: false,
        isValid: false,
        message: 'No token found'
      };
    }

    const now = new Date();
    const isValid = this.isTokenValid(token);
    const timeLeft = token.expiresAt - now;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return {
      exists: true,
      isValid,
      userId: token.userId,
      generatedAt: token.generatedAt,
      expiresAt: token.expiresAt,
      timeLeft: isValid ? `${hoursLeft}h ${minutesLeft}m` : 'Expired',
      hoursLeft: isValid ? hoursLeft : 0,
      minutesLeft: isValid ? minutesLeft : 0
    };
  }

  /**
   * Manually invalidate a token
   * @param {string} accountId - MongoDB account ID
   */
  static async invalidateToken(accountId) {
    await Token.findOneAndUpdate(
      { accountId },
      { isValid: false }
    );

    await Account.findByIdAndUpdate(accountId, {
      status: 'expired',
      updatedAt: new Date()
    });

    await Log.create({
      accountId,
      event: 'expired',
      message: 'Token manually invalidated'
    });

    console.log(`🔴 Token invalidated for account ${accountId}`);
  }

  /**
   * Get all tokens with their status
   * @returns {Promise<Array>} - Array of tokens with account info
   */
  static async getAllTokensStatus() {
    const tokens = await Token.find()
      .populate('accountId', 'accountName status')
      .sort({ createdAt: -1 });

    return tokens.map(token => ({
      accountId: token.accountId._id,
      accountName: token.accountId.accountName,
      accountStatus: token.accountId.status,
      userId: token.userId,
      generatedAt: token.generatedAt,
      expiresAt: token.expiresAt,
      isValid: this.isTokenValid(token),
      tokenExists: true
    }));
  }
}

export default TokenService;
