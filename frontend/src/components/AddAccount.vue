<template>
  <div>
    <button
      @click="showModal = true"
      class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Account
    </button>

    <!-- Modal -->
    <div
      v-if="showModal"
      @click="closeModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
    >
      <div
        @click.stop
        class="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-8 border-b border-slate-200">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-1">
              Add New Account
            </h2>
            <p class="text-sm text-slate-600">Connect your Kite API account</p>
          </div>
          <button
            @click="closeModal"
            class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Form -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Account Name -->
          <div>
            <label for="accountName" class="block text-sm font-semibold text-slate-900 mb-2">
              Account Name
            </label>
            <input
              id="accountName"
              v-model="form.accountName"
              type="text"
              placeholder="e.g., Trading Account 1"
              required
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base text-slate-900 placeholder:text-slate-400"
            />
            <p class="mt-2 text-sm text-slate-500">
              A friendly name to identify this account
            </p>
          </div>

          <!-- API Key -->
          <div>
            <label for="apiKey" class="block text-sm font-semibold text-slate-900 mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              v-model="form.apiKey"
              type="text"
              placeholder="Your Kite API Key"
              required
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-base text-slate-900 placeholder:text-slate-400"
            />
            <p class="mt-2 text-sm text-slate-500">
              Get this from
              <a href="https://kite.trade/connect" target="_blank" class="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                Kite Connect
              </a>
            </p>
          </div>

          <!-- API Secret -->
          <div>
            <label for="apiSecret" class="block text-sm font-semibold text-slate-900 mb-2">
              API Secret
            </label>
            <input
              id="apiSecret"
              v-model="form.apiSecret"
              type="password"
              placeholder="Your Kite API Secret"
              required
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-base text-slate-900 placeholder:text-slate-400"
            />
            <p class="mt-2 text-sm text-slate-500">
              This will be encrypted and stored securely
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium text-red-700">{{ error }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-5 py-3 bg-white text-slate-700 text-base font-semibold rounded-xl hover:bg-slate-50 transition-all border-2 border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50"
            >
              <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

const form = reactive({
  accountName: '',
  apiKey: '',
  apiSecret: ''
});

const closeModal = () => {
  showModal.value = false;
  error.value = '';
  form.accountName = '';
  form.apiKey = '';
  form.apiSecret = '';
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
