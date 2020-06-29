<template>
  <div>
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
          <li class="list-group-item">Code:       {{ scannedLocationData.code }}</li>
          <li class="list-group-item">Route:      {{ scannedLocationData.route }}</li>
          <li class="list-group-item">Region:     {{ scannedLocationData.region }}</li>
          <li class="list-group-item">Locality:   {{ scannedLocationData.locality }}</li>
          <li class="list-group-item">Country:    {{ scannedLocationData.country }}</li>
          <li class="list-group-item">Latitude:   {{ scannedLocationData.latitude }}</li>
          <li class="list-group-item">Longitude:  {{ scannedLocationData.longitude }}</li>
        </ul>
      </div>

      <!-- TEMP (FOR DEVELOPMENT ONLY) -->
      <div v-if="selectedOption !== ''" class="mb-4">
        <p class="alert alert-warning  alert-dismissible fade show" role="alert">
          <strong>{{ selectedOption }}</strong> 
          option is currently in development
          <button @click="selectedOption = ''" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </p>
      </div>
      <!-- END TEMP -->

      <!-- TODO: 
        1) Add to visited places option
        2) Health Declaration for Customer option
        3) Health Declaration for Employee Checkin option
        4) Health Declaration for Employee Checkout option
      -->
      <div class="available-options d-flex">
        <button class="btn btn-primary" @click="selectedOption = 'Add to visited places'">Add to visited places</button>
        <button class="btn btn-primary" @click="selectedOption = 'Health Declaration for Customer'">Health Declaration for Customer</button>
        <button class="btn btn-primary" @click="selectedOption = 'Health Declaration for Employee Checkin'">Health Declaration for Employee Checkin</button>
        <button class="btn btn-primary" @click="selectedOption = 'Health Declaration for Employee Checkout'">Health Declaration for Employee Checkout</button>
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
</style>
<script>
import { QrcodeStream } from 'vue-qrcode-reader'
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
      scannedLocationData: null,
      selectedOption: '' // for testing
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
      this.scannedLocationData = null
      $('#loading').css({display: 'block'})
      let parameter = {
        condition: [{
          value: code,
          clause: '=',
          column: 'code'
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('locations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.scannedLocationData = response.data[0]
        }
        this.loading = false
        $('#loading').css({display: 'none'})
      })
    }
  }
}
</script>
