<template>
  <div>
     <!-- LOADING STATE -->
    <div v-if="loading" class="mt-5 form-wrapper">
      <div class="loading-div">
        <h3>Processing</h3>
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </div>
    </div>

    <!-- IF NO RECORD FOUND -->
    <div v-if="scannedVehicleData === null && !loading && !qrScannerState" class="w-100">
      <h2>Sorry, <mark class="p-0">vehicle</mark> not found. Please try again.</h2>
      <button class="btn btn-primary" @click="showScanner()">Scan again</button>
    </div>

    <!-- IF RECORD FOUND -->
    <div v-if="scannedVehicleData !== null && !loading && !qrScannerState" class="d-flex flex-column align-items-center mb-5">
      <h3 class="my-4">Vehicle Information</h3>
      <div class="d-flex align-items-center flex-column mb-4">
        <ul class="list-group">
          <li class="list-group-item">
            Type:
            <b>{{ scannedVehicleData.type }}</b>
          </li>
          <li class="list-group-item">
            Model:
            <b>{{ scannedVehicleData.model }}</b>
          </li>
          <li class="list-group-item">
            Number:
            <b>{{ scannedVehicleData.number }}</b>
          </li>
        </ul>
      </div>

     <!-- ALERT MESSAGE -->
      <div v-if="alertMessage.message !== null" class="alert-message">
        <p :class="`alert ${alertMessage.type ? `alert-${alertMessage.type}` : ''} alert-dismissible fade show`" role="alert">
          {{ alertMessage.message }}
          <button @click="alertMessage = { type: null, message: null }" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </p>
      </div>

      <div class="available-options d-flex">
        <button v-if="addedAsRide" class="btn btn-success">Added as ride</button>
        <button v-if="!addedAsRide" class="btn btn-primary" @click="addRide()">Add as ride</button>
        <button class="btn btn-primary" @click="fillUpHDF('customer')">Fill Up Health Declaration Form</button>
        <button class="btn btn-primary" @click="showScanner()">Scan again</button>
      </div>
    </div>

  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.available-options {
  justify-content: space-evenly;
  width: 40%;
  flex-wrap: wrap;
}
.available-options button {
  min-width: 315px;
  margin: 5px 5px !important;
}
#send_form .modal-content {
  max-width: 400px;
  margin: 0 auto;
}
.loading-div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner {
  width: 70px;
  text-align: center;
}
.spinner > div {
  width: 15px;
  height: 15px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}
.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}
@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
.alert-message {
  max-width: 600px;
}
</style>
<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import moment from 'moment'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  mounted() {
    this.retrieve(this.code)
  },
  data() {
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      loading: true,
      scannedVehicleData: null,
      addedAsRide: false,
      alertMessage: {
        type: null,
        message: null
      }
    }
  },
  props: ['code', 'qrScannerState'],
  computed: {
    getCode() {
      return this.code
    }
  },
  watch: {
    getCode() {
      this.retrieve(this.code)
    }
  },
  methods: {
    showScanner() {
      this.$emit('toggleState', true)
    },
    retrieve(code) {
      this.loading = true
      this.scannedVehicleData = null
      this.addedAsRide = false
      $('#loading').css({display: 'block'})
      let parameter = {
        condition: [{
          value: code,
          clause: '=',
          column: 'code'
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('transportations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.scannedVehicleData = response.data[0]
        }
        this.loading = false
        $('#loading').css({display: 'none'})
      })
    },
    addRide() {
      $('#loading').css({display: 'block'})
      const parameter = {
        account_id: this.user.userID,
        transportation_id: this.scannedVehicleData.id,
        payload: 'qr',
        type: this.scannedVehicleData.type
      }
      this.APIRequest('rides/create', parameter).then(response => {
        if (response.data) {
          this.addedAsRide = true
        } else {
          console.error('Error adding to your rides.')
        }
        $('#loading').css({display: 'none'})
      })
    },
    redirectToForm(type, merchantOwner, content) {
      ROUTER.push(`/form/${type}&${merchantOwner}&${content}`)
      $('#loading').css({display: 'none'})
    },
    fillUpHDF(type) {
      $('#loading').css({display: 'block'})
      const merchantOwner = this.scannedVehicleData.account_id
      if (merchantOwner && this.scannedVehicleData.payload !== null) {
        const parameter = {
          condition: [{
            value: merchantOwner,
            column: 'account_id',
            clause: '='
          }]
        }
        console.log(this.scannedVehicleData.account_id)
        this.APIRequest('merchants/retrieve', parameter).then(response => {
          console.log(response)
          if (response.data.length) {
            const vehicle = {...this.scannedVehicleData}
            vehicle.account_id = null
            vehicle.id = null
            const content = JSON.stringify({
              format: type,
              status: null,
              statusLabel: null,
              vehicle
            })
            this.redirectToForm(type, merchantOwner, content)
          } else {
            this.alertMessage = {
              type: 'danger',
              message: 'Sorry, you cannot request Heath Declaration Form to this address'
            }
            $('#loading').css({display: 'none'})
          }
        })
      } else {
        this.alertMessage = {
          type: 'danger',
          message: 'Sorry, you cannot request Heath Declaration Form form to this address'
        }
        $('#loading').css({display: 'none'})
      }
    }
  }
}
</script>
