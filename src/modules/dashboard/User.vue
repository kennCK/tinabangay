<template>
  <div>
   <p>
      Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature or DOH authorized personnel.
   </p>
   <div v-if="user.code !== null" class="alert row justify-content-center align-items-center col-4 mt-5 mx-auto" :class="{'alert-danger': status.status === 'positive' || status.status === 'pui' || status.status === 'pum', 'alert-success': status.status === 'negative'}" role="alert">
      <label class="m-0" :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum', 'text-primary': status.status === 'pui', 'text-success': status.status === 'negative'}" v-if="status !== null">
        <h4>
          <i :class="{'fas fa-exclamation-triangle': status.status === 'pum' || status.status == 'positive' || status.status == 'pui', 'fas fa-check': status.status === 'negative', 'fas fa-plus': status.status === 'death' }" style="margin-right: 5px;"></i>
          {{label}}
        </h4>
      </label>
   </div>
   <div v-if="user.code !== null" class="row justify-content-center pt-5">
      <QrcodeVue :value="`account/${user.code}`" :size="300"></QrcodeVue>
   </div>
   <div class="row justify-content-center pt-5">
      <qr-code-scanner :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"></qr-code-scanner>
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
      label: null
    }
  },
  components: {
    QrcodeVue,
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue')
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
        // console.log(this.status)
      })
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
      }
    }
  }
}
</script>
