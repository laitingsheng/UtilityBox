import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./OptionsApp.vue";

createApp(App).use(createPinia()).mount(document.body);
