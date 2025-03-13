import Home from "@/pages/Home.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/profile',
        component: () => import('./pages/Profile.vue')
    },
    {
        path: '/restaurants',
        component: () => import('./pages/Restaurants.vue')
    },
    {
        path: '/restaurants/:id/write-review',
        component: () => import('./pages/RestaurantReview.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router