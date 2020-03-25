<template>
  <div style="margin-bottom: 200px;">
    <div class="row" style="margin-top: 25px;">
      <div class="col-lg-6" style="margin-bottom: 25px;">
        <p>
          Hi <b class="text-primary">{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature.
        </p>
        <qr-code></qr-code>
      </div>
      <div class="col-lg-6" style="margin-bottom: 25px;">
        <p>
          List of places visited by affected individual
        </p>
        <trend></trend>
      </div>
    </div>
    <div class="row" style="margin-bottom: 25px;">
      <div class="col-lg-6">
        <p>
          Summary of temperature within Locality
        </p>
        <temperature-summary></temperature-summary>
      </div>
    </div>
  </div>
</template>
<style scoped>
.half-rule {
  margin-left: 0;
  text-align: left;
  width: 50%;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
export default{
  data(){
    return {
      user: AUTH.user
    }
  },
  props: {
  },
  components: {
    'trend': require('modules/places/Trend.vue'),
    'qr-code': require('modules/dashboard/QrCode.vue'),
    'temperature-summary': require('modules/temperature/Summary.vue')
  },
  methods: {
  }
}
</script>
