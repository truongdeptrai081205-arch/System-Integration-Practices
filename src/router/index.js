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
    path: "/admin/personal-list",
    component: () => import("../components/PersonalList/index.vue"),
    meta: { layout: "admin" },
    },

    {
    path: "/admin/benefit-plans",
    component: () => import("../components/BenefitPlans/index.vue"),
    meta: { layout: "admin" },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;