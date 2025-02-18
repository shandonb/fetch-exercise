<template>
  <v-container>
    <v-app-bar 
      :elevation="0"
      class="d-flex"
      rounded
    >
      <v-app-bar-nav-icon 
        class="me-auto"
        icon="mdi-home"
        to="/"
      />
      <v-btn
        v-if="authStore.isAuthenticated == true"
        color="purple"
        variant="outlined"
        to="/favorites"
        :text="`View Favorites (${favStore.favorites.length})`"
      />
      <v-btn 
        v-if="authStore.isAuthenticated == true"
        @click="logout"
      >
        Logout
      </v-btn>
      <v-dialog 
        v-else 
        max-width="500"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            text="Login"
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
                label="E-mail Address"
              />

              <v-btn type="submit">
                Submit
              </v-btn>
            </form>
          </v-card>
        </template>
      </v-dialog>
    </v-app-bar>
  </v-container>
</template>

<script Lang="ts" setup>
  import { useAuthStore } from '@/stores/auth';
  import { useFavoritesStore } from '@/stores/favorites';
  import { useField, useForm } from 'vee-validate';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const favStore = useFavoritesStore();
  
  const { handleSubmit } = useForm({
    validationSchema: {
      name (value) {
        if (value?.length >= 2) return true
        return 'Name should be at least 2 characters.'
      },
      email (value) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
        return 'Must be a valid e-mail address.'
      }
    }
  })
  const name = useField('name')
  const email = useField('email')

  const submit = handleSubmit(async (values) => {
    const success = await authStore.login(values.name, values.email);
    if (success) {
      router.push('/dashboard');
    }
  });

  const logout = async () => {
    await authStore.logout();
    router.push('/');
  }
</script>