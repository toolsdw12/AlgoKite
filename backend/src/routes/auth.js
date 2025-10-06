import express from 'express';
import Account from '../models/Account.js';
import KiteAPI from '../services/KiteAPI.js';
import TokenService from '../services/TokenService.js';

const router = express.Router();

/**
 * GET /api/auth/login/:accountId - Initiate Kite login
 * Returns login URL to redirect user to Kite
 */
router.get('/login/:accountId', async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Get Kite login URL
    const loginURL = KiteAPI.getLoginURL(account.apiKey);

    res.json({
      success: true,
      loginURL,
      accountId: account._id,
      accountName: account.accountName
    });
  } catch (error) {
    console.error('GET /api/auth/login/:accountId error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate login URL',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/callback - Handle Kite redirect callback
 * Kite redirects here with ?request_token=xxx&action=login&status=success
 */
router.get('/callback', async (req, res) => {
  try {
    const { request_token, status, action } = req.query;

    // Validate callback
    if (status !== 'success' || action !== 'login' || !request_token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Failed</title>
            <style>
              body { font-family: Arial; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fee; }
              .error { text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .error h1 { color: #e53e3e; margin: 0 0 20px; }
              .error p { color: #666; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>❌ Authentication Failed</h1>
              <p>Invalid callback parameters</p>
              <p><a href="/">Return to Dashboard</a></p>
            </div>
          </body>
        </html>
      `);
    }

    // Get account ID from session/state (for now, we'll handle it differently)
    // In production, you should pass accountId via state parameter in login URL

    // For simplicity, we'll return the request_token to frontend
    // Frontend will then call POST /api/auth/complete with accountId + request_token

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: Arial; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #efe; }
            .success { text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success h1 { color: #10b981; margin: 0 0 20px; }
            .success p { color: #666; margin: 10px 0; }
            .token { background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✅ Kite Login Successful!</h1>
            <p>Request token received</p>
            <div class="token">${request_token}</div>
            <p>Closing window...</p>
            <script>
              const requestToken = '${request_token}';

              // If opened in popup, send message to parent window
              if (window.opener) {
                // Send token to parent window via postMessage
                window.opener.postMessage({
                  type: 'KITE_AUTH_SUCCESS',
                  requestToken: requestToken
                }, '*');

                // Also store in localStorage as fallback
                localStorage.setItem('kite_request_token', requestToken);

                setTimeout(() => {
                  window.close();
                }, 1500);
              } else {
                // If opened in same tab, store in localStorage and redirect
                localStorage.setItem('kite_request_token', requestToken);
                setTimeout(() => {
                  window.location.href = '/?request_token=' + requestToken;
                }, 2000);
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('GET /api/auth/callback error:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * POST /api/auth/complete - Complete authentication with request token
 * Frontend calls this with accountId and request_token
 */
router.post('/complete', async (req, res) => {
  try {
    const { accountId, requestToken } = req.body;

    if (!accountId || !requestToken) {
      return res.status(400).json({
        success: false,
        message: 'accountId and requestToken are required'
      });
    }

    // Generate and save token
    const token = await TokenService.generateToken(accountId, requestToken);

    res.json({
      success: true,
      message: 'Authentication completed successfully',
      data: {
        tokenId: token._id,
        accountId: token.accountId,
        userId: token.userId,
        expiresAt: token.expiresAt,
        isValid: token.isValid
      }
    });
  } catch (error) {
    console.error('POST /api/auth/complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/invalidate/:accountId - Manually invalidate token
 */
router.post('/invalidate/:accountId', async (req, res) => {
  try {
    await TokenService.invalidateToken(req.params.accountId);

    res.json({
      success: true,
      message: 'Token invalidated successfully'
    });
  } catch (error) {
    console.error('POST /api/auth/invalidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to invalidate token',
      error: error.message
    });
  }
});

export default router;
