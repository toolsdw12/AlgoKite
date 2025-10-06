<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-xl font-bold text-slate-900 truncate pr-4">
        {{ account.accountName }}
      </h3>
      <button
        @click="handleDelete"
        title="Delete Account"
        class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Token Status -->
    <TokenStatus :account="account" :token="account.token" />

    <!-- Account Details -->
    <div class="mt-5 space-y-3">
      <div class="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/50">
        <span class="text-sm font-semibold text-slate-700">API Key</span>
        <code class="text-sm font-mono text-slate-800 truncate max-w-[60%]">
          {{ account.apiKey }}
        </code>
      </div>

      <div v-if="account.token && account.token.userId" class="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50/50 rounded-xl border border-indigo-200/50">
        <span class="text-sm font-semibold text-slate-700">User ID</span>
        <code class="text-sm font-mono text-indigo-800">
          {{ account.token.userId }}
        </code>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex flex-col gap-3">
      <button
        v-if="!account.token || !account.token.isValid"
        @click="handleAuthenticate"
        :disabled="loading"
        class="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50"
      >
        <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{{ loading ? 'Authenticating...' : 'Authenticate Now' }}</span>
      </button>

      <div v-else class="flex gap-3">
        <button
          @click="handleCopyToken"
          :disabled="copying"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-200/50 hover:shadow-xl hover:shadow-green-300/50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{{ copying ? 'Copied!' : 'Copy Token' }}</span>
        </button>

        <button
          @click="handleInvalidate"
          :disabled="loading"
          title="Invalidate Token"
          class="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
