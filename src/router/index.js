import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PathwaySearch from '../views/PathwaySearch.vue'

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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: () => import ('../views/Docs/Documentation.vue')
  },
  {
    path: "/cite",
    name: "Cite",
    component: () => import ('../views/Docs/Cite.vue')
  },
  {
    path: '/pathway-search/:proteinName',
    name: "PathwaySearch",
    component: PathwaySearch,
    meta: {
      title: "Pathway Search"
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
