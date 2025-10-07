<template>
  <aside
    class="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0"
  >
    <!-- Logo/Header -->
    <div class="px-6 py-5 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-900 leading-tight">
            Kite Manager
          </h1>
          <p class="text-xs text-slate-500 leading-tight">Token Dashboard</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <div class="space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="
            isActive(item.path)
              ? 'bg-teal-50 text-teal-700'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          "
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Footer Info -->
    <div class="px-6 py-4 border-t border-slate-200">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"
        >
          <svg
            class="w-5 h-5 text-slate-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-900 truncate">
            Admin User
          </p>
          <p class="text-xs text-slate-500">Kite Manager</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";
import { h } from "vue";

const route = useRoute();

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: (props) =>
      h(
        "svg",
        {
          ...props,
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          }),
        ]
      ),
  },
  {
    name: "Accounts",
    path: "/accounts",
    icon: (props) =>
      h(
        "svg",
        {
          ...props,
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          }),
        ]
      ),
  },
  {
    name: "Settings",
    path: "/settings",
    icon: (props) =>
      h(
        "svg",
        {
          ...props,
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
          }),
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
          }),
        ]
      ),
  },
];

const isActive = (path) => {
  return route.path === path;
};
</script>
