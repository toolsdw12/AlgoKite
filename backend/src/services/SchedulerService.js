import cron from 'node-cron';
import Token from '../models/Token.js';
import Account from '../models/Account.js';
import Log from '../models/Log.js';

class SchedulerService {
  /**
   * Start all scheduled jobs
   */
  static start() {
    console.log('🕐 Starting scheduler service...');

    // Job 1: Run at 6:01 AM every day - Mark all tokens as expired
    cron.schedule('1 6 * * *', async () => {
      console.log('⏰ Running daily token expiry job at 6:01 AM...');

      try {
        // Mark all valid tokens as expired
        const tokenResult = await Token.updateMany(
          { isValid: true },
          { isValid: false }
        );

        // Update all active accounts to expired
        const accountResult = await Account.updateMany(
          { status: 'active' },
          { status: 'expired', updatedAt: new Date() }
        );

        // Get all affected accounts for logging
        const expiredAccounts = await Account.find({ status: 'expired' });

        // Log expiry events
        for (const account of expiredAccounts) {
          await Log.create({
            accountId: account._id,
            event: 'expired',
            message: 'Token expired at 6:00 AM (daily automatic expiry)',
            timestamp: new Date()
          });
        }

        console.log(`✅ Daily expiry completed:`);
        console.log(`   - Tokens expired: ${tokenResult.modifiedCount}`);
        console.log(`   - Accounts updated: ${accountResult.modifiedCount}`);
      } catch (error) {
        console.error('❌ Error in daily expiry job:', error);
      }
    });

    console.log('   ✓ Daily expiry job scheduled (6:01 AM)');

    // Job 2: Optional - Check every hour for manual expiry updates
    // This handles edge cases where tokens weren't expired at 6 AM
    cron.schedule('0 * * * *', async () => {
      try {
        const now = new Date();

        // Find tokens that should be expired but aren't
        const result = await Token.updateMany(
          {
            expiresAt: { $lt: now },
            isValid: true
          },
          { isValid: false }
        );

        if (result.modifiedCount > 0) {
          console.log(`🔄 Hourly check: Expired ${result.modifiedCount} overdue tokens`);

          // Update corresponding accounts
          const expiredTokens = await Token.find({
            expiresAt: { $lt: now },
            isValid: false
          }).select('accountId');

          const accountIds = expiredTokens.map(t => t.accountId);

          await Account.updateMany(
            { _id: { $in: accountIds }, status: 'active' },
            { status: 'expired', updatedAt: new Date() }
          );
        }
      } catch (error) {
        console.error('❌ Error in hourly check job:', error);
      }
    });

    console.log('   ✓ Hourly token check scheduled');

    // Job 3: Optional - Daily stats report at 7 AM
    cron.schedule('0 7 * * *', async () => {
      try {
        const stats = await this.getStats();

        console.log('\n📊 Daily Token Stats (7:00 AM)');
        console.log('─────────────────────────────────');
        console.log(`Total Accounts: ${stats.totalAccounts}`);
        console.log(`Active: ${stats.active}`);
        console.log(`Expired: ${stats.expired}`);
        console.log(`Never Authenticated: ${stats.neverAuthenticated}`);
        console.log('─────────────────────────────────\n');
      } catch (error) {
        console.error('❌ Error in daily stats job:', error);
      }
    });

    console.log('   ✓ Daily stats report scheduled (7:00 AM)');
    console.log('✅ Scheduler service started successfully\n');
  }

  /**
   * Get current statistics
   * @returns {Promise<Object>} - Stats object
   */
  static async getStats() {
    const totalAccounts = await Account.countDocuments();
    const active = await Account.countDocuments({ status: 'active' });
    const expired = await Account.countDocuments({ status: 'expired' });
    const neverAuthenticated = await Account.countDocuments({ status: 'never_authenticated' });
    const totalTokens = await Token.countDocuments();
    const validTokens = await Token.countDocuments({ isValid: true });

    return {
      totalAccounts,
      active,
      expired,
      neverAuthenticated,
      totalTokens,
      validTokens
    };
  }

  /**
   * Force expire all tokens now (for testing/admin)
   */
  static async forceExpireAll() {
    console.log('⚠️ Force expiring all tokens...');

    const tokenResult = await Token.updateMany(
      { isValid: true },
      { isValid: false }
    );

    const accountResult = await Account.updateMany(
      { status: 'active' },
      { status: 'expired', updatedAt: new Date() }
    );

    console.log(`✅ Force expiry completed:`);
    console.log(`   - Tokens expired: ${tokenResult.modifiedCount}`);
    console.log(`   - Accounts updated: ${accountResult.modifiedCount}`);

    return {
      tokensExpired: tokenResult.modifiedCount,
      accountsUpdated: accountResult.modifiedCount
    };
  }
}

export default SchedulerService;
