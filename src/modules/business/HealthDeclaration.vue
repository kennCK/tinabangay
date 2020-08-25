<template>
  <div>

    <!-- FETCHING FORM -->
    <div v-if="loading" class="mt-5 form-wrapper">
      <div class="loading-div">
        <h3>Loading form</h3>
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </div>
    </div>

    <!-- INVALID HEALTH DECLARATION -->
    <div v-if="!loading && formNotFound" class="col-10 mx-auto mt-5 d-flex align-items-center">
      <h3 class="w-100 text-center alert alert-danger">Error: Health Declaration Form not found</h3>
    </div>

    <!-- INVALID HEALTH DECLARATION -->
    <div v-if="!loading && !formNotFound && data.merchant === null" class="col-10 mx-auto mt-5 d-flex align-items-center">
      <h3 class="w-100 text-center alert alert-danger">Invalid: No merchant found</h3>
    </div>
    <div v-if="!loading && userHDFcreate && !isCustomer">
      Switch HDF to: 
      <button v-if="formParameters.format !== 'customer'" class="btn btn-primary" @click="switchHDF('customer')">Customer </button>
      <button v-if="formParameters.format !== 'employee_checkin'" class="btn btn-primary" @click="switchHDF('employee_checkin')">Checkin</button>
      <button v-if="formParameters.format !== 'employee_checkout'" class="btn btn-primary" @click="switchHDF('employee_checkout')">Checkout</button>
      <button class="btn btn-secondary" @click="dashboard()">Cancel</button>
    </div>
    <div v-if="!formNotFound">
      <!-- HEALTH DECLARATION FOR CUSTOMER -->
      <customer-health-declaration
        v-if="!loading && formParameters.format === 'customer' && data.merchant !== null"
        :healthDecParam="healthDec"
        :formParam="formParameters"
        :isForm="form"
        :dataParam="data"
        :userInfoParam="userInfo"
        :isUserCreate="userHDFcreate"
        @triggerRetrieve="retrieve()"
      >
      </customer-health-declaration>

      <!-- HEALTH DECLARATION FOR EMPLOYEE CHECKIN -->
      <employee-checkin-hd
        v-if="!loading && formParameters.format === 'employee_checkin' && data.merchant !== null"
        :healthDecParam="healthDec"
        :formParam="formParameters"
        :isForm="form"
        :dataParam="data"
        :userInfoParam="userInfo"
        :isUserCreate="userHDFcreate"
        @triggerRetrieve="retrieve()"
      >
      </employee-checkin-hd>

      <!-- HEALTH DECLARATION FOR EMPLOYEE CHECKOUT -->
      <employee-checkout-hd
        v-if="!loading && formParameters.format === 'employee_checkout' && data.merchant !== null"
        :healthDecParam="healthDec"
        :formParam="formParameters"
        :isForm="form"
        :dataParam="data"
        :userInfoParam="userInfo"
        :isUserCreate="userHDFcreate"
        @triggerRetrieve="retrieve()"
      >
      </employee-checkout-hd>
    </div>

  </div>
</template>
<style lang="scss">
@import "~assets/style/colors.scss";
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
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'

export default {
  mounted() {
    this.userHDFcreate = false
    this.scannedUserAnswerForm = false
    this.code = this.$route.params.code
    const isHDFcode = this.code.substring(0, 4) === 'HDF-'

    if (this.code.length === 64 && isHDFcode) {
      this.userHDFcreate = false
      this.retrieve()
    } else {
      const param = this.code.split('&')
      if(param[0] === 'customer') {
        this.isCustomer = true
      }
      if (param[0] === 'customer' || param[0] === 'employee_checkin' || param[0] === 'employee_checkout') {
        this.form = true
        this.userHDFcreate = true
        this.merchantOwner = parseInt(param[1])
        this.userHDFcontent = JSON.parse(param[2])
        if (this.userHDFcontent.hasOwnProperty('answerForm') && this.userHDFcontent.answerForm) {
          this.scannedUserAnswerForm = true
        }
        this.retrieve()
      } else {
        this.loading = false
        this.formNotFound = true
      }
    }
  },
  data() {
    return{
      user: AUTH.user,
      formNotFound: false,
      loading: true,
      healthDec: JSON.parse(JSON.stringify(COMMON.healthDec)),
      formParameters: {
        format: null,
        status: null,
        statusLabel: null,
        location: null
      },
      form: false,
      code: null,
      data: null,
      userInfo: null,
      config: CONFIG,
      merchantOwner: null,
      userHDFcreate: false,
      userHDFcontent: null,
      scannedUserAnswerForm: false,
      isCustomer: false
    }
  },
  components: {
    'customer-health-declaration': require('./CustomerHD'),
    'employee-checkin-hd': require('./EmployeeCheckinHD'),
    'employee-checkout-hd': require('./EmployeeCheckoutHD')
  },
  computed: {
    getFullPath() {
      return this.$route.path
    }
  },
  watch: {
    getFullPath() {
      this.userHDFcreate = false
      this.scannedUserAnswerForm = false
      this.code = this.$route.params.code
      const isHDFcode = this.code.substring(0, 4) === 'HDF-'

      if (this.code.length === 64 && isHDFcode) {
        this.userHDFcreate = false
        this.retrieve()
      } else {
        const param = this.code.split('&')
        if (param[0] === 'customer' || param[0] === 'employee_checkin' || param[0] === 'employee_checkout') {
          this.form = true
          this.userHDFcreate = true
          this.merchantOwner = parseInt(param[1])
          this.userHDFcontent = JSON.parse(param[2])
          if (this.userHDFcontent.hasOwnProperty('answerForm') && this.userHDFcontent.answerForm) {
            this.scannedUserAnswerForm = true
          }
          this.retrieve()
        } else {
          this.loading = false
          this.formNotFound = true
        }
      }

      this.healthDec = JSON.parse(JSON.stringify(COMMON.healthDec))
    }
  },
  methods: {
    switchHDF(type) {
      this.formParameters.format = type
    },
    dashboard() {
      ROUTER.push('/dashboard')
    },
    retrieve() {
      this.formNotFound = false
      this.loading = true
      $('#loading').css({display: 'none'})

      const userParam = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }]
      }

      if (this.userHDFcreate) {
        const merchantParam = {
          condition: [{
            column: 'account_id',
            clauses: '=',
            value: this.merchantOwner
          }]
        }

        this.formParameters.location = this.userHDFcontent.location
        this.formParameters.format = this.userHDFcontent.format
        this.formParameters.status = this.userHDFcontent.status
        this.formParameters.statusLabel = this.userHDFcontent.statusLabel
        this.APIRequest('merchants/retrieve', merchantParam).then(response => {
          this.data = {
            owner: this.merchantOwner,
            merchant: response.data[0]
          }

          if (this.scannedUserAnswerForm && this.userHDFcontent.hasOwnProperty('userData')) {
            this.formParameters.scannedUserAnswerForm = true
            this.userInfo = this.userHDFcontent.userData
            this.loading = false
          } else {
            this.APIRequest('account_informations/retrieve', userParam).then(response => {
              this.userInfo = response.data[0]
              this.loading = false
            })
          }
        }).fail(() => {
          this.loading = false
          this.formNotFound = true
        })
      } else {
        const hdfParam = {
          condition: [{
            value: this.code,
            column: 'code',
            clause: '='
          }]
        }
        this.APIRequest('health_declarations/retrieve', hdfParam).then(response => {
          this.data = response.data[0]
          const parsedContent = JSON.parse(this.data.content)
          if (response.data[0].updated_at === null) {
            this.form = true
          } else {
            this.form = false
            this.healthDec = parsedContent
          }
          this.formParameters.location = parsedContent.location
          this.formParameters.format = parsedContent.format
          this.formParameters.status = parsedContent.status
          this.formParameters.statusLabel = parsedContent.statusLabel

          this.APIRequest('account_informations/retrieve', userParam).then(res => {
            this.userInfo = res.data[0]
            this.loading = false
          })
        }).fail(() => {
          this.loading = false
          this.formNotFound = true
        })
      }
    }
  }
}
</script>
