<!-- 
  **REQUIREMENTS**
  @props ( boolean ) state -> QR Scanner State
  @props ( $emit   ) toggleState -> Emits new state
-->
<template>
  <div>
       <div class="modal fade right" id="scanner" tabindex="-1" role="dialog" aria-labelledby="deleteHeader"
     aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title" id="header">Please align the QR Code within the frame to start scanning..</h6>
          </div> 
          <div class="modal-body p-4">
      <div v-if="qrScannerError !== '' && state" class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ qrScannerError }}
      <button @click="qrScannerError = ''" type="button" class="close" aria-label="Close" >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
          <qrcode-stream v-if="state && location === 'top'" @init="onInit" @decode="onDecode"></qrcode-stream>
         <qrcode-stream v-if="state && (location == null || location === 'bottom')" @init="onInit" @decode="onDecode"></qrcode-stream>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger btn-md" data-dismiss="modal" @click="toggleScanner()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#scanner"  @click="toggleScanner()"><i class="fas fa-expand"></i>
  Scan Qr
</button>
  </div>
</template>
<style lang="scss" scoped> 
  @import "~assets/style/colors.scss";
  .btn{
    margin-top: 12px;
  }
  .btn-danger {
    background-color: $dangerLight !important;
    height: unset !important;

  }

  .btn-primary {
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
  data(){
    return {
      user: AUTH.user,
      qrScannerError: '',
      scannedLocationData: null,
      merchantOwner: null
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
      $('.user_qrcode').toggleClass('user_qr_hide')
      $('p.notif').toggleClass('user_qr_hide')
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
        const splitCode = code.split('/')
        let payload = null
        let type = null
        if (splitCode.length > 2) {
          payload = splitCode[5]
          type = splitCode[4]
        } else if (splitCode.length > 0 && splitCode.length <= 2) {
          payload = splitCode[1]
          type = splitCode[0]
        }
        let parameter = {
          condition: [{
            value: payload,
            clause: '=',
            column: 'code'
          }]
        }
        const location = {...this.scannedLocationData}
        if (type === 'account' || type === 'transportation' || (type === 'location' && this.user.type === 'TEMP_SCANNER') || (type === 'account' && this.user.type === 'TEMP_SCANNER')) {
          this.$emit('toggleState', false)
          ROUTER.push(`/scanned/${type}/${payload}`)
          $('#scanner').modal('hide')
        } else if(type === 'location' && this.user.type !== 'TEMP_SCANNER') {
          this.APIRequest('locations/retrieve_locations_only', parameter).then(response => {
            if(response.data.length > 0){
              this.scannedLocationData = response.data[0]
              if(this.user.linked_account !== null && this.scannedLocationData.account_id === this.user.linked_account.owner) { // For employees scanning their own assigned branch location
                const contentE = JSON.stringify({
                  format: 'employee_checkin',
                  status: null,
                  statusLabel: null,
                  location
                })
                console.log('employee')
                ROUTER.push(`/form/${'employee_checkin'}&${this.user.assigned_location.account_id}&${contentE}`)
                $('#scanner').modal('hide')
              } else if(this.user.linked_account === null) { // For users with no merchant
                const contentC = JSON.stringify({
                  format: 'customer',
                  status: null,
                  statusLabel: null,
                  location
                })
                ROUTER.push(`/form/${'customer'}&${this.scannedLocationData.account_id}&${contentC}`)
                $('#scanner').modal('hide')
              } else if(this.scannedLocationData !== this.user.linked_account.owner) { // For users scanning branch location (different merchant)
                const contentC = JSON.stringify({
                  format: 'customer',
                  status: null,
                  statusLabel: null,
                  location
                })
                ROUTER.push(`/form/${'customer'}&${this.scannedLocationData.account_id}&${contentC}`)
                $('#scanner').modal('hide')
              }
            }
          })
        } else {
          this.qrScannerError = 'Invalid QR Code'
        }
      }
    }
  }
}
</script>
