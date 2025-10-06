import { KiteConnect } from 'kiteconnect';

class KiteAPIService {
  /**
   * Generate session using request token
   * @param {string} apiKey - Kite API key
   * @param {string} apiSecret - Kite API secret
   * @param {string} requestToken - Request token from Kite login callback
   * @returns {Promise<Object>} - Session data with access_token, user_id, etc.
   */
  static async generateSession(apiKey, apiSecret, requestToken) {
    try {
      const kc = new KiteConnect({ api_key: apiKey });

      // Generate session
      const session = await kc.generateSession(requestToken, apiSecret);

      return {
        access_token: session.access_token,
        user_id: session.user_id,
        user_name: session.user_name,
        user_shortname: session.user_shortname,
        email: session.email,
        user_type: session.user_type,
        broker: session.broker,
        exchanges: session.exchanges,
        products: session.products,
        order_types: session.order_types,
        public_token: session.public_token,
        refresh_token: session.refresh_token, // Note: Not used in Kite (always null)
        silo: session.silo,
        login_time: session.login_time
      };
    } catch (error) {
      console.error('KiteAPI generateSession error:', error);
      throw new Error(`Kite API Error: ${error.message}`);
    }
  }

  /**
   * Get login URL for user authentication
   * @param {string} apiKey - Kite API key
   * @returns {string} - Login URL
   */
  static getLoginURL(apiKey) {
    const kc = new KiteConnect({ api_key: apiKey });
    return kc.getLoginURL();
  }

  /**
   * Validate access token (optional - useful for testing)
   * @param {string} apiKey - Kite API key
   * @param {string} accessToken - Access token to validate
   * @returns {Promise<Object>} - User profile if valid
   */
  static async validateToken(apiKey, accessToken) {
    try {
      const kc = new KiteConnect({ api_key: apiKey });
      kc.setAccessToken(accessToken);

      // Try to fetch profile to validate token
      const profile = await kc.getProfile();
      return profile;
    } catch (error) {
      console.error('KiteAPI validateToken error:', error);
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  /**
   * Create KiteConnect instance with access token
   * @param {string} apiKey - Kite API key
   * @param {string} accessToken - Valid access token
   * @returns {KiteConnect} - Configured KiteConnect instance
   */
  static createInstance(apiKey, accessToken) {
    const kc = new KiteConnect({ api_key: apiKey });
    kc.setAccessToken(accessToken);
    return kc;
  }
}

export default KiteAPIService;
