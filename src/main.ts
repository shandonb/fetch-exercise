/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Marquee from 'vue3-marquee'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import 'leaflet/dist/leaflet.css';

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
const app = createApp(App)

registerPlugins(app)

app.use(pinia)
app.use(Vue3Marquee, { name: "Vue3Marquee" })
app.mount('#app')
