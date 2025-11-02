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
    <VersionDisplay :updateAvailable="updateAvailable" :updateInfo="updateInfo" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VersionDisplay from './components/VersionDisplay.vue';
import { getAppVersion } from './utils/version';

const SEARCH_HISTORY_KEY = 'poke-assist-search-history';
const APP_VERSION_KEY = 'poke-assist-app-version';

interface UpdateInfo {
  available: boolean;
  currentVersion?: string;
  latestVersion?: string;
}

const updateAvailable = ref(false);
const updateInfo = ref<UpdateInfo>({ available: false });

async function checkForUpdates(): Promise<UpdateInfo> {
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
      return { available: false };
    }

    const commitData = await response.json();
    const latestCommitHash = commitData.sha?.substring(0, 8).toLowerCase();

    if (latestCommitHash && currentVersion !== latestCommitHash) {
      const result: UpdateInfo = {
        available: true,
        currentVersion,
        latestVersion: latestCommitHash
      };
      updateAvailable.value = true;
      updateInfo.value = result;
      console.log(`Update available: ${currentVersion} → ${latestCommitHash}`);
      return result;
    } else {
      console.log('No update needed - versions match');
      const result: UpdateInfo = { available: false, currentVersion, latestVersion: latestCommitHash };
      updateInfo.value = result;
      return result;
    }
  } catch (error) {
    console.warn('Failed to check for updates:', error);
    return { available: false };
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