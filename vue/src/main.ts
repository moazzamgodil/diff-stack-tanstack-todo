import { createApp } from 'vue';
import {
    VueQueryPlugin,
    QueryClient
} from '@tanstack/vue-query';

import App from './App.vue';
import './style.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000
        }
    }
});

createApp(App)
    .use(VueQueryPlugin, {
        queryClient
    })
    .mount('#app');