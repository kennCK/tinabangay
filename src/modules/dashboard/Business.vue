<template>
  <!-- <div>
    <div v-if="businessInfo !== null" class="w-100 row m-0 mt-3 align-items-center">
      <div class="logo">
        <img :src="backend+businessInfo.logo" alt="" class="img-fluid rounded-circle border border-primary border-thick">
      </div>
      <div class="business-details row flex-column">
        <h3 class="text-primary font-weight-bold">{{businessInfo.name}}</h3>
        <div class="text-secondary font-weight-bold">{{businessInfo.email}}</div>
        <div class="text-secondary">{{businessInfo.address}}</div>
      </div>
    </div>
    <hr v-if="businessInfo !== null">
    <div class="row m-0 mt-3">
      <div class="col-12 text-center">
        <h5 class="text-primary font-weight-bold">Dashboard</h5>
      </div>
      <div class="col-md-6 col-sm-12 mt-3">
        <qr-code-scanner :btnWidth="'col-md-3 col-sm-12'" :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"></qr-code-scanner>
      </div>
      <div class="col-6 mt-3">
        
      </div>
    </div>
  </div> -->
  <div class="col-sm-12">
      <div class="row flex-column-reverse flex-sm-row" v-if="businessInfo !== null">
        <div class="col-sm-9">
          <topAffectedPlaces 
            v-if="data !== null" 
            ref="realtimeChart" 
            height="500" type="bar" 
            :options="options" 
            :series="series"
          >
          </topAffectedPlaces>
          <empty v-else 
            :title="'There\'s currently no hot spots logged.'" 
            :action="'Stay Home!'" 
            :icon="'far fa-smile'" 
            :iconColor="'text-danger'"
          >
          </empty>
        </div>
        <div class="col-sm-3">
          <center>
            <img v-if="businessInfo.logo !== null"
              :src="backend + businessInfo.logo"
              alt="logo"
              class="business-logo"
            >
            <i v-else class="fa fa-image business-logo"></i>
          </center>
          <p>
            {{businessInfo.name}}
          </p>
          <p>
            {{businessInfo.address}}
          </p>
          <p>
            {{businessInfo.email}}
          </p>
          <qr-code-scanner 
            :btnWidth="'col-sm-12'" 
            :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"
          >
          </qr-code-scanner>
        </div>
      </div>
      <empty v-else 
        :title="'Whoops!'" 
        :action="'Seems like you haven\'t setup your business information! Please head over to Business Settings to do so.'" 
        :icon="'far fa-frown'" 
        :iconColor="'text-danger'"
      >
      </empty>
  </div>
</template>
<style scoped lang="scss">
  @import "~assets/style/colors.scss";
  .border-thick {
    border-width: 5px !important;
  }

  .logo {
    max-width: 30%;
    margin: 0 auto;
  }

  .business-details {
    width: 100%;
    text-align: center;
    margin: 0;
  }

  // Bargaso css starts here
  .business-logo{
    width: 100%;
    height: auto;
    font-size: 15rem;
  }

  // until here
  @media (min-width: 768px) {  
    .logo {
      max-width: 10%;
      margin-left: 3rem;
      margin-right: 1rem;
    }

    .business-details {
      width: auto;
      text-align: left;
    }
  }
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import topAffectedPlaces from 'vue-apexcharts'
export default {
  mounted(){
    this.retrieveBusinessInfo()
    this.retrieveEmployees()
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      backend: CONFIG.BACKEND_URL,
      businessInfo: null,
      branches: null,
      qrScannerState: false,
      affectedEmp: null,
      data: '',
      data_categories: [],
      options: {},
      series: [
        {
          name: 'positive',
          data: []
        },
        {
          name: 'recovered',
          data: []
        },
        {
          name: 'death',
          data: []
        }
      ]
    }
  },
  components: {
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'empty': require('./Empty.vue'),
    topAffectedPlaces
  },
  methods: {
    retrieveBusinessInfo() {
      let par = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }
      this.APIRequest('merchants/retrieve', par).then(response => {
        // console.log('business Info ', response)
        if(response.data.length > 0) {
          this.businessInfo = response.data[0]
        }
      })

      let series = [[], [], []]
      for(var i = 0; i < 5; ++i){
        this.data_categories.push(['Business Route' + ', ', 'Business location'])
        series[0].push(23)
        series[1].push(12)
        series[2].push(100)
      }
      this.options = {
        chart: {
          id: 'topAffected'
        },
        title: {
          text: 'TOP AFFECTED BRANCHES',
          align: 'center',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '25px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: '#007be0'
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'category',
          categories: this.data_categories,
          maxHeight: 500,
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: false,
            showDuplicates: false,
            trim: true,
            minHeight: undefined,
            maxHeight: 120,
            style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label'
            },
            offsetX: 0,
            offsetY: 0
          }
        },
        colors: ['#dc3545', '#28a745', '#343a40']
      }

      this.series = [
        {
          name: 'positive',
          data: series[0]
        },
        {
          name: 'recovered',
          data: series[1]
        },
        {
          name: 'death',
          data: series[2]
        }
      ]
    },
    retrieveBranches() {
      let parameter = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }],
        sort: {
          route: 'asc'
        }
      }

      let series = [[], [], []]
      this.APIRequest('locations/retrieve', parameter).then(response => {
        if(response.data.length > 0) {
          this.brances = response.data
        } else {
          this.branches = null
        }
      })
    },
    retrieveEmployees() {
      let par = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'owner'
        }]
      }

      this.APIRequest('linked_accounts/retrieve_tracing', par).then(response => {
        console.log('linked-Accounts ', response.data)
      })
    }
  }
}
</script>
