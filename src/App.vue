<template>
  <div class="container">
    <header class="header">
      <h1>
        <router-link to="/" class="header-link">Poke-Assist</router-link>
      </h1>
      <p>Type Effectiveness Lookup</p>
    </header>

    <router-view />

    <!-- Version display in bottom-right corner -->
    <VersionDisplay />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import VersionDisplay from './components/VersionDisplay.vue';
import { getAppVersion } from './utils/version';

const SEARCH_HISTORY_KEY = 'poke-assist-search-history';
const APP_VERSION_KEY = 'poke-assist-app-version';

onMounted(async () => {
  try {
    // Get current app version
    const currentVersion = await getAppVersion();

    // Get stored version from localStorage
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);

    // If versions don't match, clear history and update stored version
    if (storedVersion !== currentVersion) {
      console.log(`App version changed from ${storedVersion || 'unknown'} to ${currentVersion}, clearing search history`);

      // Clear search history
      localStorage.removeItem(SEARCH_HISTORY_KEY);

      // Store new version
      localStorage.setItem(APP_VERSION_KEY, currentVersion);
    }
  } catch (error) {
    console.warn('Failed to check app version:', error);
  }
});
</script>