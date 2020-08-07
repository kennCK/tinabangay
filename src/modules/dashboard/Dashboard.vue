<template>
  <div style="margin-bottom: 50px;">
    <business v-if="dashType === 'BUSINESS'"></business>
    <user v-else-if="dashType === 'USER'"></user>
    <AgencyBrgy v-else-if="dashType === 'AGENCY_BRGY'"></AgencyBrgy> 
    <div v-else-if="dashType === 'ADMIN'">
      <data-summary></data-summary>
      <br>
      <br>
      <div class="row flex-column-reverse flex-sm-row">
        <div class="col-sm-8 affectedSection">
          <div class="card">
            <div class="card-body">
              <trend></trend>
              <center>
                <button 
                  type="button" 
                  class="btn viewMoreTestBtn" 
                  @click="redirect('places/trend')"
                  v-if="this.disableShowMore"
                >view more</button>
              </center>
            </div>
          </div>
        </div>
        <div class="col-sm-4 QRSection">
          <div 
              :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum', 'text-primary': status.status === 'pui', 'text-success': status.status === 'negative'}" v-if="status !== null"
              class="col-sm-12 alert alert-info"
            >STATUS : {{status.status_label}}</div>
          <div class="card">
            <div class="card-header QRReminderSection">
              Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature or show this to DOH authorized personnel.
            </div>
            <div class="card-body">
              <div v-if="user.code !== null" class="row justify-content-center pt-5">
                <QrcodeVue :value="`account/${user.code}`" :size="QRsizerGetter"></QrcodeVue>
              </div>
            </div>
            <div class="card-action">
              <center>
                <qr-code-scanner 
                  :state="qrScannerState" 
                  @toggleState="(newState) => qrScannerState = newState"
                ></qr-code-scanner>
              </center>
              <br>
            </div>
          </div>
        </div>
        <br>
        <br>
      </div>
    </div>
    <!-- <div v-else class="row" style="margin-top: 25px;">
      <div class="col-lg-6" style="margin-bottom: 25px;">
        <p>
          <i class="text-lowercase">{{
            'Data from ' + common.implementedLocality
          }}</i>
        </p>
        <div class="row w-100 mx-0 justify-content-end mb-3 align-items-center" v-if="user.type === 'USER'">
          <span>Having issues with your barangay?</span> <button class="ml-3 btn btn-primary" @click="showModal()">Send Feedback</button>
        </div>
        <div class="row mx-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3">
          Your Status
        </div>
        <label class="text-uppercase" :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum', 'text-primary': status.status === 'pui', 'text-success': status.status === 'negative'}" v-if="status !== null">
          <i class="fas fa-square" style="margin-right: 5px;"></i> -->
          <!-- Person Under Investigation(PUI) -->
          <!-- {{status.status_label}}
        </label>
        <div class="row mx-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3 mt-4">
          Current Data
        </div>
        <div class="alert alert-info">This information is not updated as some users are not registered yet</div>
        <data-summary></data-summary>
        <div class="row mx-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3">
          QR Code
        </div> -->

        <!-- QR CODE SCANNER -->
        <!-- <qr-code-scanner :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"></qr-code-scanner>

        <p>
          Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners everytime they read your temperature or show this to DOH authorized personnel.
        </p>
        <div v-if="user.code !== null" class="row justify-content-center pt-5">
          <QrcodeVue :value="`account/${user.code}`" :size="300"></QrcodeVue>
        </div>
      </div>
      <trend></trend>
    </div>
    <increment-modal refs="modal" :property="modalProperty"></increment-modal> -->
    <!--MODAL FOR NO BRGY ERROR-->
    <!-- <div class="modal fade right" id="no_code" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Oops!</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('no_code')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            You're not assigned to a barangay yet. Please contact your barangay office to activate your account.
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="hideModal('no_code')">Okay</button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.affectedSection{
  padding-right:0px;
}
.bg-primary{
  background: $primary !important;
}
.QRReminderSection{
  border-bottom:none;
}
.QRSection{
  margin-bottom: 20px;
}
.text-primary {
  color: $primary !important;
}

.text-warning {
  color: $warning !important;
}

.text-black {
  color: #000 !important;
}
.text-success {
  color: $success !important;
}

.half-rule {
  margin-left: 0;
  text-align: left;
  width: 50%;
}
.viewMoreTestBtn{
  border:1px solid #dc3545;
  background-color:white;
  height:40px;
  width:140px;
  padding:0px;
  padding-bottom:2px;
}
.viewMoreTestBtn:focus{
  box-shadow:none !important;
  outline:none !important;
}
.viewMoreTestBtn:hover{
  background-color: #dc3545;
  color:white;
  box-shadow: 0px 0px 30px #bfbfbf;
}
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import ROUTER from 'src/router'
export default{
  mounted(){
    this.retrieve()
    if(this.userTypes.indexOf(this.user.type) > -1) {
      this.dashType = 'USER'
    }
    window.addEventListener('resize', this.QRResizer)
  },
  data(){
    return {
      user: AUTH.user,
      dashType: AUTH.user.type,
      userTypes: ['USER', 'TEMP_SCANNER', 'AGENCY_TEST_MNGT', 'AGENCY_TEMPT_MNGT'],
      type: null,
      disableShowMore: false,
      modalProperty: ComplaintProperty,
      property: {
        style: {
          height: '45px !important'
        },
        GOOGLE_API_KEY: CONFIG.GOOGLE_API_KEY,
        results: {
          style: {
          }
        },
        placeholder: 'Type places'
      },
      status: null,
      common: COMMON,
      qrScannerState: false,
      qrSize: 220
    }
  },
  props: {
  },
  components: {
    'trend': require('modules/places/Trend_v2.vue'),
    QrcodeVue,
    'data-summary': require('modules/dashboard/Summary.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'business': require('./Business.vue'),
    'user': require('./User.vue'),
    'AgencyBrgy': require('./Agency_brgy.vue')
  },
  computed: {
    QRsizerGetter(){
      return this.qrSize
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        id: this.user.userID
      }
      // For HIDING and SHOWING the VIEW MORE BUTTON //
      let forShowMore = {
        status: 'positive'
      }
      // Ends Here //
      // $('#loading').css({display: 'block'})
      this.APIRequest('tracings/status', parameter).then(response => {
        // $('#loading').css({display: 'none'})
        this.status = response.data
      })
      // For HIDING and SHOWING the VIEW MORE BUTTON //
      this.APIRequest('tracing_places/places', forShowMore).then(response => {
        if(response.data.length > 0){
          this.disableShowMore = true
        }
      })
      // Ends Here //
    },
    showModal() {
      if(!this.user.location || !this.user.location.code) {
        $('#no_code').modal('show')
      } else {
        this.modalProperty = {...ComplaintProperty}
        this.modalProperty.params.push({variable: 'code', value: this.user.location.code})
        let inputs = this.modalProperty.inputs
        inputs.map(input => {
          input.value = null
        })
        $('#createComplaint').modal('show')
      }
    },
    hideModal(input) {
      $(`#${input}`).modal('hide')
    },
    QRResizer(){
      // if(window.innerWidth )842 730
      if(window.innerWidth <= 842 || window.innerWidth >= 690){
        this.qrSize = 180
      }
      if(window.innerWidth > 575 || window.innerWidth <= 689){
        this.qrSize = 160
      }
      if(window.innerWidth < 576 || window.innerWidth > 1000){
        this.qrSize = 220
      }
    }
  },
  destroy(){
    window.removeEventListener('resize', this.QRResizer)
  }
}
</script>
