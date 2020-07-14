<template>
  <div class="row">
    <div class="col-12 row justify-content-center mt-3 align-items-center">
      <div class="logo">
        <img :src="backend+businessInfo.logo" alt="" class="img-fluid circle">
      </div>
      <div class="col-auto row flex-column ml-1">
        <h3 class="text-primary font-weight-bold">{{businessInfo.name}}</h3>
        <div class="text-secondary">{{businessInfo.email}}</div>
        <div class="text-secondary">{{businessInfo.address}}</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "~assets/style/colors.scss";
  .logo {
    max-width: 10%;
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

    console.log(this.config)
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      backend: CONFIG.BACKEND_URL,
      businessInfo: null,
      qrScannerState: false
    }
  }
}
</script>
