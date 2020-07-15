<template>
  <div>
    <QrcodeVue :value="`account/${user.code}`" :size="300"></QrcodeVue>
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
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      qrScannerState: false
    }
  },
  components: {
    QrcodeVue
  },
  methods: {
  }
}
</script>
