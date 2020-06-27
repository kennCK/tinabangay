<template>
  <div class="w-100">

    <!-- QR CODE SCANNER -->
    <div v-if="showQrScanner" class="w-100 d-flex justify-content-center">
      <div class="qr-container mt-2 w-50 h-50">
        <div v-if="qrScannerError !== ''" class="alert alert-warning alert-dismissible fade show" role="alert">
          {{ qrScannerError }}
          <button @click="qrScannerError = ''" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <qrcode-stream v-if="showQrScanner" @init="onInit" @decode="onDecode"></qrcode-stream>
        <button class="btn btn-warning mt-2" @click="showQrScanner = false">End scanning</button>
      </div>
    </div>

    <!-- IF NO RECORD FOUND -->
    <div v-if="scannedUserData === null && !loading && !showQrScanner" class="w-100">
      <h2>Sorry, user not found. Please try again.</h2>
      <button class="btn btn-primary" @click="showQrScanner = true">Scan again</button>
    </div>

    <!-- IF RECORD FOUND -->
    <div v-if="scannedUserData !== null && !loading && !showQrScanner" class="d-flex flex-column align-items-center">
      <h3 class="my-4">User Information</h3>
      <div class="user-card d-flex align-items-center flex-column mb-4">
        <i class="fa fa-user-circle-o profile-icon mb-3"></i>
        <h5>{{ scannedUserData.username }}</h5>
        <div class="location-code" :class="[scannedUserData.location === null ? 'mt-3' : 'mb-3']">
          <span v-if="scannedUserData.location !== null">
            {{ scannedUserData.location.code }}
          </span>
          <span v-else class="alert alert-info">
            No assigned address. If this individual belongs to your barangay. 
            Click <a href="javascript:;" @click="showModal('add_address')">here</a> to add address.
          </span>
        </div>
        <div class="status-label d-flex w-100">
          <span class="alert w-100 text-center"
            :class="{
              'alert-success':  scannedUserData.overall_status.status === 'negative',
              'alert-warning':  scannedUserData.overall_status.status === 'pui' ||
                                scannedUserData.overall_status.status === 'pum',
              'alert-danger':   scannedUserData.overall_status.status === 'positive'
            }">
            {{ scannedUserData.overall_status.status_label }}
          </span>
        </div>
      </div>
      <div v-if="selectedOption !== ''" class="mb-4">
        <p class="alert alert-warning  alert-dismissible fade show" role="alert">
          <strong>{{ selectedOption }}</strong> 
          option is currently in development
          <button @click="selectedOption = ''" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </p>
      </div>
      <div class="available-options d-flex">
        <button class="btn btn-primary" @click="selectedOption = 'Linked my account'">Linked my account</button>
        <button class="btn btn-primary" @click="selectedOption = 'Add temperature'">Add temperature</button>
        <button class="btn btn-primary" @click="selectedOption = 'Send form'">Send form</button>
        <button class="btn btn-primary" @click="showQrScanner = true">Scan again</button>
      </div>
    </div>

    <!--MODAL FOR ADDING ADDRESS-->
    <div class="modal fade right" id="add_address" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div v-if="this.user.location === null" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Sorry, you are unable to add address.</h5>
            <button @click="hideModal('add_address')" type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        <div v-if="this.user.location !== null" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Address</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('add_address')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <form @submit.prevent>
            <div class="modal-body p-3 pl-5">
              <div class="form-group mb-0">
                <input class="form-check-input" v-model="addressVerified" type="checkbox" aria-label="Checkbox for verifying address" required>
                <p class="d-inline">
                  {{`
                    ${this.user.location.code},
                    ${this.user.location.route},
                    ${this.user.location.region},
                    ${this.user.location.locality}
                  `}}
                </p>
                <p class="text-secondary"><small>Please verify the address to be added.</small></p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-danger" @click="hideModal('add_address')">Cancel</button>
              <button class="btn btn-primary" type="submit" @click="addAddress()">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.alert {
  display: block !important;
}
.profile-icon {
  font-size: 80px;
  color: $primary;
}
.user-card {
  padding: 15px;
  border: 1px solid #ddd;
}
.available-options {
  justify-content: space-evenly;
  width: 40%;
  flex-wrap: wrap;
}
.available-options button {
  flex-grow: 1;
  min-width: 150px;
  margin: 5px 5px !important;
}
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
import axios from 'axios'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
    console.log('Parameter: ', this.code)
    this.retrieve(this.code)
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      code: this.$route.params.code,
      loading: true,
      scannedUserData: null,
      showQrScanner: false,
      qrScannerError: '',
      addressVerified: false,
      selectedOption: '' // for testing
    }
  },
  components: { 'qrcode-stream': QrcodeStream },
  computed: {
    getFullPath () {
      return this.$route.path
    }
  },
  watch: {
    getFullPath () {
      this.retrieve(this.$route.params.code)
    }
  },
  methods: {
    retrieve (code) {
      this.loading = true
      this.scannedUserData = null
      $('#loading').css({display: 'block'})
      let parameter = {
        'condition': [{
          'value': code,
          'clause': '=',
          'column': 'code'
        }]
      }
      this.APIRequest('accounts/retrieve', parameter).then(response => {
        if (response.data.length > 0) {
          this.scannedUserData = response.data[0]
        } else {
          console.log('No record found')
        }
        this.loading = false
        $('#loading').css({display: 'none'})
      })
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
        } else if (error.name === 'NotSupportedError') {
          this.qrScannerError = greetings + 'secure context required (HTTPS, localhost).'
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
        ROUTER.push(`/scanned/${code}`)
        this.showQrScanner = false
      }
    },
    showModal (name) {
      $(`#${name}`).modal('show')
    },
    hideModal (name) {
      $(`#${name}`).modal('hide')
      if (name === 'add_address') this.addressVerified = false
    },
    addAddress () {
      if (!this.addressVerified) return

      const parameters = {
        account_id: this.scannedUserData.id,
        code: this.user.location.code,
        longitude: this.user.location.longitude,
        latitude: this.user.location.latitude,
        route: this.user.location.route,
        locality: this.user.location.locality,
        country: this.user.location.country,
        region: this.user.location.region
      }

      $('#loading').css({display: 'block'})
      this.APIRequest('locations/create', parameters).then(response => {
        if (response.error.length > 0) console.error(response.error)
        this.hideModal('add_address')
        this.retrieve(this.code)
      })
    }
  }
}
</script>
