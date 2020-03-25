<template>
  <div v-if="data !== null">
    <label class="text-danger" v-if="data.positive > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.positive}} Positive
    </label>

    <label class="text-warning" v-if="data.pum > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.pum}} Person under monitoring(PUM)
    </label>

    <label class="text-primary" v-if="data.pui > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.pui}} Person under investigation(PUI)
    </label>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.text-primary{
  color: $primary !important;
}

label{
  font-size: 16px;
  width: 100%;
  float: left;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import QrcodeVue from 'qrcode.vue'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null
    }
  },
  components: {
    QrcodeVue
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      this.APIRequest('patients/summary', {}).then(response => {
        this.data = response.data
      })
    }
  }
}
</script>
