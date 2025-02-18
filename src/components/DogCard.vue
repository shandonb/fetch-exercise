<template>
  <v-card
    width="100%"
    max-width="800px"
    class="pa-6"
  >
    <v-img
      :src="dogImage"
      height="500px"
      cover
    />
    <v-card-title class="text-lg-h4">
      <slot name="name">
        Name
      </slot>
    </v-card-title>
    <v-card-subtitle>
      <slot name="breed">
        Breed
      </slot>
    </v-card-subtitle>
    <v-row class="d-flex justify-center mt-8">
      <v-col 
        cols="6"
        md="4"
      >
        <v-btn @click="dogRedirect">
          Details
        </v-btn>
      </v-col>
      <v-col 
        cols="6"
        md="4"
      >
        <v-btn
          v-if="!isFavorite"
          class="mx-2"
          color="purple"
          text="Favorite"
          @click="handleFavorite(dogId)"
        />
        <v-btn
          v-else
          class="mx-2"
          color="purple"
          variant="outlined"
          text="Unfavorite"
          @click="handleFavorite(dogId)"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritesStore } from '@/stores/favorites';

const favStore = useFavoritesStore();
const router = useRouter();

const isFavorite = computed(() => favStore.favorites.includes(props.dogId));

const props = defineProps<{
  dogImage: string,
  dogId: string
}>();

const dogRedirect = () => {
  router.push(`/dogs/${props.dogId}`);
}

const handleFavorite = (id: string) => {
  if (favStore.favorites.includes(id)) {
    favStore.removeFromFavorites(id);
  } else {

    favStore.addToFavorites(id);
  }
}
</script>