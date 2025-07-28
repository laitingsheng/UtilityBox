import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./OptionsApp.vue";

createApp(App).use(createPinia()).mount(document.body);
