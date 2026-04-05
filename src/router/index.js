import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import("../components/Dashboard/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/benefit-plans",
        component: () => import("../components/BenefitPlans/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/personal-list",
        component: () => import("../components/PersonalList/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/anniversary",
        component: () => import("../components/Anniversary/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/birthday",
        component: () => import("../components/Birthday/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;