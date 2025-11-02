<template>
  <div class="container">
    <header class="header">
      <h1>
        <router-link to="/" class="header-link">Poke-Assist</router-link>
      </h1>
      <p>Type Effectiveness Lookup</p>
    </header>

    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>