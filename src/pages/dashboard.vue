<template>
  <SiteHeader />
  <v-navigation-drawer
    v-model="openFilters" 
    width="350"
  >
    <v-list-item
      v-if="mdAndDown" 
      title="Fetch a Friend"
      append-icon="mdi-close"
      @click="openFilters = false" 
    />
    <v-list-item
      v-else 
      title="Fetch a Friend Dog Finder"
    />
    <v-divider />
    <v-expansion-panels
      v-model="searchFilters"
      multiple
    >
      <v-expansion-panel
        title="Available Breeds"
      >
        <v-expansion-panel-text>
          <v-chip-group  
            v-model="breedSelection"
            column
            multiple
            filter
          >
            <v-chip
              v-for="(breed, index) in visibleBreeds"
              :key="index"
              :value="breed"
              label
              @click="addRemoveBreed(breed)"
            >
              {{ breed }}
            </v-chip>
          </v-chip-group>
          <v-chip 
            v-if="!showAll" 
            style="background-color: purple"
            variant="flat"
            @click="showMoreBreeds"
          >
            More...
          </v-chip>
          <v-chip
            v-else
            style="color: purple"
            variant="outlined"
            @click="showFewerBreeds"
          >
            Less...
          </v-chip>
          <v-btn
            v-if="showAll"
            variant="text"
            text="Show All"
            @click="showMoreBreeds"
          />
          <v-btn
            variant="text"
            text="Clear Breeds"
            @click="clearBreeds"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Age Range">
        <v-expansion-panel-text>
          <v-range-slider
            v-model="searchAge"
            min="0"
            max="14"
            step="1"
            thumb-label
            @update:model-value="resetCurrentPage"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog
      v-model="breedDialog" 
      width="50%"
    >
      <v-card v-if="!mdAndDown">
        <v-card-title>
          All Breeds
        </v-card-title>
        <v-container>
          <v-row>
            <v-col
              v-for="(breed, index) in paginatedBreeds"
              :key="index"
              cols="4"
              lg="3"
            >
              <v-list-item @click="addRemoveBreed(breed)">
                <v-list-item-title>
                  <v-icon
                    v-if="breedSelection.includes(breed)"
                    color="purple"
                    icon="mdi-check-circle"
                  />
                  {{ breed }}
                </v-list-item-title>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-pagination
              v-model="breedPage"
              :length="totalBreedPages"
              :total-visible="5"
              @update:model-value="changePage"
            />
          </v-row>
          <v-row class="d-flex justify-center">
            <v-btn
              color="purple"
              text="Apply Filter"
              @click="handleBreed"
            />
          </v-row>
        </v-container>
      </v-card>

      <v-card
        v-else
      >
        <v-card-title>
          All Breeds
          <v-btn 
            icon="mdi-close"
            @click="handleBreed"
          />
        </v-card-title>
        <v-virtual-scroll
          :items="breeds"
          item-height="48"
        >
          <template #default="{ item }">
            <v-list-item @click="addRemoveBreed(item)">
              <v-list-item-title>
                <v-icon
                  v-if="breedSelection.includes(item)"
                  color="purple"
                  icon="mdi-check-circle"
                />
                {{ item }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-virtual-scroll>
        <v-btn
          color="purple"
          text="Apply Filter"
          @click="handleBreed"
        />
      </v-card>
    </v-dialog>
    <v-footer 
      class="d-flex justify-center"
    >
      <v-btn
        text="Fetch Friends"
        class="ma-6"
        color="purple"
        @click="fetchDogs"
      />
    </v-footer>
  </v-navigation-drawer>
  <v-container>
    <v-row v-if="favStore.fullFavorites">
      <v-alert
        type="warning"
        title="Full Favorites"
        text="Your favorites list is currently full, please remove one or more before adding any more"
        closable
      />
    </v-row>
    <v-row>
      <v-col>
        <v-container 
          v-if="dogDetails.length > 0"
          fluid
        >
          <v-row>
            <v-col 
              cols="4" 
              md="2"
            >
              <v-select
                v-model="searchParams.sort"
                :items="sortOptions"
                item-title="label"
                item-value="value"
                label="Sort by"
                variant="outlined"
                @update:model-value="fetchDogs"
              />
            </v-col>
            <v-col 
              cols="4"
              md="2"
            >
              <v-select
                v-model="perPage"
                :items="[12, 24, 48, 96]"
                label="Items per Page"
                variant="outlined"
                @update:model-value="fetchDogs"
              />
            </v-col>
            <v-col
              cols="4"
              md="2"
            >
              <v-btn 
                v-if="mdAndDown"
                icon="mdi-filter" 
                @click="openFilters = true"
              />
            </v-col>
          </v-row>
          <v-row 
            v-if="dogIds"
            class="d-flex justify-center"
          >
            <v-col cols="4">
              <v-pagination
                v-model="currentPage" 
                :length="Math.ceil(dogIds.total / perPage)"
                @update:model-value="fetchDogs" 
              />
            </v-col>
          </v-row>

          <v-row v-if="dogIds">
            <v-col 
              v-for="(dog, index) in dogIds.resultIds" 
              :key="index"
              cols="12"
              md="6"
              xl="3"
            >
              <DogCard 
                :dog-image="dogDetails[index].img"
                :dog-id="dogDetails[index].id"
              >
                <template #name>
                  {{ dogDetails[index].name }}
                </template>
                <template #breed>
                  {{ dogDetails[index].breed }}
                </template>
              </DogCard>
            </v-col>
          </v-row>
          <v-row 
            v-if="dogIds && dogIds?.total > perPage"
            class="d-flex justify-center"
          >
            <v-col cols="4">
              <v-pagination
                v-model="currentPage" 
                :length="Math.ceil(dogIds.total / perPage)"
                @update:model-value="fetchDogs" 
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref, toRef, onMounted, computed } from 'vue';
  import { useDisplay } from 'vuetify';
  import { useFavoritesStore } from '@/stores/favorites';

  import type { SearchResults, Dog, SearchParams } from '@/types/apiTypes';

  // API variables
  const API_BASE = import.meta.env.VITE_API_URL;
  const dogIds = ref<SearchResults | null>(null);
  const dogDetails = ref<Dog[]>([]);
  const searchParams = ref<SearchParams>({
    breed: [],
    age: [0, 14],
    current_page: 1,
    per_page: 12
  });
  const currentPage = toRef(searchParams.value, 'current_page');
  const perPage = toRef(searchParams.value, 'per_page');
  const breedSelection = toRef(searchParams.value, 'breed');
  const searchAge = toRef(searchParams.value, 'age');
  const favStore = useFavoritesStore();


  // Display variables
  const breeds = ref<string[]>([]);
  const showAll = ref<boolean>(false);
  const searchFilters = ref([0, 1])
  const { mdAndDown } = useDisplay();
  const openFilters = ref<boolean | null>(null)
  const breedDialog = ref(false);
  const breedsPerPage = 40;
  const breedPage = ref(1);
  const totalBreedPages = computed(() => Math.ceil(breeds.value.length / breedsPerPage));

  // Methods

  const queryString = () => {
    const params = new URLSearchParams();

    if (searchParams.value.sort) {
      params.append("sort", searchParams.value.sort);
    }

    if (searchParams.value.breed?.length) {
      searchParams.value.breed.forEach((b) => {
        params.append("breeds", b);
      });
    }

    if (searchParams.value.age) {
      params.append("ageMin", searchParams.value.age[0].toString());
      params.append("ageMax", searchParams.value.age[1].toString());
    }

    params.append("from", ((searchParams.value.current_page - 1) * searchParams.value.per_page).toString());
    params.append("size", searchParams.value.per_page.toString())

    return params.toString();
  };

  const apiString = computed(() => queryString());

  
  const visibleBreeds = computed(() => showAll.value ? breeds.value.slice(0, 20) : breeds.value.slice(0,8))

  const sortOptions = ref([
    { label: "Alphabetically by breed (Ascending)", value: "breed:asc"},
    { label: "Alphabetically by breed (Descending)", value: "breed:desc"}
  ]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch(`${API_BASE}/dogs/breeds`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }
      const data = await response.json();

      breeds.value = data;
    } catch (error) {
      console.error("Error fetching breeds: ", error);
    }
  };

  const showMoreBreeds = () => {
    if (visibleBreeds.value.length >= 20) {
      breedDialog.value = true;
    } else {
      showAll.value = true;
    }
  };

  const showFewerBreeds = () => {
    showAll.value = false;
  }

  const clearBreeds = () => {
    breedSelection.value = [];
    fetchDogs();
  }

  const paginatedBreeds = computed(() => {
    const start = (breedPage.value - 1) * breedsPerPage;
    const end = start + breedsPerPage;
    return breeds.value.slice(start, end);
  })

  const changePage = (page: number) => {
    breedPage.value = page;
  }

  const handleBreed = () => {
    fetchDogs();
    breedDialog.value = false;
  }

  const fetchDogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/dogs/search?${apiString.value}`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }
      const data = await response.json();
      dogIds.value = data;
      if (dogIds.value) {
        fetchDetails(dogIds.value.resultIds)
      }
    } catch (error) {
      console.error("Error fetching dogs: ", error)
    }
  };

  const fetchDetails = async (ids: Array<string>) => {
    try {
      dogDetails.value = [];

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
      dogDetails.value = data;
    } catch (error) {
      console.error("Error fetching details: ", error)
    }
  };

  const addRemoveBreed = (breed: string) => {
    const index = searchParams.value.breed?.indexOf(breed);
    if (index === -1) {
      breedSelection.value = [...breedSelection.value, breed];
    } else {
      breedSelection.value = breedSelection.value.filter(b => b !== breed);
    }

    searchParams.value.current_page = 1
  }

  const resetCurrentPage = () => {
    searchParams.value.current_page = 1;
  }



  onMounted(() => {
    if (!searchParams.value.sort) {
      searchParams.value.sort = "breed:asc";
    };
    fetchBreeds();
    fetchDogs();
  })
</script>