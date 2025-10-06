<template>
  <div>
    <button
      @click="showModal = true"
      class="px-5 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Account
    </button>

    <!-- Modal -->
    <div
      v-if="showModal"
      @click="closeModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        @click.stop
        class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 class="text-xl font-bold text-slate-900">
              Add New Account
            </h2>
            <p class="text-xs text-slate-600 mt-0.5">Connect your Kite API account</p>
          </div>
          <button
            @click="closeModal"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Account Name -->
          <div>
            <label for="accountName" class="block text-xs font-semibold text-slate-900 mb-1.5">
              Account Name
            </label>
            <input
              id="accountName"
              v-model="form.accountName"
              type="text"
              placeholder="e.g., Trading Account 1"
              required
              class="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm text-slate-900 placeholder:text-slate-400"
            />
            <p class="mt-1.5 text-xs text-slate-500">
              A friendly name to identify this account
            </p>
          </div>

          <!-- API Key -->
          <div>
            <label for="apiKey" class="block text-xs font-semibold text-slate-900 mb-1.5">
              API Key
            </label>
            <input
              id="apiKey"
              v-model="form.apiKey"
              type="text"
              placeholder="Your Kite API Key"
              required
              class="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-mono text-sm text-slate-900 placeholder:text-slate-400"
            />
            <p class="mt-1.5 text-xs text-slate-500">
              Get this from
              <a href="https://kite.trade/connect" target="_blank" class="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                Kite Connect
              </a>
            </p>
          </div>

          <!-- API Secret -->
          <div>
            <label for="apiSecret" class="block text-xs font-semibold text-slate-900 mb-1.5">
              API Secret
            </label>
            <input
              id="apiSecret"
              v-model="form.apiSecret"
              type="password"
              placeholder="Your Kite API Secret"
              required
              class="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-mono text-sm text-slate-900 placeholder:text-slate-400"
            />
            <p class="mt-1.5 text-xs text-slate-500">
              This will be encrypted and stored securely
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs font-medium text-red-700">{{ error }}</span>
            </div>
          </div>

          <!-- Redirect URL Note -->
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-xs text-blue-900 font-semibold mb-1.5">
              📌 Redirect URL for Kite App:
            </p>
            <div class="flex items-center gap-2">
              <code class="flex-1 text-xs font-mono text-blue-800 bg-white px-2 py-1 rounded border border-blue-200">
                http://localhost:3000/api/auth/callback
              </code>
              <button
                type="button"
                @click="copyRedirectURL"
                class="px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 rounded transition-colors"
              >
                {{ copied ? '✓' : 'Copy' }}
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2.5 pt-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{{ loading ? 'Creating...' : 'Create Account' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const emit = defineEmits(['created']);

const showModal = ref(false);
const loading = ref(false);
const error = ref('');
const copied = ref(false);

const form = reactive({
  accountName: '',
  apiKey: '',
  apiSecret: ''
});

const closeModal = () => {
  showModal.value = false;
  error.value = '';
  copied.value = false;
  form.accountName = '';
  form.apiKey = '';
  form.apiSecret = '';
};

const copyRedirectURL = async () => {
  try {
    await navigator.clipboard.writeText('http://localhost:3000/api/auth/callback');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (data.success) {
      emit('created', data.data);
      closeModal();
    } else {
      error.value = data.message || 'Failed to create account';
    }
  } catch (err) {
    console.error('Create account error:', err);
    error.value = 'Network error. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
