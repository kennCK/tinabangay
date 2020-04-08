<template>
  <div style="margin-bottom: 200px;">
    <div class="row" style="margin-top: 25px;">
      <div class="col-lg-6" style="margin-bottom: 25px;">
        <div class="row mx-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3">
          Your Status
        </div>
        <label class="text-primary">
          <i class="fas fa-square" style="margin-right: 5px;"></i>
          <!-- Person Under Investigation(PUI) -->
          COMING SOON!
        </label>
        <div class="row mx-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3 mt-4">
          Current Data
        </div>
        <div class="alert alert-info">This information is not updated as some users are not registered yet</div>
        <data-summary></data-summary>
        <div class="row mx-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3">
          QR Code
        </div>
        <p>
          Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature or show this to DOH authorized personnel.
        </p>
        <div class="row justify-content-center pt-5">
          <qr-code></qr-code>
        </div>
      </div>
      <trend></trend>
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
}

.text-primary {
  color: $primary !important;
}

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
import CONFIG from 'src/config.js'
export default{
  data(){
    return {
      user: AUTH.user,
      property: {
        style: {
          height: '45px !important'
        },
        GOOGLE_API_KEY: CONFIG.GOOGLE_API_KEY,
        results: {
          style: {
          }
        },
        placeholder: 'Type places'
      }
    }
  },
  props: {
  },
  components: {
    'trend': require('modules/places/Trend.vue'),
    'qr-code': require('modules/dashboard/QrCode.vue'),
    'temperature-summary': require('modules/temperature/Summary.vue'),
    'data-summary': require('modules/dashboard/Summary.vue'),
    'google-places-auto-complete': require('components/increment/generic/location/GooglePlacesAutoComplete.vue')
  },
  methods: {
    manageInput(data){
      console.log(data)
    }
  }
}
</script>
