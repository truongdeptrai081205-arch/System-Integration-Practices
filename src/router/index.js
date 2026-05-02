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
        path: "/presonal",
        component: () => import("../components/PresonalList/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/vadationlist",
        component: () => import("../components/Vadation/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/JobHistory-list",
        component: () => import("../components/JobHistory/index.vue"),
        meta: {
            layout: "admin",
        },
    },
    {
        path: "/Brithday-list",
        component: () => import("../components/Birthday/index.vue"),
        meta: {
            layout: "admin",
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;