<!-- 
  **REQUIREMENTS**
  @props ( boolean ) state -> QR Scanner State
  @props ( $emit   ) toggleState -> Emits new state
-->
<template>
  <div>
    <div v-if="qrScannerError !== '' && state" class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ qrScannerError }}
      <button @click="qrScannerError = ''" type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <qrcode-stream v-if="state && location === 'top'" @init="onInit" @decode="onDecode"></qrcode-stream>
    <button 
      :class="['btn', 'mb-2', 'btn-lg', 'py-1', 'px-2', {'btn-danger': !state}, {'btn-warning': state}, (btnWidth ? btnWidth : '') ]"
      @click="toggleScanner()"
    >
      <i class="fa" :class="state ? 'fa-ban' : 'fa-expand'"></i>
      <span class="font-weight-bold">{{ state ? 'Cancel' : 'Scan QR' }}</span>
    </button>
    <qrcode-stream v-if="state && (location == null || location === 'bottom')" @init="onInit" @decode="onDecode"></qrcode-stream>
  </div>
</template>
<style lang="scss" scoped> 
  @import "~assets/style/colors.scss";
  .btn-danger {
    background-color: $dangerLight !important;
    height: unset !important;
  }

  .btn-warning {
    height: unset !important;
  }
</style>
<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import QrcodeVue from 'qrcode.vue'
export default {
  mounted(){},
  data(){
    return {
      user: AUTH.user,
      qrScannerError: '',
      location: null
    }
  },
  props: {
    state: {
      required: true
    },
    btnWidth: {
      required: false
    },
    location: {
      required: false
    }
  },
  components: { 'qrcode-stream': QrcodeStream },
  methods: {
    toggleScanner() {
      this.$emit('toggleState', !this.state)
      if (!this.state) this.qrScannerError = ''
    },
    async onInit (promise) {
      $('#loading').css({display: 'block'})

      try {
        await promise
      } catch (error) {
        console.error(error)
        const greetings = `Hello ${this.user.username || 'there'}!, `
        if (error.name === 'NotAllowedError') {
          this.qrScannerError = greetings + 'you need to grant camera access permisson.'
        } else if (error.name === 'NotFoundError') {
          this.qrScannerError = greetings + 'there is no camera on this device.'
        } else if (error.name === 'NotReadableError') {
          this.qrScannerError = greetings + 'is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.qrScannerError = greetings + 'installed cameras are not suitable.'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.qrScannerError = greetings + 'Stream API is not supported in this browser.'
        }
      } finally {
        $('#loading').css({display: 'none'})
      }
    },
    onDecode (code) {
      if (code !== '') {
        const payload = code.split('/')[0]
        if (payload === 'account' || payload === 'location') {
          this.$emit('toggleState', false)
          ROUTER.push(`/scanned/${code}`)
        } else {
          this.qrScannerError = 'Invalid QR Code'
        }
      }
    }
  }
}
</script>
