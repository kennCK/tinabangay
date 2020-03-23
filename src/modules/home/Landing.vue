<template>
	<div class="body">
		<landing-banner></landing-banner>
	</div>
</template>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
export default {
  components: {
    'landing-banner': require('modules/home/Landing/Banner.vue')
  },
  mounted(){
  },
  data(){
    return {
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
<style scoped>
.body{
	margin: 0px;
}
</style>
