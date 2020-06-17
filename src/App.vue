<template>
  <div id="app">

    <el-container>
      <el-container>
        <testplans ></testplans>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import TestPlans from '@/components/TestPlans'

export default {
  name: 'app',
  components: {
    'testplans': TestPlans
  }
}

</script>

<style>

</style>
