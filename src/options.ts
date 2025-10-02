import App from "@/OptionsApp.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";

createApp(App).use(createPinia()).mount(document.body);
