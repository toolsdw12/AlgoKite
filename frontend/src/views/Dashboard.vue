<template>
  <div class="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section -->
      <header class="bg-white rounded-2xl shadow-sm px-6 py-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 leading-tight">
                Kite Token Manager
              </h1>
              <p class="text-xs text-slate-600 leading-tight mt-0.5">
                Manage your Zerodha Kite API tokens efficiently and securely
              </p>
            </div>
          </div>
          <div class="lg:shrink-0">
            <AddAccount @created="handleAccountCreated" />
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal-50 mb-4">
          <div class="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-slate-600 text-sm font-medium">Loading accounts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-red-50 mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600 text-sm font-medium mb-4">{{ error }}</p>
        <button
          @click="fetchAccounts"
          class="px-5 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Stats Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Active Stats Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-3xl font-bold text-slate-900">{{ stats.active }}</div>
                <div class="text-xs text-slate-600 mt-1">Active Tokens</div>
              </div>
              <div class="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Expired Stats Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-3xl font-bold text-slate-900">{{ stats.expired }}</div>
                <div class="text-xs text-slate-600 mt-1">Expired</div>
              </div>
              <div class="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Never Auth Stats Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-3xl font-bold text-slate-900">{{ stats.neverAuthenticated }}</div>
                <div class="text-xs text-slate-600 mt-1">Not Authenticated</div>
              </div>
              <div class="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Stats Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-3xl font-bold text-slate-900">{{ stats.totalAccounts }}</div>
                <div class="text-xs text-slate-600 mt-1">Total Accounts</div>
              </div>
              <div class="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="accounts.length === 0" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">No Accounts Yet</h2>
          <p class="text-slate-600 text-sm max-w-md mx-auto">Click "Add Account" button above to get started with your first Kite API account</p>
        </div>

        <!-- Accounts Grid -->
        <div v-else>
          <div class="mb-4">
            <h2 class="text-lg font-bold text-slate-900">Your Accounts</h2>
            <p class="text-slate-600 text-sm mt-1">Manage and monitor all your Kite API accounts</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AccountCard
              v-for="account in accounts"
              :key="account._id"
              :account="account"
              @delete="handleDelete"
              @authenticate="handleAuthenticate"
              @invalidate="handleInvalidate"
              @refresh="fetchAccounts"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-blue-900 text-sm mb-1">Important Information</h3>
              <p class="text-xs text-blue-800">
                All tokens expire daily at 6:00 AM IST. Re-authenticate to obtain a new token for continued access.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AccountCard from '../components/AccountCard.vue';
import AddAccount from '../components/AddAccount.vue';

const accounts = ref([]);
const loading = ref(false);
const error = ref('');

const API_BASE = 'http://localhost:3000/api';

// Computed stats
const stats = computed(() => {
  return {
    totalAccounts: accounts.value.length,
    active: accounts.value.filter(a => a.status === 'active').length,
    expired: accounts.value.filter(a => a.status === 'expired').length,
    neverAuthenticated: accounts.value.filter(a => a.status === 'never_authenticated').length
  };
});

// Fetch all accounts
const fetchAccounts = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch(`${API_BASE}/accounts`);
    const data = await response.json();

    if (data.success) {
      accounts.value = data.data;
    } else {
      error.value = data.message || 'Failed to fetch accounts';
    }
  } catch (err) {
    console.error('Fetch accounts error:', err);
    error.value = 'Network error. Is the backend running?';
  } finally {
    loading.value = false;
  }
};

// Handle account created
const handleAccountCreated = () => {
  fetchAccounts();
};

// Handle delete
const handleDelete = async (accountId) => {
  try {
    const response = await fetch(`${API_BASE}/accounts/${accountId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      fetchAccounts();
    } else {
      alert(data.message || 'Failed to delete account');
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Network error');
  }
};

// Handle authenticate
const handleAuthenticate = async (accountId) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login/${accountId}`);
    const data = await response.json();

    if (data.success) {
      // Store which account is being authenticated
      localStorage.setItem('kite_auth_account_id', accountId);

      // Open Kite login in new window
      window.open(data.loginURL, '_blank', 'width=600,height=700');

      // Listen for postMessage from popup
      const messageHandler = async (event) => {
        // Security: In production, check event.origin
        if (event.data && event.data.type === 'KITE_AUTH_SUCCESS') {
          window.removeEventListener('message', messageHandler);

          const requestToken = event.data.requestToken;
          localStorage.removeItem('kite_auth_account_id');

          // Complete authentication
          await completeAuth(accountId, requestToken);
        }
      };

      window.addEventListener('message', messageHandler);

      // Fallback: Poll for request token from localStorage (for same-tab flow)
      const pollInterval = setInterval(async () => {
        const requestToken = localStorage.getItem('kite_request_token');

        if (requestToken) {
          clearInterval(pollInterval);
          window.removeEventListener('message', messageHandler);
          localStorage.removeItem('kite_request_token');
          localStorage.removeItem('kite_auth_account_id');

          // Complete authentication
          await completeAuth(accountId, requestToken);
        }
      }, 1000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        window.removeEventListener('message', messageHandler);
      }, 300000);
    } else {
      alert(data.message || 'Failed to get login URL');
    }
  } catch (err) {
    console.error('Authenticate error:', err);
    alert('Network error');
  }
};

// Complete authentication
const completeAuth = async (accountId, requestToken) => {
  try {
    const response = await fetch(`${API_BASE}/auth/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accountId, requestToken })
    });

    const data = await response.json();

    if (data.success) {
      alert('✅ Authentication successful!');
      fetchAccounts();
    } else {
      alert(`❌ Authentication failed: ${data.message}`);
    }
  } catch (err) {
    console.error('Complete auth error:', err);
    alert('Network error during authentication');
  }
};

// Handle invalidate
const handleInvalidate = async (accountId) => {
  try {
    const response = await fetch(`${API_BASE}/auth/invalidate/${accountId}`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      fetchAccounts();
    } else {
      alert(data.message || 'Failed to invalidate token');
    }
  } catch (err) {
    console.error('Invalidate error:', err);
    alert('Network error');
  }
};

// Check for request token in URL on mount
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestToken = urlParams.get('request_token');

  if (requestToken) {
    localStorage.setItem('kite_request_token', requestToken);
    // Clean URL
    window.history.replaceState({}, document.title, '/');

    // Check if we have the account ID stored from authentication flow
    const storedAccountId = localStorage.getItem('kite_auth_account_id');

    if (storedAccountId) {
      // Complete authentication for the stored account
      localStorage.removeItem('kite_auth_account_id');
      await completeAuth(storedAccountId, requestToken);
      localStorage.removeItem('kite_request_token');
    } else {
      // Fallback: Fetch accounts and use the first one
      await fetchAccounts();
      if (accounts.value.length > 0) {
        const accountId = accounts.value[0]._id;
        await completeAuth(accountId, requestToken);
        localStorage.removeItem('kite_request_token');
      }
    }
  }

  // Fetch accounts initially
  await fetchAccounts();

  // Auto-refresh every 60 seconds
  setInterval(fetchAccounts, 60000);
});
</script>
