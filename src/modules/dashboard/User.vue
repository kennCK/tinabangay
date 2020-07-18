<template>
  <div>
   <p>
      Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature or DOH authorized personnel.
   </p>
   <div class="row m-0">
    <div class="col-md-6 col-sm-12">
      <div v-if="user.code !== null" class="alert row justify-content-center align-items-center col-9 mt-5 mx-auto" :class="{'alert-danger': status.status === 'positive', 'alert-warning': status.status === 'pui' || status.status === 'pum', 'alert-success': status.status === 'negative' || status.status === 'recovered'}" role="alert">
         <label class="m-0" :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum' || status.status === 'pui', 'text-success': status.status === 'negative' || status.status === 'recovered'}" v-if="status !== null">
           <h4>
             <i :class="{'fas fa-exclamation-triangle': status.status === 'pum' || status.status == 'positive' || status.status == 'pui' || status.status === 'symptoms', 'fas fa-check': status.status === 'negative' || status.status === 'recovered', 'fas fa-plus': status.status === 'death' }" style="margin-right: 5px;"></i>
             {{status.status_label}}
             <!-- Once API is updated change from {{status.status_label}} to {{label}} -->
           </h4>
         </label>
      </div>
      <div class="row m-0">
        <div v-if="user.code !== null" class="row justify-content-center pt-5 col-12">
             <QrcodeVue :value="`account/${user.code}`" :size="300" v-if="qrScannerState == false"></QrcodeVue>

          <div class="row justify-content-center pt-5 mb-5 col-12">
             <qr-code-scanner :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"
                              :location="qrLocation"></qr-code-scanner>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-sm-12">
      <trending></trending>
    </div>
   </div>
  </div>
</template>

<style scoped lang="scss">
  @import "~assets/style/colors.scss";

</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      qrScannerState: false,
      status: null,
      label: null,
      result: null,
      limit: 5,
      qrLocation: 'top'
    }
  },
  components: {
    QrcodeVue,
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'trending': require('modules/places/Trend_v2.vue')
  },
  methods: {
    retrieve(){
      let parameter = {
        id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tracings/status', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.status = response.data
        this.createLabel()
        console.log(this.status)
      })
      // parameter = {
      //   status: 'positive',
      //   limit: this.limit,
      //   offset: this.activePage,
      //   locality: this.searchValue + '%'
      // }
      // $('#loading').css({display: 'block'})
      // this.APIRequest('tracing_places/places', parameter).then(response => {
      //   $('#loading').css({display: 'none'})
      //   if(response.data.length > 0){
      //     this.data = response.data
      //   }else{
      //     this.data = null
      //   }
      //   this.result = this.lists(this.data)
      // })
    },
    createLabel(){
      switch(this.status.status){
        case 'positive':
          this.label = 'User is COVID-Positive'
          break
        case 'pui':
          this.label = 'User is a PUI'
          break
        case 'pum':
          this.label = 'User is a PUM'
          break
        case 'negative':
          this.label = 'You\'re All Clear!'
          break
        case 'recovered':
          this.label = 'You\'re now COVID-free!'
          break
        case 'death':
          this.label = 'Patay sa ka brad RIP'
      }
    }
  }
}
</script>
