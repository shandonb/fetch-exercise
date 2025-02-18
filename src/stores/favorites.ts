import { defineStore } from "pinia";
import { ref } from "vue";

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<string[]>([])
    const fullFavorites = ref(false);

    const addToFavorites = (id: string) => {
      if (favorites.value.length < 100) {  
        favorites.value.push(id)
      }
      if (favorites.value.length == 100) {
        fullFavorites.value = true;
      }
    }

    const removeFromFavorites = (id: string) => {
      favorites.value = favorites.value.filter(favs => favs !== id)
      if (fullFavorites.value == true) {
        fullFavorites.value = false;
      }
    }

    return { favorites, fullFavorites, addToFavorites, removeFromFavorites }
  },
  {
    persist: {
      storage: sessionStorage,
    }
  }
)