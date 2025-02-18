<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useAuthStore } from './stores/auth';
  import { onMounted } from 'vue';

  const authStore = useAuthStore();

  onMounted(() => {
    authStore.checkStatus();
  });
</script>
