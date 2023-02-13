<template>
  <div id="app">
    <SvgMap />
  </div>
</template>

<script>
import SvgMap from '@/components/SvgMap'
export default {
  name: 'App',
  components: {
    SvgMap
  }
}
</script>

<style>
html body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
