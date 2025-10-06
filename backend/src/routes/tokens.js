import express from 'express';
import TokenService from '../services/TokenService.js';
import SchedulerService from '../services/SchedulerService.js';

const router = express.Router();

/**
 * GET /api/tokens/:accountId - Get token info (without decrypting)
 */
router.get('/:accountId', async (req, res) => {
  try {
    const tokenInfo = await TokenService.getTokenInfo(req.params.accountId);

    res.json({
      success: true,
      data: tokenInfo
    });
  } catch (error) {
    console.error('GET /api/tokens/:accountId error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch token info',
      error: error.message
    });
  }
});

/**
 * GET /api/tokens/:accountId/access - Get decrypted access token
 * WARNING: This exposes the actual token - use with caution
 */
router.get('/:accountId/access', async (req, res) => {
  try {
    const accessToken = await TokenService.getAccessToken(req.params.accountId);

    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    console.error('GET /api/tokens/:accountId/access error:', error);

    // Return appropriate status code based on error
    if (error.message.includes('not found') || error.message.includes('expired')) {
      return res.status(404).json({
        success: false,
        message: error.message,
        needsReauth: true
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get access token',
      error: error.message
    });
  }
});

/**
 * GET /api/tokens - Get all tokens status
 */
router.get('/', async (req, res) => {
  try {
    const tokens = await TokenService.getAllTokensStatus();

    res.json({
      success: true,
      count: tokens.length,
      data: tokens
    });
  } catch (error) {
    console.error('GET /api/tokens error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tokens',
      error: error.message
    });
  }
});

/**
 * GET /api/tokens/stats/summary - Get statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await SchedulerService.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('GET /api/tokens/stats/summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

/**
 * POST /api/tokens/admin/expire-all - Force expire all tokens (admin only)
 */
router.post('/admin/expire-all', async (req, res) => {
  try {
    const result = await SchedulerService.forceExpireAll();

    res.json({
      success: true,
      message: 'All tokens expired successfully',
      data: result
    });
  } catch (error) {
    console.error('POST /api/tokens/admin/expire-all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to expire tokens',
      error: error.message
    });
  }
});

export default router;
