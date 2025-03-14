/**
 * Router configuration module for the application
 * @module router
 */

import Home from "@/pages/Home.vue";
import {createRouter, createWebHistory} from "vue-router";

/**
 * Application routes configuration array
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
    /**
     * Home page route
     * Directly imports the Home component for immediate loading
     * @type {import('vue-router').RouteRecordRaw}
     */
    {
        path: '/',
        component: Home
    },
    /**
     * User profile page route
     * Uses lazy loading for code-splitting
     * @type {import('vue-router').RouteRecordRaw}
     */
    {
        path: '/profile',
        component: () => import('./pages/Profile.vue')
    },
    /**
     * Restaurants listing page route
     * Uses lazy loading for code-splitting
     * @type {import('vue-router').RouteRecordRaw}
     */
    {
        path: '/restaurants',
        component: () => import('./pages/Restaurants.vue')
    },
    /**
     * Restaurant review creation page route
     * Dynamic route with restaurant ID parameter
     * Uses lazy loading for code-splitting
     * @type {import('vue-router').RouteRecordRaw}
     */
    {
        path: '/restaurants/:id/write-review',
        component: () => import('./pages/RestaurantReview.vue')
    },
    /**
     * Contact page route
     * Uses lazy loading for code-splitting
     * @type {import('vue-router').RouteRecordRaw}
     */
    {
        path: '/contact',
        component: () => import('./pages/Contact.vue')
    }
]

/**
 * Creates and configures the Vue Router instance with HTML5 history mode
 * @type {import('vue-router').Router}
 */
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;