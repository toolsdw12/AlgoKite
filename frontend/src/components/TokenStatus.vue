<template>
  <div :class="statusBgClass" class="rounded-lg p-3 border transition-colors">
    <div class="flex items-center gap-2.5">
      <div :class="iconBgClass" class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
        <svg class="w-5 h-5" :class="iconClass" fill="currentColor" viewBox="0 0 20 20">
          <path v-if="status === 'active'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          <path v-else-if="status === 'expiring_soon'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          <path v-else-if="status === 'expired'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div :class="statusTextClass" class="font-bold text-sm mb-0.5">
          {{ statusText }}
        </div>
        <div class="text-xs text-slate-600">
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
    active: 'bg-emerald-50 border-emerald-200',
    expiring_soon: 'bg-amber-50 border-amber-200',
    expired: 'bg-red-50 border-red-200',
    no_token: 'bg-amber-50 border-amber-200'
  };
  return classes[status.value];
});

const iconBgClass = computed(() => {
  const classes = {
    active: 'bg-emerald-100',
    expiring_soon: 'bg-amber-100',
    expired: 'bg-red-100',
    no_token: 'bg-amber-100'
  };
  return classes[status.value];
});

const iconClass = computed(() => {
  const classes = {
    active: 'text-emerald-600',
    expiring_soon: 'text-amber-600',
    expired: 'text-red-600',
    no_token: 'text-amber-600'
  };
  return classes[status.value];
});

const statusTextClass = computed(() => {
  const classes = {
    active: 'text-emerald-700',
    expiring_soon: 'text-amber-700',
    expired: 'text-red-700',
    no_token: 'text-amber-700'
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
