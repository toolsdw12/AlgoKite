<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-bold text-slate-900 truncate pr-4">
        {{ account.accountName }}
      </h3>
      <button
        @click="handleDelete"
        title="Delete Account"
        class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Token Status -->
    <TokenStatus :account="account" :token="account.token" />

    <!-- Account Details -->
    <div class="mt-3 space-y-2">
      <div class="flex items-center justify-between gap-4 p-2.5 bg-slate-50 rounded-lg">
        <span class="text-xs font-semibold text-slate-600">API Key</span>
        <code class="text-xs font-mono text-slate-900 truncate max-w-[60%]">
          {{ account.apiKey }}
        </code>
      </div>

      <div v-if="account.token && account.token.userId" class="flex items-center justify-between gap-4 p-2.5 bg-slate-50 rounded-lg">
        <span class="text-xs font-semibold text-slate-600">User ID</span>
        <code class="text-xs font-mono text-slate-900">
          {{ account.token.userId }}
        </code>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-3 flex flex-col gap-2">
      <button
        v-if="!account.token || !account.token.isValid"
        @click="handleAuthenticate"
        :disabled="loading"
        class="w-full px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{{ loading ? 'Authenticating...' : 'Authenticate Now' }}</span>
      </button>

      <div v-else class="flex gap-2">
        <button
          @click="handleCopyToken"
          :disabled="copying"
          class="flex-1 px-3 py-2 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{{ copying ? 'Copied!' : 'Copy Token' }}</span>
        </button>

        <button
          @click="handleInvalidate"
          :disabled="loading"
          title="Invalidate Token"
          class="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TokenStatus from './TokenStatus.vue';

const props = defineProps({
  account: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['refresh', 'delete', 'authenticate', 'invalidate']);

const loading = ref(false);
const copying = ref(false);

const handleDelete = () => {
  if (confirm(`Are you sure you want to delete "${props.account.accountName}"?`)) {
    emit('delete', props.account._id);
  }
};

const handleAuthenticate = async () => {
  loading.value = true;
  try {
    emit('authenticate', props.account._id);
  } finally {
    loading.value = false;
  }
};

const handleCopyToken = async () => {
  copying.value = true;
  try {
    const response = await fetch(`http://localhost:3000/api/tokens/${props.account._id}/access`);
    const data = await response.json();

    if (data.success) {
      await navigator.clipboard.writeText(data.accessToken);
      setTimeout(() => {
        copying.value = false;
      }, 2000);
    } else {
      alert(data.message);
      copying.value = false;
    }
  } catch (error) {
    console.error('Copy token error:', error);
    alert('Failed to copy token');
    copying.value = false;
  }
};

const handleInvalidate = () => {
  if (confirm('Are you sure you want to invalidate this token?')) {
    emit('invalidate', props.account._id);
  }
};
</script>
