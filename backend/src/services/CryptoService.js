import crypto from 'crypto';

class CryptoService {
  constructor() {
    // Get encryption key from environment or generate one
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits

    // IMPORTANT: Set this in .env file for production
    const envKey = process.env.ENCRYPTION_KEY;

    if (envKey) {
      this.key = Buffer.from(envKey, 'hex');
    } else {
      // Development mode: generate a key (not for production!)
      console.warn('⚠️ No ENCRYPTION_KEY found in .env, using generated key (dev only)');
      this.key = crypto.randomBytes(this.keyLength);
    }
  }

  /**
   * Encrypt sensitive data (API secrets, access tokens)
   * @param {string} text - Plain text to encrypt
   * @returns {string} - Encrypted text with IV and auth tag
   */
  encrypt(text) {
    if (!text) throw new Error('Text to encrypt cannot be empty');

    // Generate random initialization vector
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Combine IV + Auth Tag + Encrypted Data
    // Format: <iv:hex>:<authTag:hex>:<encrypted:hex>
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt encrypted data
   * @param {string} encryptedData - Encrypted string from encrypt()
   * @returns {string} - Original plain text
   */
  decrypt(encryptedData) {
    if (!encryptedData) throw new Error('Encrypted data cannot be empty');

    try {
      // Split the combined string
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);

      // Decrypt
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Generate a random encryption key (for initial setup)
   * Run this once and save to .env file
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }
}

// Export singleton instance
export default new CryptoService();

// Also export class for testing
export { CryptoService };
