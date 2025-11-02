<template>
    <div class="version-display" :class="{ 'version-loading': isLoading }">
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="version-label">v.{{ displayVersion }}</a>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAppVersion } from '../utils/version';

const displayVersion = ref('...');
const isLoading = ref(true);

const githubUrl = computed(() => {
    // Remove -dirty suffix for GitHub URL to avoid broken links
    const cleanVersion = displayVersion.value.toLowerCase().replace(/-dirty$/, '');
    return `https://github.com/tuxprogrammer/poke-assist/tree/${cleanVersion}`;
});

onMounted(async () => {
    try {
        displayVersion.value = await getAppVersion();
    } catch (error) {
        console.warn('Failed to load version:', error);
        displayVersion.value = '1.0.0';
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped>
.version-display {
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-size: 1.1rem;
    color: #cbd5e0;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    z-index: 1000;
    pointer-events: auto;
    background: rgba(45, 55, 72, 0.6);
    padding: 8px 12px;
    border-radius: 8px;
    backdrop-filter: blur(4px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.version-display:hover {
    opacity: 1;
    background: rgba(45, 55, 72, 0.8);
}

.version-loading {
    opacity: 0.4;
}

.version-label {
    font-weight: normal;
    font-size: 1.1rem;
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}

.version-label:hover {
    color: #63b3ed;
    text-decoration: underline;
}
</style>