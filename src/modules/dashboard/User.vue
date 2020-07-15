<template>
  <div>
   <p>
      Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature or show this to DOH authorized personnel.
   </p>
   <div v-if="user.code !== null" class="alert alert-danger row justify-content-center pt-5" role="alert">
      <label class="text-uppercase" :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum', 'text-primary': status.status === 'pui', 'text-success': status.status === 'negative'}" v-if="status !== null">
         <h4><i :class="{'fas fa-exclamation-triangle': status.status === 'pum' || status.status == 'positive' || status.status == 'pui', 'fas fa-check': status.status === 'negative', 'fas fa-plus': status.status === 'death' }" style="margin-right: 5px;"></i>
         {{status.status_label}}</h4>
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
      status: null
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
      })
    }
  }
}
</script>
