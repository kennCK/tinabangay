<template>
  <div>
    <div v-if="businessInfo !== null" class="col-12 row pl-5 mt-3 align-items-center">
      <div class="logo">
        <img :src="backend+businessInfo.logo" alt="" class="img-fluid rounded-circle border border-primary border-thick">
      </div>
      <div class="col-auto row flex-column ml-1">
        <h3 class="text-primary font-weight-bold">{{businessInfo.name}}</h3>
        <div class="text-secondary font-weight-bold">{{businessInfo.email}}</div>
        <div class="text-secondary">{{businessInfo.address}}</div>
      </div>
    </div>
    <hr v-if="businessInfo !== null">
    <div class="row m-0 mt-3">
      <div class="col-12 text-center">
        <h5 class="text-primary font-weight-bold">Dashboard</h5>
      </div>
      <div class="col-6 mt-3">
        <qr-code-scanner :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"></qr-code-scanner>
      </div>
      <div class="col-6 mt-3">
        
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "~assets/style/colors.scss";
  .logo {
    max-width: 10%;
  }

  .border-thick {
    border-width: 5px !important;
  }
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
export default {
  mounted(){
    this.retrieveBusinessInfo()
    this.retrieveEmployees()
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      backend: CONFIG.BACKEND_URL,
      businessInfo: null,
      qrScannerState: false,
      affectedEmp: null
    }
  },
  components: {
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'empty': require('./Empty.vue')
  },
  methods: {
    retrieveBusinessInfo() {
      let par = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }

      this.APIRequest('merchants/retrieve', par).then(response => {
        if(response.data.length > 0) {
          this.businessInfo = response.data[0]
        }
      })
    },
    retrieveEmployees() {
      let par = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'owner'
        }]
      }

      this.APIRequest('linked_accounts/retrieve_tracing', par).then(response => {
        console.log(response.data)
      })
    }
  }
}
</script>
