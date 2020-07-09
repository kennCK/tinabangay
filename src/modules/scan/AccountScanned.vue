<template>
  <div>
    <!-- IF NO RECORD FOUND -->
    <div v-if="scannedUserData === null && !loading && !qrScannerState" class="w-100">
      <h2>Sorry, <mark class="p-0">user</mark> not found. Please try again.</h2>
      <button class="btn btn-primary" @click="showScanner()">Scan again</button>
    </div>

    <!-- IF RECORD FOUND -->
    <div v-if="scannedUserData !== null && !loading && !qrScannerState" class="d-flex flex-column align-items-center mb-5">
      <h3 class="my-4">User Information</h3>
      <div class="user-card d-flex align-items-center flex-column mb-4">
        <i class="fa fa-user-circle-o profile-icon mb-3"></i>
        <h5>{{ scannedUserData.username }}</h5>
        <div class="temperature text-center mb-2">
          Temperature:
          <span 
            v-if="this.scannedUserData.temperature === null || typeof (this.scannedUserData.temperature) === 'undefined'"
            class="text-warning"
          >
            No data
          </span>
          <span v-else 
            :class="[this.scannedUserData.temperature.value > 38 ? 'text-danger' : 'text-success']">
            {{ this.scannedUserData.temperature.value }}
            <br>
            <span class="text-secondary font-italic text-lowercase">
              last updated: {{ this.scannedUserData.temperature.created_at_human }}
            </span>
          </span>
        </div>
        <div class="location-code" :class="[scannedUserData.location === null ? 'mt-3' : 'mb-3']">
          <span v-if="scannedUserData.location !== null">
            {{ scannedUserData.location.code }}
          </span>
          <span v-else-if="scannedUserData.location === null && user.type !== 'USER'" class="alert alert-info">
            No assigned address. If this individual belongs to your barangay. 
            Click <a href="javascript:;" @click="showModal('add_address')">here</a> to add address.
          </span>
          <span v-else class="alert alert-info">
            No location record.
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

      <!-- SUCCESS LINKING MESSAGE -->
      <div v-if="alertMessage.message !== null">
        <p :class="`alert ${alertMessage.type ? `alert-${alertMessage.type}` : ''} alert-dismissible fade show`" role="alert">
          {{ alertMessage.message }}
          <button @click="alertMessage = { type: null, message: null }" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </p>
      </div>

      <!-- TODO: 
        1) Send form option
      -->
      <div class="available-options d-flex">
        <!-- CAN ONLY LINK ONCE -->
        <button v-if="user.type !== 'USER'" class="btn btn-primary" @click="showModal('link_my_account')">Link account</button>
        <!-- ['USER'] TYPE CANT ADD TEMPERATURE -->
        <button v-if="user.type !== 'USER'" class="btn btn-primary" @click="showModal('add_temperature')">Add temperature</button>
        <button v-if="user.type !== 'USER'" class="btn btn-primary" @click="sendForm('customer')">Health Declaration for Customer</button>
        <button v-if="user.type !== 'USER'" class="btn btn-primary" @click="sendForm('employee_checkin')">Health Declaration for Employee Checkin</button>
        <button v-if="user.type !== 'USER'" class="btn btn-primary" @click="sendForm('employee_checkout')">Health Declaration for Employee Checkout</button>
        <button class="btn btn-primary" @click="showScanner()">Scan again</button>
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

    <!--MODAL LINK ACCOUNT-->
    <div v-if="scannedUserData !== null" class="modal fade right" id="link_my_account" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Link Account</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('link_my_account')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-3 px-5">
              <p v-if="scannedUserData.id === user.userID">You cannot link your own account.</p>
              <p v-else-if="scannedUserData.linked_account !== null">Account has already been linked.</p>
              <p v-else-if="scannedUserData.linked_account === null">Are you sure you want to link this account?</p>
          </div>
          <div v-if="scannedUserData.linked_account === null && scannedUserData.id !== user.userID" class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('link_my_account')">NO</button>
            <button class="btn btn-primary" type="submit" @click="linkAccount()">YES</button>
          </div>
          <div v-else class="modal-footer">
            <button class="btn btn-primary" @click="hideModal('link_my_account')">OK</button>
          </div>
        </div>
      </div>
    </div>

    <!--MODAL FOR ADDING TEMPERATURE-->
    <div class="modal fade right" id="add_temperature" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Temperature</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('add_temperature')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <form @submit.prevent>
            <div class="modal-body p-3 px-5">
              <div class="form-group">
                <label for="temperature">Temperature</label>
                <input v-model="temperatureInputs.value" id="temperature" class="form-control" type="number" placeholder="E.g. 36.50" step="0.01" required />
              </div>
              <div class="form-group">
                <label for="remarks">Remarks (optional)</label>
                <input v-model="temperatureInputs.remarks" id="remarks" class="form-control" type="text" placeholder="Type remarks" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-danger" @click="hideModal('add_temperature')">Cancel</button>
              <button class="btn btn-primary" type="submit" @click="addTemperature()">Submit</button>
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
      scannedUserData: null,
      addressVerified: false,
      temperatureInputs: {
        value: null,
        remarks: ''
      },
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
      this.scannedUserData = null
      $('#loading').css({display: 'block'})
      let parameter = {
        'condition': [{
          'value': code,
          'clause': '=',
          'column': 'code'
        }]
      }
      this.APIRequest('accounts/retrieve', parameter).then(async response => {
        if (response.data.length > 0) {
          this.scannedUserData = response.data[0]
          await this.getTemperature(response.data[0].id)
        }
        this.loading = false
        $('#loading').css({display: 'none'})
      })
    },
    async getTemperature(id) {
      let parameter = {
        condition: [{
          clause: '=',
          column: 'account_id',
          value: id
        }],
        sort: {
          created_at: 'desc'
        }
      }
      await this.APIRequest('temperatures/retrieve', parameter).then(response => {
        if (response.data.length > 0) {
          this.scannedUserData.temperature = response.data[0]
        } else {
          this.scannedUserData.temperature = null
        }
      })
    },
    showModal(name) {
      $(`#${name}`).modal('show')
    },
    hideModal(name) {
      $(`#${name}`).modal('hide')
      if (name === 'add_address') this.addressVerified = false
      if (name === 'add_temperature') this.temperatureInputs = { value: null, remarks: '' }
    },
    addAddress() {
      if (!this.addressVerified) return
      const parameters = {
        account_id: this.scannedUserData.id,
        code: this.user.location.code,
        longitude: this.user.location.longitude,
        latitude: this.user.location.latitude,
        route: this.user.location.route,
        locality: this.user.location.locality,
        country: this.user.location.country,
        region: this.user.location.region,
        payload: 'brgy'
      }
      this.APIRequest('locations/create', parameters).then(response => {
        if (response.error.length > 0) console.log(`Error: ${response.error}`)
        this.hideModal('add_address')
        this.retrieve(this.code)
      })
    },
    addTemperature() {
      if (this.temperatureInputs.value === null || this.temperatureInputs.value === '') return
      const parameters = {
        account_id: this.scannedUserData.id,
        added_by: this.user.userID,
        value: this.temperatureInputs.value,
        remarks: this.temperatureInputs.remarks.trim() || null,
        location: this.user.assigned_location
      }
      this.APIRequest('temperatures/create', parameters).then(response => {
        if (response.error.length > 0) console.log(`Error: ${response.error}`)
        this.hideModal('add_temperature')
        this.retrieve(this.code)
      })
    },
    linkAccount() {
      const parameter = {
        owner: this.user.userID,
        account_id: this.scannedUserData.id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('linked_accounts/create', parameter).then(response => {
        if (response.data) {
          parameter.id = response.data
          parameter.created_at = response.request_timestamp
          parameter.updated_at = response.request_timestamp
          parameter.deleted_at = null
          // quick fix for updating link account button
          this.scannedUserData.linked_account = parameter
          this.alertMessage = {
            type: 'success',
            message: `Linked successfully! ${this.scannedUserData.username.toUpperCase()} is now linked to your account.`
          }
        } else {
          this.alertMessage = {
            type: 'danger',
            message: 'Error linking account.'
          }
        }
        this.hideModal('link_my_account')
        $('#loading').css({display: 'none'})
      })
    },
    sendForm(type) {
      $('#loading').css({display: 'block'})

      let content = null
      if (type === 'employee_checkin' || type === 'employee_checkout') {
        content = JSON.stringify({
          format: type,
          status: null,
          statusLabel: null
        })
      }

      let merchantOwner = this.user.userID
      if (this.user.linked_account) {
        merchantOwner = this.user.linked_account.owner
      }

      const parameter = {
        owner: merchantOwner,
        account_id: this.scannedUserData.id,
        from: this.user.userID,
        to: this.scannedUserData.id,
        content
      }

      this.APIRequest('health_declarations/create', parameter)
        .then(response => {
          if (response.data) {
            this.alertMessage = {
              type: 'success',
              message: `Health Declaration Form for ${type} successfully sent to ${this.scannedUserData.username.toUpperCase()}.`
            }
          } else {
            this.alertMessage = {
              type: 'danger',
              message: 'Error sending form.'
            }
          }
          $('#loading').css({display: 'none'})
        })
    }
  }
}
</script>
