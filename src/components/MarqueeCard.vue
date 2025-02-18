<template>
  <v-card 
    width="100%" 
    min-width="500px"
    class="ma-3 pa-6"
    :elevation="5"
  >
    <v-img 
      :src="dogImage"
      height="500px"
      cover
    />
    <v-card-title class="text-lg-h4">
      <slot name="name">
        Seamus
      </slot>
    </v-card-title>
    <v-card-subtitle>
      <slot name="breed">
        Chihuahua
      </slot>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  dogImage?: string
}>()
</script>