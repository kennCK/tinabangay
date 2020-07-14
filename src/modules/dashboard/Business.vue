<template>
  <div class="row">
    <div class="w-50">

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
    let par = {
      condition: [{
        value: AUTH.user.userID,
        clause: '=',
        column: 'id'
      }]
    }
    this.APIRequest('merchants/retrieve', par).then(response => {
      if(response.data.length > 0) {
        this.user = response.data[0]
      }
    })
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      businessInfo: null,
      qrScannerState: false
    }
  }
}
</script>
