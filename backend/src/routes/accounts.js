import express from 'express';
import Account from '../models/Account.js';
import Token from '../models/Token.js';
import CryptoService from '../services/CryptoService.js';
import TokenService from '../services/TokenService.js';

const router = express.Router();

/**
 * GET /api/accounts - Get all accounts with token status
 */
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });

    // Enrich with token info
    const accountsWithTokens = await Promise.all(
      accounts.map(async (account) => {
        const tokenInfo = await TokenService.getTokenInfo(account._id);

        return {
          _id: account._id,
          accountName: account.accountName,
          apiKey: account.apiKey,
          status: account.status,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          token: tokenInfo
        };
      })
    );

    res.json({
      success: true,
      count: accountsWithTokens.length,
      data: accountsWithTokens
    });
  } catch (error) {
    console.error('GET /api/accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accounts',
      error: error.message
    });
  }
});

/**
 * GET /api/accounts/:id - Get single account
 */
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    const tokenInfo = await TokenService.getTokenInfo(account._id);

    res.json({
      success: true,
      data: {
        _id: account._id,
        accountName: account.accountName,
        apiKey: account.apiKey,
        status: account.status,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        token: tokenInfo
      }
    });
  } catch (error) {
    console.error('GET /api/accounts/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch account',
      error: error.message
    });
  }
});

/**
 * POST /api/accounts - Create new account
 */
router.post('/', async (req, res) => {
  try {
    const { accountName, apiKey, apiSecret } = req.body;

    // Validation
    if (!accountName || !apiKey || !apiSecret) {
      return res.status(400).json({
        success: false,
        message: 'accountName, apiKey, and apiSecret are required'
      });
    }

    // Check if account with same name exists
    const existing = await Account.findOne({ accountName });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Account with this name already exists'
      });
    }

    // Encrypt API secret
    const encryptedSecret = CryptoService.encrypt(apiSecret);

    // Create account
    const account = await Account.create({
      accountName,
      apiKey,
      apiSecret: encryptedSecret,
      status: 'never_authenticated'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: account._id,
        accountName: account.accountName,
        apiKey: account.apiKey,
        status: account.status,
        createdAt: account.createdAt
      }
    });
  } catch (error) {
    console.error('POST /api/accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account',
      error: error.message
    });
  }
});

/**
 * PUT /api/accounts/:id - Update account
 */
router.put('/:id', async (req, res) => {
  try {
    const { accountName, apiKey, apiSecret } = req.body;

    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Update fields
    if (accountName) account.accountName = accountName;
    if (apiKey) account.apiKey = apiKey;
    if (apiSecret) {
      account.apiSecret = CryptoService.encrypt(apiSecret);
    }

    account.updatedAt = new Date();
    await account.save();

    res.json({
      success: true,
      message: 'Account updated successfully',
      data: {
        _id: account._id,
        accountName: account.accountName,
        apiKey: account.apiKey,
        status: account.status,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('PUT /api/accounts/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update account',
      error: error.message
    });
  }
});

/**
 * DELETE /api/accounts/:id - Delete account and its token
 */
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Delete associated token
    await Token.deleteMany({ accountId: account._id });

    // Delete account
    await account.deleteOne();

    res.json({
      success: true,
      message: 'Account and associated token deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/accounts/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

export default router;
