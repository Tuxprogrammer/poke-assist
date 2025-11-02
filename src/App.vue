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
import VersionDisplay from './components/VersionDisplay.vue';
</script>