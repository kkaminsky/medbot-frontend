import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import AddPlatformAccount from "@/components/AddPlatformAccount";
import UserAccount from "@/components/UserAccount";

Vue.use(VueRouter)

const routes = [

  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'add_platform_account',
    path: '/sync/platform',
    component: AddPlatformAccount
  },
  {
    name: 'user_account',
    path: '/user/account',
    component: UserAccount
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
