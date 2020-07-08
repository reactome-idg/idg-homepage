import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: () => import ('../views/Docs/Documentation.vue'),
    meta: {
      title: "Docs"
    }
  },
  {
    path: "/cite",
    name: "Cite",
    component: () => import ('../views/Docs/Cite.vue'),
    meta: {
      title: "Cite Us"
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
