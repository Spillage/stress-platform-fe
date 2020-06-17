import Vue from 'vue'
import Router from 'vue-router'
import TestPlan from '../components/TestPlan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'testplan',
      component: TestPlan
    }
  ]
})
