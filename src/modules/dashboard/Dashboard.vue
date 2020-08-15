<template>
  <div style="margin-bottom: 50px;">
    <business v-if="dashType === 'BUSINESS'"></business>
    <user v-else-if="dashType === 'USER' || dashType === 'BUSINESS_AUTHORIZED' || dashType === 'TEMP_SCANNER'"></user>
    <lguBrgy v-else-if="['AGENCY_BRGY', 'LGU'].includes(dashType)"></lguBrgy> 
    <Admin v-else-if="dashType === 'ADMIN'"></Admin>
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
    'lguBrgy': require('./lguBrgy.vue'),
    'Admin': require('./Admin.vue')
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
      if(this.user.type !== 'USER' && this.user.type !== 'BUSINESS_AUTHORIZED' && this.user.type !== 'TEMP_SCANNER'){
        return
      }
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
