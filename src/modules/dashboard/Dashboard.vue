<template>
  <div style="margin-bottom: 200px;">
    <div class="row" style="margin-top: 25px;">
      <div class="col-lg-6" style="margin-bottom: 25px;">
        <google-places-auto-complete :property="property" @onFinish="manageInput($event)"></google-places-auto-complete>
        <p>
          Current data on the system. [Not updated as other users are not registered yet]
        </p>
        <data-summary></data-summary>
        <p>
          Hi {{user.username}}! Below is your qr code. Show this to frontliners everytime they read your temperature.
        </p>
        <qr-code></qr-code>
      </div>
      <div class="col-lg-6" style="margin-bottom: 25px;">
        <p>
          List of places visited by affected individual(Hot Places)
        </p>
        <trend></trend>
      </div>
    </div>
    <!-- <div class="row" style="margin-bottom: 25px;">
      <div class="col-lg-6">
        <p>
          <b>Summary of temperature within Locality</b>
        </p>
        <temperature-summary></temperature-summary>
      </div>
    </div> -->
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.half-rule {
  margin-left: 0;
  text-align: left;
  width: 50%;
}

p{
  padding: 10px;
  background: $primary;
  color: $white;
  width: 100%;
  float: left;
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
