import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import NotFound from "../views/error/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/search/:term",
    name: "Search",
    component: Home,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: () => import("../views/Docs/Documentation.vue"),
    meta: {
      title: "Docs",
    },
  },
  {
    path: "/documentation/userguide",
    name: "User Guide",
    component: () => import("../views/Docs/UserGuide.vue"),
    meta: {
      title: "User Guide",
    },
  },
  {
    path: "/documentation/downloads",
    name: "Downloads",
    component: () => import("../views/Docs/Downloads.vue"),
    meta: {
      title: "Downloads",
    },
  },
  {
    path: "/cite",
    name: "Cite",
    component: () => import("../views/Docs/Cite.vue"),
    meta: {
      title: "Cite Us",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    component: NotFound,
    meta: {
      title: "Error",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
