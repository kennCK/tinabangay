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
        <div v-if="branches !== null && branches.length > 0">
          <h3>BRANCHES</h3>
          <div class="border my-3" v-for="(branch, index) in branches" :key="index">
            <div class="card-body">
              <h5 class="card-title">{{ `${branch.route} ${branch.locality}` }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ branch.region }}</h6>
              <div class="d-flex">
                <span class="card text-white bg-danger mr-2" style="width: 150px">
                  <span class="card-header">
                    <h5 class="card-title text-center">
                      {{ branch.positive_size != null ? branch.positive_size : 0 }}
                    </h5>
                  </span>
                  <span class="card-body p-0 mx-auto">Positive</span>
                </span>
                <span class="card text-white bg-success mx-2" style="width: 150px">
                  <span class="card-header">
                    <h5 class="card-title text-center">
                      {{ branch.recovered_size != null ? branch.recovered_size : 0 }}
                    </h5>
                  </span>
                  <span class="card-body p-0 mx-auto">Recovered</span>
                </span>
                <span class="card text-white bg-dark mx-2" style="width: 150px">
                  <span class="card-header">
                    <h5 class="card-title text-center">
                      {{ branch.death_size != null ? branch.death_size : 0 }}
                    </h5>
                  </span>
                  <span class="card-body p-0 mx-auto">Death</span>
                </span>
              </div>
            </div>
          </div>
        </div>
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
export default {
  mounted(){
    this.retrieveBusinessInfo()
    this.retrieveEmployees()
    this.retrieveBranches()
  },
  data(){
    return {
      user: AUTH.user,
      common: COMMON,
      backend: CONFIG.BACKEND_URL,
      businessInfo: null,
      qrScannerState: false,
      affectedEmp: null,
      data: null,
      branches: []
    }
  },
  components: {
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'empty': require('./Empty.vue')
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
        if(response.data.length > 0) {
          this.businessInfo = response.data[0]
        }
      })
    },
    retrieveBranches() {
      const parameter = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }],
        sort: {
          route: 'asc'
        }
      }

      this.APIRequest('locations/retrieve', parameter).then((response) => {
        if(response.data.length > 0) {
          const data = [...response.data]
          response.data.forEach((branch, idx) => {
            const param = {
              status: 'positive',
              locality: branch.locality + '%',
              route: branch.route + '%'
            }
            this.APIRequest('tracing_places/places', param).then(res => {
              if (res.data.length > 0) {
                if (data[idx].route === res.data[0].route) {
                  console.log({ dataRoute: data[idx].route, resRoute: res.data[0].route, param })
                  data[idx].death_size = res.data[0].death_size != null ? res.data[0].death_size : 0
                  data[idx].negative_size = res.data[0].negative_size != null ? res.data[0].negative_size : 0
                  data[idx].positive_size = res.data[0].positive_size != null ? res.data[0].positive_size : 0
                  data[idx].pui_size = res.data[0].pui_size != null ? res.data[0].pui_size : 0
                  data[idx].pum_size = res.data[0].pum_size != null ? res.data[0].pum_size : 0
                  data[idx].recovered_size = res.data[0].recovered_size != null ? res.data[0].recovered_size : 0
                }
              }
              this.branches.push(data[idx])
            }).fail(err => console.log({ err, param }))
          })
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
