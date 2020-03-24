import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ProteinDetailsView from '../views/ProteinDetailsView.vue'
import PathwaySearch from '../views/PathwaySearch.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path:'/protein-detail/:protein_name',
    name: "ProteinDetailsView",
    component: ProteinDetailsView
  },
  {
    path: '/pathway-search/:proteinName',
    name: "PathwaySearch",
    component: PathwaySearch
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
