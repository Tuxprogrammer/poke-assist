import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home.vue'),
    },
    {
        path: '/pokemon/:id/:generation?',
        name: 'Pokemon',
        component: () => import('./views/PokemonDetail.vue'),
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(), // Enables browser back/forward button functionality
    routes,
});

export default router;