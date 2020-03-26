<template>
	<div class="body">
		<landing-banner></landing-banner>
    <landing-features></landing-features>
    <landing-contributors></landing-contributors>
    <landing-donations></landing-donations>
    <landing-sponsors></landing-sponsors>
	</div>
</template>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
export default {
  components: {
    'landing-banner': require('modules/home/Landing/Banner.vue'),
    'landing-features': require('modules/home/Landing/Features.vue'),
    'landing-donations': require('modules/home/Landing/Donations.vue'),
    'landing-contributors': require('modules/home/Landing/Contributors.vue'),
    'landing-sponsors': require('modules/home/Landing/Sponsors.vue')
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
