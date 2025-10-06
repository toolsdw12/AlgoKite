<template>
  <div :class="statusBgClass" class="relative overflow-hidden rounded-xl p-4 border-l-4 transition-all duration-200">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" :class="patternClass"></div>
    </div>

    <div class="relative flex items-center gap-4">
      <div :class="iconBgClass" class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md">
        <svg class="w-6 h-6" :class="iconClass" fill="currentColor" viewBox="0 0 20 20">
          <path v-if="status === 'active'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          <path v-else-if="status === 'expiring_soon'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          <path v-else-if="status === 'expired'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div :class="statusTextClass" class="font-bold text-base mb-1 flex items-center gap-2">
          {{ statusText }}
          <span v-if="status === 'active'" class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        <div class="text-sm text-slate-700 font-medium">
          {{ timeInfo }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  token: {
    type: Object,
    default: null
  },
  account: {
    type: Object,
    required: true
  }
});

// Calculate status
const status = computed(() => {
  if (!props.token || !props.token.exists) return 'no_token';
  if (!props.token.isValid) return 'expired';

  const hoursLeft = props.token.hoursLeft || 0;
  if (hoursLeft < 1) return 'expiring_soon';

  return 'active';
});

// Status indicators
const statusText = computed(() => {
  const texts = {
    active: 'Active & Valid',
    expiring_soon: 'Expiring Soon',
    expired: 'Token Expired',
    no_token: 'Not Authenticated'
  };
  return texts[status.value];
});

const statusBgClass = computed(() => {
  const classes = {
    active: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500',
    expiring_soon: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-yellow-500',
    expired: 'bg-gradient-to-r from-red-50 to-rose-50 border-l-red-500',
    no_token: 'bg-gradient-to-r from-slate-50 to-gray-50 border-l-slate-400'
  };
  return classes[status.value];
});

const iconBgClass = computed(() => {
  const classes = {
    active: 'bg-gradient-to-br from-green-100 to-emerald-100',
    expiring_soon: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    expired: 'bg-gradient-to-br from-red-100 to-rose-100',
    no_token: 'bg-gradient-to-br from-slate-100 to-gray-100'
  };
  return classes[status.value];
});

const iconClass = computed(() => {
  const classes = {
    active: 'text-green-600',
    expiring_soon: 'text-yellow-600',
    expired: 'text-red-600',
    no_token: 'text-slate-600'
  };
  return classes[status.value];
});

const statusTextClass = computed(() => {
  const classes = {
    active: 'text-green-800',
    expiring_soon: 'text-yellow-800',
    expired: 'text-red-800',
    no_token: 'text-slate-800'
  };
  return classes[status.value];
});

const patternClass = computed(() => {
  const classes = {
    active: 'bg-green-600',
    expiring_soon: 'bg-yellow-600',
    expired: 'bg-red-600',
    no_token: 'bg-slate-600'
  };
  return classes[status.value];
});

const timeInfo = computed(() => {
  if (!props.token || !props.token.exists) {
    return 'Click "Authenticate" button to get started';
  }

  if (!props.token.isValid) {
    return 'Expired at 6:00 AM IST - Re-authentication required';
  }

  const hours = props.token.hoursLeft || 0;
  const minutes = props.token.minutesLeft || 0;

  return `Valid for ${hours}h ${minutes}m (Expires at 6:00 AM)`;
});
</script>
