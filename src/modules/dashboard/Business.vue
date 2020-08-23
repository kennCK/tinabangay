<template>
  <div class="container-fluid businessContainer">
    <div class="row flex-column-reverse flex-sm-row">
      <div class="col-sm-9 nopadding">
        <div class="col-sm-12">
        <div class="card">
          <div class="card-header chartAction">
            <div class="col-sm-3">
              <select class="form-control Affectedfilter" v-model="filterYear" @change="dataManipulation">
                <option v-for="(item, key) in years" :key="key">
                  {{item}}
                </option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <chart ref="realtimeChart" type="line" height="350" :options="chartOptions" :series="series"></chart>
            <h4 class="emptyChart" v-if="series[0].data.length < 1 && series[1].data.length < 1">No available data <i class="fas fa-sad-tear emptyChartICON"></i></h4>
          </div>
          <div class="card-footer chartAction chartFooter">
            <center><i v-for="element in new Date().getMonth() + 1" :key="element" :class="returnPagerEvent[element - 1].clicked ? 'pagerClicked' : 'pager'" @click="filterByMonth(element)">{{element}}</i></center>
          </div>
        </div>
        <div class="card branchesCard" v-if="branches !== null && branches.length > 0">
          <div class="header branchesCardHeader">
            <h4>BRANCHES</h4>
          </div>
          <div class="body">
            <b-table hover bordered :items="branchData" :fields="branchField"></b-table>
          </div>
        </div>
        <empty v-else 
          :title="'There\'s currently no hot spots logged.'" 
          :action="'Stay Home!'" 
          :icon="'far fa-smile'" 
          :iconColor="'text-success'"
        >
        </empty>
      </div>
      </div>
      <div class="col-sm-3  nopadding">
        <div class="col-sm-12">
          <empty v-if="fetchingBusinessInfo"
            :title="'Please wait a moment...'" 
            :action="'We are fetching your data...'" 
            :icon="'far fa-smile'"
            :iconColor="'text-success'"
          >
          </empty>
          <div class="card">
            <div class="card-body" v-if="businessInfo !== null">
              <center>
                <img v-if="businessInfo.logo !== null"
                  :src="backend + businessInfo.logo"
                  alt="logo"
                  class="business-logo"
                >
                <i v-else class="fa fa-image business-logo"></i>
              </center>
              <div class="mt-4">
                <p class="infoTitle">Name</p>
                <p class="businessInfo">{{ businessInfo.name || 'No information' }}</p>
                <p class="infoTitle" v-if="businessInfo.address">Address</p>
                <p class="businessInfo" v-if="businessInfo.address">{{ businessInfo.address || 'No information' }}</p>
                <p class="infoTitle">Email</p>
                <p class="businessInfo">{{ businessInfo.email || 'No information' }}</p>
              </div>
            </div>
            <div class="card-body" v-if="businessInfo === null && fetchingBusinessInfo === false">
              <empty
                :title="'Whoops!'" 
                :action="'Seems like you haven\'t setup your business information! Please head over to Business Settings to do so.'" 
                :icon="'far fa-frown'" 
                :iconColor="'text-warning'"
              >
              </empty>
            </div>
            <div class="card-footer businessFooter">
              <qr-code-scanner
                :btnWidth="'col-sm-12'"
                :state="qrScannerState"
                @toggleState="(newState) => qrScannerState = newState"
              >
              </qr-code-scanner>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @import "~assets/style/colors.scss";
  .border-thick {
    border-width: 5px !important;
  }
  .businessContainer{
    padding: 0px;
  }
  .businessInfo{
    font-weight: bold;
    font-size: 12px;
    margin: 0px;
    border-bottom: 1px solid rgb(207, 207, 207);
  }
  .businessFooter{
    background-color: white;
  }
  .chartAction{
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
  }
  .chartFooter{
    border: none;
  }
  .logo {
    max-width: 30%;
    margin: 0 auto;
  }
  .emptyChart{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    color: #6e6d6d;
  }
  .emptyChartICON{
    color: #6e6d6d;
  }
  .business-details {
    width: 100%;
    text-align: center;
    margin: 0;
  }
  .business-logo{
    width: 100%;
    height: auto;
    font-size: 70px;
    border-bottom: 1px solid rgb(207, 207, 207);
  }
  .branchesCard{
    margin-top: 15px;
  }
  .branchesCardHeader{
    padding: 15px;
  }
  .infoTitle{
    font-size: 10px;
    padding: 0px;
    margin: 0px;
  }
  .nopadding{
    padding: 0px;
  }
  .pager{
    font-style: normal;
    padding: 1px;
    padding-right: 6px;
    padding-left: 6px;
    border: 1px solid rgb(199, 199, 199);
  }
  .pagerClicked{
    font-style: normal;
    padding: 1px;
    padding-right: 6px;
    padding-left: 6px;
    color: white;
    border: 1px solid #005b96;
    background-color: #005b96;
  }
  .pager:hover{
    cursor: pointer;
  }
  .pagerClicked:hover{
    cursor: pointer;
  }
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
import chart from 'vue-apexcharts'
export default {
  mounted(){
    this.retrieveBusinessInfo()
    // this.retrieveEmployees()
    this.retrieveBranches()
    this.retrieveHDF()
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
      branches: [],
      fetchingBusinessInfo: false,
      branchField: [],
      branchData: [],
      series: [],
      chartOptions: {},
      years: [],
      filterYear: new Date().getFullYear(),
      filterMonth: new Date().getMonth(),
      chartData: null,
      pagerEvent: [
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false},
        {clicked: false}
      ]
    }
  },
  components: {
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'empty': require('./Empty.vue'),
    chart
  },
  computed: {
    returnPagerEvent(){
      return this.pagerEvent
    }
  },
  methods: {
    retrieveBusinessInfo() {
      let data = JSON.parse(localStorage.getItem('merchants/' + this.user.code))
      if(data){
        if(data.data.length > 0){
          this.businessInfo = data.data[0]
        }else{
          this.businessInfo = null
        }
        return
      }else{
        this.businessInfo = null
      }
      // this.fetchingBusinessInfo = true
      let par = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }
      this.APIRequest('merchants/retrieve', par).then(response => {
        localStorage.setItem('merchants/' + this.user.code, JSON.stringify(response))
        if(response.data.length > 0) {
          this.businessInfo = response.data[0]
        }
        this.fetchingBusinessInfo = false
      })
    },
    retrieveBranches() {
      let data = JSON.parse(localStorage.getItem('locations/' + this.user.code))
      this.branchField = [
        {
          key: 'route',
          sortable: true
        },
        {
          key: 'locality',
          sortable: true
        },
        {
          key: 'region',
          sortable: true
        },
        {
          key: 'country',
          sortable: true
        }
      ]
      JSON.parse(localStorage.getItem('locations/' + this.user.code)).data.forEach((element, index) => {
        this.branchData.push(
          {
            'route': element.route,
            'locality': element.locality,
            'region': element.region,
            'country': element.country
          }
        )
      })
      if(data){
        if(data.data.length > 0){
          this.branches = data.data
        }else{
          this.branches = null
        }
        return
      }else{
        this.branches = null
      }
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
          localStorage.setItem('invitations/' + this.user.code, JSON.stringify(response))
          this.branches = response.data
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
    },
    retrieveHDF(){
      let par = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'owner'
        }]
      }
      this.APIRequest('health_declarations/retrieve_per_business', par).then(response => {
        this.chartData = response.data
        this.dataManipulation()
        this.pagerEvent[this.filterMonth].clicked = true
      })
    },
    filterByMonth(month){
      this.filterMonth = month - 1
      this.pagerEvent.forEach((element, index) => {
        if(index === month - 1){
          element.clicked = true
        }else{
          element.clicked = false
        }
      })
      this.dataManipulation()
    },
    dataManipulation(){
      let hdfCount = []
      let individualCount = []
      let date = []
      let dataDates = []
      let individual = []
      let uniqueMonths = []
      let temporary = []
      this.chartData.forEach(element => {
        let year = new Date(element.created_at).getFullYear()
        let month = new Date(element.created_at).getMonth()
        let day = new Date(element.created_at).getDate()
        if(!this.years.includes(year)){
          this.years.push(year)
        }
        if(new Date(element.created_at).getFullYear() === this.filterYear){
          if(!uniqueMonths.includes(month)){
            uniqueMonths.push(month)
          }
          month = (String(month + 1).length < 2) ? ('0' + String(month + 1)) : String(month + 1)
          day = (String(day).length < 2) ? ('0' + String(day)) : String(day)
          let d = year + '-' + month + '-' + day
          if(!date.includes(d)){
            date.push(d)
            let x = {
              notsafeHDF: 0,
              notSafeIndividual: 0
            }
            if(JSON.parse(element.content).status === 'danger'){
              x.notsafeHDF = x.notsafeHDF + 1
              if(!individual.includes(element.account_id) && element.account_id !== undefined){
                individual.push(element.account_id)
                x.notSafeIndividual = x.notSafeIndividual + 1
              }else{
                if(!individual.includes(element.account_id) && element.account_id !== undefined){
                  x.notSafeIndividual = x.notSafeIndividual + 1
                }
              }
              x.date = d
              temporary.push(x)
            }
          }else{
            if(JSON.parse(element.content).status === 'danger'){
              temporary.forEach(t => {
                if(t.date === d){
                  let a = t['notsafeHDF']
                  t['notsafeHDF'] = a + 1
                }
              })
              if(!individual.includes(element.account_id) && element.account_id !== undefined){
                individual.push(element.account_id)
                temporary.forEach(t => {
                  if(t.date === d){
                    let a = t['notSafeIndividual']
                    t.notSafeIndividual = a + 1
                  }
                })
              }else{
                if(!individual.includes(element.account_id) && element.account_id !== undefined){
                  temporary.forEach(t => {
                    if(t.date === date){
                      let a = t['notSafeIndividual']
                      t.notSafeIndividual = a + 1
                    }
                  })
                }
              }
              individual = []
            }
          }
        }
      })
      let tyear = String(new Date().getFullYear())
      let tmonth = (String(new Date().getMonth() + 1).length < 2) ? '0' + String(new Date().getMonth() + 1) : String(new Date().getMonth() + 1)
      let tday = (String(new Date().getDate()).length < 2) ? '0' + String(new Date().getDate()) : String(new Date().getDate())
      let tdate = tyear + '-' + tmonth + '-' + tday
      uniqueMonths = this.sorter(uniqueMonths)
      uniqueMonths.forEach(element => {
        if(element === this.filterMonth){
          for(var i = this.daysCountGetter(element).start; i < this.daysCountGetter(element).end + 1; i++){
            let year = this.filterYear
            let month = (String(element + 1).length < 2) ? '0' + String(element + 1) : String(element + 1)
            let d = (String(i).length < 2) ? '0' + String(i) : String(i)
            let petsa = year + '-' + month + '-' + d
            if(!dataDates.includes(petsa)){
              dataDates.push(petsa)
              hdfCount.push(0)
              individualCount.push(0)
              temporary.forEach(element => {
                if(element.date === petsa){
                  dataDates[date.length - 1] = element.date
                  hdfCount[hdfCount.length - 1] = element.notsafeHDF
                  individualCount[individualCount.length - 1] = element.notSafeIndividual
                }
              })
            }
            if(petsa >= tdate){
              break
            }
          }
        }
      })
      this.updateChart(hdfCount, individualCount, dataDates)
    },
    updateChart(notSafeHDF, notSafeIndividual, Categories){
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      this.series = [
        {
          name: 'Not Safe HDF',
          data: notSafeHDF
        },
        {
          name: 'Not Safe Individual',
          data: notSafeIndividual
        }
      ]
      this.chartOptions = {
        chart: {
          height: 400,
          type: 'line',
          toolbar: {
            show: true,
            offsetX: -5
          },
          offsetX: -10
        },
        colors: ['#005b96', '#dc3545'],
        stroke: {
          curve: 'straight',
          width: 2
        },
        title: {
          text: 'Not Safe HDF & Not Safe Individual',
          align: 'left',
          offsetY: 15,
          sizeOffset: 50,
          offsetX: 5
        },
        grid: {
          borderColor: '#e7e7e7'
        },
        markers: {
          size: 3,
          hover: {
            sizeOffset: 5
          }
        },
        xaxis: {
          categories: Categories.forEach(element => { return new Date(element).getDate() }),
          title: {
            text: months[this.filterMonth]
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -10,
          offsetX: -5
        }
      }
    },
    daysCountGetter(mo){
      let year = this.filterYear
      let month = mo
      var weeks = []
      let firstDate = new Date(year, month, 1)
      let lastDate = new Date(year, month + 1, 0)
      let numDays = lastDate.getDate()
      var start = 1
      var end = 7 - firstDate.getDay()
      while(start <= numDays){
        weeks.push({start: start, end: end})
        start = end + 1
        end = end + 7
        if(end > numDays){
          end = numDays
        }
      }
      return {start: weeks[0].start, end: weeks[weeks.length - 1].end}
    },
    sorter(data){
      let unique = data
      for(var i = 0; i < unique.length; i++){
        let temp = unique[i + 1]
        if(i + 1 !== unique.length){
          if(unique[i] > unique[i + 1]){
            unique[i + 1] = unique[i]
            unique[i] = temp
            i = -1
          }
        }
      }
      return unique
    }
  }
}
</script>
