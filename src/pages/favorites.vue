<template>
  <SiteHeader />
  <v-container>
    <v-row>
      <router-link to="/dashboard">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          text="Back to Search"
          color="purple"
        />
      </router-link>
    </v-row>
    <v-row>
      <v-col 
        v-for="(dog, index) in favoriteDogs"
        :key="index"
        cols="12"
        md="6"
        xl="3"
      >
        <DogCard
          :dog-image="favoriteDogs[index].img"
          :dog-id="favoriteDogs[index].id"
        >
          <template #name>
            {{ favoriteDogs[index].name }}
          </template>
          <template #breed>
            {{ favoriteDogs[index].breed }}
          </template>
        </DogCard>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col
        cols="4"
        md="3"
        class="d-flex justify-end"
      >
        <v-btn
          color="purple"
          :disabled="favStore.favorites.length === 0"
          text="Find my Match!"
          @click="matchDog(favIds)"
        />
      </v-col>
      <v-col
        cols="4"
        md="3"
      >
        <v-btn
          color="purple"
          :disabled="favStore.favorites.length === 0"
          text="Clear Favorites"
          variant="outlined"
          @click="clearFavs"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-dialog
    v-model="matchOverlay"
    width="50%"
  >
    <ConfettiExplosion 
      v-if="visible" 
      :stage-height="4000" 
      :stage-width="4000" 
      :colors="['purple']" 
    />
    <v-card>
      <v-card-title class="text-center">
        Congratulations! You've been matched with:
      </v-card-title>
      <v-container class="d-flex justify-center">
        <DogCard
          v-if="matchedDetails"
          :dog-image="matchedDetails[0].img"
          :dog-id="matchedDetails[0].id"
          class="mb-16"
        >
          <template #name>
            {{ matchedDetails[0].name }}
          </template>
          <template #breed>
            {{ matchedDetails[0].breed }}
          </template>
        </DogCard>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useFavoritesStore } from '@/stores/favorites';
import ConfettiExplosion from 'vue-confetti-explosion';

import type { Dog, Match } from '@/types/apiTypes';

const API_BASE = import.meta.env.VITE_API_URL;
const favStore = useFavoritesStore();
const favIds = computed(() => favStore.favorites);
const favoriteDogs = ref<Dog[]>([]);
const visible = ref(false);
const matchOverlay = ref(false);
const matchedId = ref<Match>();
const matchedDetails = ref<Dog[]>([]);

const fetchFavs = async (ids: Array<string>) => {
  try {
    const response = await fetch(`${API_BASE}/dogs`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ids),
      method: "POST",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    const data = await response.json();
    favoriteDogs.value = data;
  } catch (error) {
    console.error(`Error fetching details: ${error}`)
  }
};

const fetchMatch = async (id: string) => {
  const idArray = [id]
  try {
    const response = await fetch(`${API_BASE}/dogs`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(idArray),
      method: "POST",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    const data = await response.json();
    matchedDetails.value = data;
  } catch (error) {
    console.error(`Error fetching match: ${error}`);
  }
}

const confetti = async () => {
  visible.value = false;
  await nextTick();
  visible.value = true;
}

const matchDog = async (ids: string[]) => {
  try {
    const response = await fetch(`${API_BASE}/dogs/match`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ids),
      method: "POST",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    const data = await response.json();
    matchedId.value = data;
  } catch (error) {
    console.error(`Error fetching match: ${error}`);
  }
  if (matchedId.value?.match){
    await fetchMatch(matchedId.value.match)
    matchOverlay.value = true;
    confetti();
  }
}

const clearFavs = () => {
  favStore.favorites = [];
}

watch(() => favStore.favorites, (newVal) => {
  fetchFavs(newVal);
})

onMounted(() => {
  fetchFavs(favIds.value);
})
</script>