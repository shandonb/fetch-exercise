<template>
  <v-container>
    <div 
      ref="mapContainer" 
      class="map-container"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from 'vue';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const props = defineProps<{
  lat: number;
  lon: number;
  name: string;
}>();

const mapContainer = ref<HTMLElement | null>(null);
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

onMounted(() => {
  if (mapContainer.value) {
    const map = L.map(mapContainer.value).setView([props.lat, props.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([props.lat, props.lon], { icon: customIcon }).addTo(map);
    marker.bindPopup(`${props.name}`)
  }
});
</script>

<style scoped>
.map-container {
  height: 500px;
  width: 100%;
}
</style>