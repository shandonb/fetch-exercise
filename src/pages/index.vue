<template>
  <SiteHeader />
  <v-container class="align-center flex-wrap">
    <v-row class="justify-center flex-wrap mb-8">
      <v-col 
        cols="12" 
        class="d-flex justify-center"
      >
        <img 
          src="/ffLogo.svg" 
          alt="Find a Friend"
          class="logo-image"
        >
      </v-col>
    </v-row>
    <v-row class="justify-center flex-wrap">
      <v-col 
        cols="12" 
        class="d-flex justify-center"
      >
        <span class="text-lg-h2 text-md-h4 font-weight-bold text-center">
          Today could be the day you help 
          <span
            class="animated-text text-decoration-underline"
            :style="{ width: fixedWidth + 'px' }"
          >
            <v-fade-transition mode="out-in">
              <span :key="currentIndex">{{ currentName }}</span>
            </v-fade-transition>
          </span>
          find a furrever home
        </span>
      </v-col>
    </v-row>
    <v-row class="justify-center flex-wrap my-8">
      <v-col
        cols="12"
        class="d-flex justify-center"
      >
        <Vue3Marquee
          :duration="40"
          :gradient="true"
        >
          <MarqueeCard
            v-for="(dog, index) in previewDogs"
            :key="index"
            :dog-image="dog.image"
          >
            <template #name>
              {{ dog.name }}
            </template>
            <template #breed>
              {{ dog.breed }}
            </template>
          </MarqueeCard>
        </Vue3Marquee>
      </v-col>
    </v-row>
    <v-row class="justify-center flex-wrap my-8">
      <v-col
        cols="12"
        class="d-flex justify-center"
      >
        <v-dialog max-width="500">
          <template #activator="{ props: activatorProps }">
            <v-btn 
              color="purple"
              size="x-large"
              v-bind="activatorProps"
              text="Let's Get Started"
            />
          </template>

          <template #default>
            <v-card
              title="Login"
              class="pa-12"
            >
              <form @submit.prevent="submit">
                <v-text-field
                  v-model="name.value.value"
                  :error-messages="name.errorMessage.value"
                  label="Name"
                />
                <v-text-field
                  v-model="email.value.value"
                  :error-messages="email.errorMessage.value"
                  label="E-Mail Address"
                />
                <v-btn type="submit">
                  Submit
                </v-btn>            
              </form>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import MarqueeCard from '@/components/MarqueeCard.vue';
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { Vue3Marquee } from 'vue3-marquee';
  import { useAuthStore } from '@/stores/auth';
  import { useField, useForm } from 'vee-validate';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  const names = ref(['Emory', 'Jena', 'Jenifer', 'Carolyne', 'Brandy', 'Seamus', 'Garnett'])
  const currentIndex = ref(0);
  const currentName = computed(() => names.value[currentIndex.value]);
  const fixedWidth = ref(80);

  // Adding a basic array of dogs to preview for unauthenticated users
  const previewDogs = [
    {
      name: "Emory",
      age: 10,
      breed: "Chihuahua",
      image: "/dog-pictures/001.jpg"
    },
    {
      name: "Jena",
      age: 8,
      breed: "Chihuahua",
      image: "/dog-pictures/002.jpg"
    },
    {
      name: "Jenifer",
      age: 14,
      breed: "Chihuahua",
      image: "/dog-pictures/003.jpg"
    },
    {
      name: "Carolyne",
      age: 3,
      breed: "Chihuahua",
      image: "/dog-pictures/004.jpg"
    },
    {
      name: "Brandy",
      age: 5,
      breed: "Chihuahua",
      image: "/dog-pictures/005.jpg"
    },
    {
      name: "Seamus",
      age: 2,
      breed: "Chihuahua",
      image: "/dog-pictures/006.jpg"
    },
    {
      name: "Garnett",
      age: 0,
      breed: "Chihuahua",
      image: "/dog-pictures/007.jpg"
    }
  ];

  // Authentication logic
  const { handleSubmit } = useForm({
    validationSchema: {
      name (value: string) {
        if (value?.length >= 2) return true
        return 'Name should be at least 2 characters.'
      },
      email (value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
        return 'Must be a valid e-mail address.'
      }
    }
  })
  const name = useField('name');
  const email = useField('email');

  const submit = handleSubmit(async (values) => {
    const success = await authStore.login(values.name, values.email);
    if (success) {
      router.push('/dashboard');
    }
  });

  onMounted(() => {
    setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % names.value.length;
    }, 2000);
  });

  nextTick(() => {
    const animatedText = document.querySelector(".animated-text")
    if (!animatedText) return;
    const longestName = names.value.reduce((a, b) => (a.length > b.length ? a : b));
    const span = document.createElement("span");
    const computedStyle = window.getComputedStyle(animatedText);

    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "nowrap";
    span.style.fontSize = computedStyle.fontSize;
    span.style.fontFamily = computedStyle.fontFamily;
    span.style.fontWeight = computedStyle.fontWeight;
    span.textContent = longestName;
    document.body.appendChild(span);
    fixedWidth.value = span.offsetWidth;
    document.body.removeChild(span);
  });
</script>

<style scoped>
.animated-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.logo-image {
  max-width: 500px;
  width: 30%;
}
</style>