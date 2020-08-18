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
    <div v-if="scannedLocationData === null && !loading && !qrScannerState" class="w-100">
      <h2>Sorry, <mark class="p-0">location</mark> not found. Please try again.</h2>
      <button class="btn btn-primary" @click="showScanner()">Scan again</button>
    </div>

    <!-- IF RECORD FOUND -->
    <div v-if="scannedLocationData !== null && !loading && !qrScannerState" class="d-flex flex-column align-items-center mb-5">
      <h3 class="my-4">Location Information</h3>
      <div class="d-flex align-items-center flex-column mb-4">
        <ul class="list-group">
          <li class="list-group-item">
            Branch:
            <b>{{ scannedLocationData.route }}</b>
          </li>
          <li class="list-group-item">
            Region:
            <b>{{ scannedLocationData.region }}</b>
          </li>
          <li class="list-group-item">
            Locality:
            <b>{{ scannedLocationData.locality }}</b>
          </li>
          <li class="list-group-item">
            Country:
            <b>{{ scannedLocationData.country }}</b>
          </li>
          <li class="list-group-item">
            Latitude:
            <b>{{ scannedLocationData.latitude }}</b>
          </li>
          <li class="list-group-item">
            Longitude:
            <b>{{ scannedLocationData.longitude }}</b>
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
        <button v-if="addedToVisitedPlaces" class="btn btn-success">Added to visited places</button>
        <button v-if="!addedToVisitedPlaces" class="btn btn-primary" @click="addVisitedPlace()">Add to visited places</button>
        <button class="btn btn-primary" @click="showModal('send_form')">Send Form</button>
        <button class="btn btn-primary" @click="showScanner()">Scan again</button>
      </div>
    </div>

    <!--MODAL FOR REQUESTING FORM-->
    <div class="modal fade right" id="send_form" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Request Health Declaration Form</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('send_form')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-0 d-flex flex-column align-items-center mb-3">
              <button class="btn btn-primary mt-3 w-100" @click="sendForm('customer')">For Customer</button>
              <button class="btn btn-primary mt-3 w-100" @click="sendForm('employee_checkin')">For Employee Checkin</button>
              <button class="btn btn-primary mt-3 w-100" @click="sendForm('employee_checkout')">For Employee Checkout</button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('send_form')">Cancel</button>
          </div>
        </div>
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
    const locationCode = localStorage.getItem('location_code')
    if (locationCode) {
      localStorage.removeItem('location_code')
    }
    let data = JSON.parse(localStorage.getItem('scanned/location/' + this.code))
    if(data){
      if(data.data.length > 0){
        this.scannedLocationData = data.data[0]
        this.loading = false
        this.addedToVisitedPlaces = false
      }else{
        this.scannedLocationData = null
        this.retrieve(this.code, false)
      }
    }else{
      this.scannedLocationData = null
      this.retrieve(this.code, true)
    }
  },
  data() {
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      loading: true,
      scannedLocationData: null,
      addedToVisitedPlaces: false,
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
    retrieve(code, flag) {
      this.loading = flag
      this.scannedLocationData = null
      this.addedToVisitedPlaces = false
      $('#loading').css({display: 'block'})
      let parameter = {
        condition: [{
          value: code,
          clause: '=',
          column: 'code'
        }]
      }
      this.APIRequest('locations/retrieve_locations_only', parameter).then(response => {
        localStorage.setItem('scanned/location/' + code, JSON.stringify(response))
        if(response.data.length > 0){
          this.scannedLocationData = response.data[0]
        }
        this.loading = false
        $('#loading').css({display: 'none'})
      })
    },
    showModal(id) {
      $(`#${id}`).modal('show')
    },
    hideModal(id) {
      $(`#${id}`).modal('hide')
    },
    addVisitedPlace() {
      $('#loading').css({display: 'block'})
      const parameter = {
        account_id: this.user.userID,
        longitude: this.scannedLocationData.longitude,
        latitude: this.scannedLocationData.latitude,
        route: this.scannedLocationData.route,
        locality: this.scannedLocationData.locality,
        country: this.scannedLocationData.country,
        region: this.scannedLocationData.region,
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm')
      }
      this.APIRequest('visited_places/create', parameter).then(response => {
        if (response.data) {
          this.addedToVisitedPlaces = true
        } else {
          console.error('Error adding to visited places')
        }
        $('#loading').css({display: 'none'})
      })
    },
    redirectToForm(type, merchantOwner, content) {
      ROUTER.push(`/form/${type}&${merchantOwner}&${content}`)
      this.hideModal('send_form')
      $('#loading').css({display: 'none'})
    },
    sendForm(type) {
      $('#loading').css({display: 'block'})
      const merchantOwner = this.scannedLocationData.account_id

      if (merchantOwner && this.scannedLocationData.payload === null) {
        const location = {...this.scannedLocationData}
        location.account_id = null
        location.id = null
        const content = JSON.stringify({
          format: type,
          status: null,
          statusLabel: null,
          location
        })

        if (type === 'customer') {
          this.redirectToForm(type, merchantOwner, content)
        } else {
          if (this.user.linked_account === null || parseInt(merchantOwner) !== parseInt(this.user.linked_account.owner)) {
            this.alertMessage = {
              type: 'warning',
              message: 'Sorry, you are not linked to this branch'
            }
            this.hideModal('send_form')
            $('#loading').css({display: 'none'})
          } else {
            this.redirectToForm(type, merchantOwner, content)
          }
        }
        // const parameter = {
        //   condition: [{
        //     value: merchantOwner,
        //     column: 'account_id',
        //     clause: '='
        //   }]
        // }
        // this.APIRequest('merchants/retrieve', parameter).then(response => {
        //   if (response.data.length) {
        //     const location = {...this.scannedLocationData}
        //     location.account_id = null
        //     location.id = null
        //     const content = JSON.stringify({
        //       format: type,
        //       status: null,
        //       statusLabel: null,
        //       location
        //     })

        //     if (type === 'customer') {
        //       this.redirectToForm(type, merchantOwner, content)
        //     } else {
        //       if (this.user.linked_account === null || parseInt(merchantOwner) !== parseInt(this.user.linked_account.owner)) {
        //         this.alertMessage = {
        //           type: 'warning',
        //           message: 'Sorry, you are not linked to this branch'
        //         }
        //         this.hideModal('send_form')
        //         $('#loading').css({display: 'none'})
        //       } else {
        //         this.redirectToForm(type, merchantOwner, content)
        //       }
        //     }

        //   } else {
        //     this.alertMessage = {
        //       type: 'danger',
        //       message: 'Sorry, you cannot request Heath Declaration Form to this address'
        //     }
        //     this.hideModal('send_form')
        //     $('#loading').css({display: 'none'})
        //   }
        // })
      } else {
        this.alertMessage = {
          type: 'danger',
          message: 'Sorry, you cannot request Heath Declaration Form to this address'
        }
        this.hideModal('send_form')
        $('#loading').css({display: 'none'})
      }
    }
  }
}
</script>
