<template>
  <div class="w-100">

    <!-- QR CODE SCANNER -->
    <div v-if="qrScannerState" class="qr-container mt-2 w-50 h-50">
      <qr-code-scanner :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"></qr-code-scanner>
    </div>

    <!-- ACCOUNT QR CODE RESULT -->
    <account-scanned
      v-if="payload === 'account'"
      :code="code"
      :qrScannerState="qrScannerState"
      @toggleState="(newState) => qrScannerState = newState"
    >
    </account-scanned>

    <!-- LOCATION QR CODE RESULT -->
    <location-scanned
      v-if="payload === 'location'"
      :code="code"
      :qrScannerState="qrScannerState"
      @toggleState="(newState) => qrScannerState = newState"
    >
    </location-scanned>

    <!-- TRANSPORTATION QR CODE RESULT -->
    <transportation-scanned
      v-if="payload === 'transportation'"
      :code="code"
      :qrScannerState="qrScannerState"
      @toggleState="(newState) => qrScannerState = newState"
    >
    </transportation-scanned>

    

  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";

@media (max-width: 767px) {
  .qr-container {
    width: 100% !important;
  }
}
</style>
<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  mounted() {
  },
  data() {
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      payload: this.$route.params.payload,
      code: this.$route.params.code,
      qrScannerState: false
    }
  },
  components: {
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'account-scanned': require('./AccountScanned'),
    'location-scanned': require('./LocationScanned'),
    'transportation-scanned': require('./VehicleScanned')
  },
  computed: {
    getFullPath() {
      return this.$route.path
    }
  },
  watch: {
    getFullPath() {
      this.payload = this.$route.params.payload
      this.code = this.$route.params.code
    }
  },
  methods: {}
}
</script>
