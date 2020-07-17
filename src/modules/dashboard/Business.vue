<template>
  <div>
    <div v-if="businessInfo !== null" class="w-100 row m-0 mt-3 align-items-center">
      <div class="logo">
        <img :src="backend+businessInfo.logo" alt="" class="img-fluid rounded-circle border border-primary border-thick">
      </div>
      <div class="business-details row flex-column">
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
      <div class="col-md-6 col-sm-12 mt-3">
        <qr-code-scanner :btnWidth="'col-md-3 col-sm-12'" :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"></qr-code-scanner>

      </div>
      <div class="col-6 mt-3">
        
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "~assets/style/colors.scss";
  .border-thick {
    border-width: 5px !important;
  }

  .logo {
    max-width: 30%;
    margin: 0 auto;
  }

  .business-details {
    width: 100%;
    text-align: center;
    margin: 0;
  }

  @media (min-width: 768px) {  
    .logo {
      max-width: 10%;
      margin-left: 3rem;
      margin-right: 1rem;
    }

    .business-details {
      width: auto;
      text-align: left;
    }
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
