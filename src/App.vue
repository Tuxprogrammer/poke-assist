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
    <VersionDisplay :updateAvailable="updateAvailable" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VersionDisplay from './components/VersionDisplay.vue';
import { getAppVersion } from './utils/version';

const SEARCH_HISTORY_KEY = 'poke-assist-search-history';
const APP_VERSION_KEY = 'poke-assist-app-version';

const updateAvailable = ref(false);

async function checkForUpdates(): Promise<void> {
  try {
    // Get current version
    const currentVersionRaw = await getAppVersion();
    const currentVersion = currentVersionRaw.toLowerCase();

    // Fetch the latest commit hash from the main branch
    const response = await fetch('https://api.github.com/repos/Tuxprogrammer/poke-assist/commits/main', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      console.warn('Failed to check for updates:', response.status);
      return;
    }

    const commitData = await response.json();
    const latestCommitHash = commitData.sha?.substring(0, 8).toLowerCase();

    if (latestCommitHash && currentVersion !== latestCommitHash) {
      updateAvailable.value = true;
      console.log(`Update available: ${currentVersion} → ${latestCommitHash}`);
    } else {
      console.log('No update needed - versions match');
    }
  } catch (error) {
    console.warn('Failed to check for updates:', error);
  }
}



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

    // Check for available updates
    await checkForUpdates();
  } catch (error) {
    console.warn('Failed to check app version:', error);
  }
});
</script>