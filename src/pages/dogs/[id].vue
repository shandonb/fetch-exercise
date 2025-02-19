<template>
  <SiteHeader />
  <v-container v-if="dogDetails">
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
      <!-- <span> {{ dogDetails.name }}</span> -->
      <v-container>
        <v-row>
          <v-col 
            cols="12" 
            lg="8"
          >
            <v-img
              :src="dogDetails.img"
              contain
            />
          </v-col>
          <v-col 
            cols="12"
            md="4"
          >
            <v-container>
              <v-row class="justify-center">
                <span class="text-h1"> {{ dogDetails.name }}</span>
              </v-row>
              <v-row class="justify-space-between">
                <v-col
                  class="justify-start"
                  cols="4"
                >
                  <span class="text-h5">{{ dogDetails.age }} yrs, {{ dogDetails.breed }}</span>
                </v-col>
                <v-col 
                  class="justify-end"
                  cols="4"
                >
                  <span class="text-h5">{{ dogLocation?.city }}, {{ dogLocation?.state }} {{ dogLocation?.zip_code }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span>About {{ dogDetails.name }}:</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <LocationMap
                    v-if="dogLocation"
                    :lat="dogLocation?.latitude"
                    :lon="dogLocation?.longitude"
                    :name="dogDetails.name"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { Dog, Location } from '@/types/apiTypes'

const route = useRoute();
const API_BASE = import.meta.env.VITE_API_URL;
const dogId= <string>route.params.id;

const dogDetails = ref<Dog | null>(null);
const dogLocation = ref<Location | null>(null);

const fetchDogDetails = async (id: string) => {
  const idArray = [id];
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
    dogDetails.value = Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(`Error fetching details: ${error}`)
  }
};

const fetchLocation = async (zip: string) => {
  const zipArray = [zip];
  try {
    const response = await fetch(`${API_BASE}/locations`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(zipArray),
      method: "POST",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`)
    }
    const data = await response.json();
    dogLocation.value = Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(`Error fetching location: ${error}`)
  }
};

const loadDetails = async (id: string) => {
  try {
    await fetchDogDetails(id);
    if (dogDetails.value) {
      await fetchLocation(dogDetails.value.zip_code)
    }
  } catch (error) {
    console.error(`Error loading data: ${error}`);
  }
}

onMounted(() => {
  loadDetails(dogId);
})
</script>