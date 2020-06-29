<template>
  <div v-if="auth.user.code !== null">
    <qrcode-vue :value="qrCodeValue" :size="300"></qrcode-vue>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import QrcodeVue from 'qrcode.vue'
export default {
  mounted(){
    console.log('User code: ', this.qrCodeValue)
  },
  data(){
    return {
      auth: AUTH,
      qrCodeValue: `account/${AUTH.user.code}`
    }
  },
  components: {
    QrcodeVue
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
