import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./OptionsApp.vue";
import "./assets/main.css";

createApp(App).use(createPinia()).mount(document.body);
