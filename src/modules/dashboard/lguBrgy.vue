<template>
    <div>
        <data-summary></data-summary>
        <br>
        <br>
        <div class="row flex-column-reverse flex-sm-row">
            <div class="col-sm-9 affectedSection">
                <div class="card bg-light affectedCard" v-if="lineGraphData !== null">
                    <div class="card-header affectedSearchArea">
                        <!-- <input type="text" class="affected-searchtbn form-control" placeholder="Search"> -->
                      <div class="row affectedFilters">
                        <div class="col-sm-3 affectedSearchAreaFilter">
                          <select class="form-control Affectedfilter" v-model="filter" @change="filterby">
                            <option value='yearly' class="AffectedfilterOption">Yearly</option>
                            <option value='monthly' class="AffectedfilterOption">Monthly</option>
                            <option value='weekly' class="AffectedfilterOption">Weekly</option>
                            <option value='daily' class="AffectedfilterOption">Daily</option>
                          </select>
                        </div>
                        <div class="col-sm-3 affectedSearchAreaFilter">
                          <select class="form-control Affectedfilter" v-model="filterYear" @change="yearFilter">
                            <option v-for="(item, key) in returnFilterYear" :key="key" class="AffectedfilterOption">
                              {{item}}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                        <topAffectedPlaces 
                          ref="realtimeChart" 
                          height="340" 
                          type="line" 
                          :options="options" 
                          :series="series"
                        >
                        </topAffectedPlaces>
                        
                    </div>
                    <div class="card-footer affectedActionBTNS">
                        <center>
                            <i class="fas fa-angle-double-left previousBTN" @click="dataPrevious"></i>
                            <i class="affectedCounter">{{lineGraphLastIndex}} / {{returnSeries}}</i>
                            <i class="fas fa-angle-double-right nextBTN" @click="dataNext"></i>
                        </center>
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
            <div class="col-sm-3 QRSection">
            <div 
                :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum', 'text-primary': status.status === 'pui', 'text-success': status.status === 'negative'}" v-if="status !== null"
                class="col-sm-12 alert alert-info"
                >STATUS : {{status.status_label}}</div>
                <div class="card">
                    <div class="card-header QRReminderSection">
                        <center>
                            <img v-if="agencyInfo.logo !== null && agencyInfo.logo !== undefined"
                                :src="backend + agencyInfo.logo"
                                alt="logo"
                                class="AgencyLogo"
                            >
                            <div v-else class="card avatarLogo">
                              <div class="card-body">
                                <i class="far fa-image avatarLogoIcon"></i>
                              </div>
                            </div>
                        </center>
                    </div>
                    <div class="card-body Binfo-body">
                        <p class="Binfo1" v-if="agencyInfo.name !== null">{{agencyInfo.name}}</p>
                        <p class="Binfo2" v-if="agencyInfo.address !== null && user.type !== 'AGENCY_GOV'">{{agencyInfo.address}}</p>
                        <p class="Binfo3" v-if="agencyInfo.email !== null">{{agencyInfo.email}}</p>
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
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.AgencyLogo{
  height:200px !important;
  width:200px !important;
}
.avatarLogo{
  height: 200px !important;
  width: 100% !important;
}
.avatarLogoIcon{
  font-size: 100px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  margin-bottom: 20px;
}
.Affectedfilter{
  width:100%;
  padding-bottom:0px;
  padding-top:0px;
  font-size: 13px !important;
}
.affectedSection{
  padding-right: 0px;
}
.Binfo-body{
  border-left: 7px solid #005b96;
  padding-left: 3px;
  padding-right: 3px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.Binfo1{
  margin: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
}
.Binfo2{
  margin: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
}.Binfo3{
  margin: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
}
.bg-primary{
  background: $primary !important;
}
.QRReminderSection{
  border-bottom:none;
  padding:10px;
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

.topAffected{
    height: 500 !important;
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

  .affectedActionBTNS{
    background-color:white;
    border-top: none;
    border-radius: 10px;
  }
  .affectedCard{
    border-radius: 10px;
  }
  .affectedCounter{
    font-style: normal;
    margin-left: 7px;
    margin-right: 7px;
    color: #828282;
  }
  .affectedSearchArea{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: white;
  }
  .affectedFilters{
    padding-left:20px;
    padding-right:20px;
  }
  .affectedSearchAreaFilter{
    padding:0px;
  }
  .business-logo{
    width: 100%;
    height: auto;
  }
  .affected-searchtbn{
    width: 60%;
    outline: none;
  }
  .affected-searchtbn:focus{
    outline: none;
    box-shadow: none;
  }
  .previousBTN{
    padding:10px;
    padding-left:11px;
    padding-right:11px;
    cursor: pointer;
    border:1px solid white;
    color: #828282
  }
  .previousBTN:hover{
    color:#4a4a4a;
  }
  .nextBTN{
    padding:10px;
    padding-left:11px;
    padding-right:11px;
    cursor: pointer;
    border:1px solid white;
    color: #828282
  }
  .nextBTN:hover{
    color:#4a4a4a;
  }
  @media (min-width:576px) {
    .AgencyLogo{
      height:100px !important;
      width:100px !important;
    }
  }
  @media (min-width:700px) {
    .AgencyLogo{
      height:120px !important;
      width:120px !important;
    }
  }
  @media (min-width:800px) {
    .AgencyLogo{
      height:135px !important;
      width:135px !important;
    }
  }
  @media (min-width:900px) {
    .AgencyLogo{
      height:155px !important;
      width:155px !important;
    }
  }
  @media (min-width:991px) {
    .AgencyLogo{
      height:140px !important;
      width:140px !important;
    }
  }
  @media (min-width:1200px) {
    .AgencyLogo{
      height:200px !important;
      width:200px !important;
    }
  }
  @media (max-width:575px) {
    .affectedSection{
      padding-right: 15px;
    }
  }
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import ROUTER from 'src/router'
import topAffectedPlaces from 'vue-apexcharts'
import Filtering from './Filters.js'
export default{
  mounted(){
    console.log('type ', this.user)
    this.retrieve()
    if(this.userTypes.indexOf(this.user.type) > -1) {
      this.dashType = 'USER'
    }
  },
  data(){
    return {
      user: AUTH.user,
      dashType: AUTH.user.type,
      backend: CONFIG.BACKEND_URL,
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
      agencyInfo: null,
      data_categories: [],
      lineGraphData: null,
      filteredDataWeekly: [],
      filteredMonthlyData: [],
      filteredDailyData: [],
      filteredYearlyData: [],
      filteredYears: [],
      filterYear: null,
      yearsFilteration: null,
      lineGraphLastIndex: null,
      lineGraphStartIndex: null,
      reachLast: false,
      filter: null,
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
        },
        {
          name: 'pui',
          data: []
        },
        {
          name: 'pum',
          data: []
        },
        {
          name: 'lsi',
          data: []
        },
        {
          name: 'tested',
          data: []
        },
        {
          name: 'rofw',
          data: []
        },
        {
          name: 'symptoms',
          data: []
        }
      ]
    }
  },
  props: {
  },
  computed: {
    returnLineGraphData(){
      return this.lineGraphData
    },
    returnFilterYear(){
      return this.filteredYears
    },
    returnSeries(){
      switch(this.filter){
        case 'daily':
          return this.filteredDailyData.length
        case 'weekly':
          return this.filteredDataWeekly.length
        case 'monthly':
          return this.filteredMonthlyData.length
        case 'yearly':
          return this.filteredYearlyData.length
      }
    }
  },
  components: {
    'trend': require('modules/places/Trend_v2.vue'),
    QrcodeVue,
    'data-summary': require('modules/dashboard/Summary.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'business': require('./Business.vue'),
    'user': require('./User.vue'),
    'empty': require('./Empty.vue'),
    topAffectedPlaces
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
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
    retrieve(){
      let parameter = {
        id: this.user.userID
      }
      // For HIDING and SHOWING the VIEW MORE BUTTON //
      let forShowMore = {
        status: 'positive'
      }
      // Ends Here //
      this.APIRequest('tracings/status', parameter).then(response => {
        this.status = response.data
      })
      // For HIDING and SHOWING the VIEW MORE BUTTON //
      this.APIRequest('tracing_places/places', forShowMore).then(response => {
        if(response.data.length > 0){
          this.disableShowMore = true
        }
      })
      // Ends Here //
      let infoCondition = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }
      this.APIRequest('merchants/retrieve', infoCondition).then(response => {
        if(response.data.length > 0) {
          this.agencyInfo = response.data[0]
        }
      })
      let forLineGraphCondition = {
        condition: [{
          value: this.user.location.code + '%',
          clause: 'like',
          column: 'locality'
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', forLineGraphCondition).then(response => {
        $('#loading').css({display: 'none'})
        // patients/retrieve 07-22-30
        /*
          let infoCondition = {
            condition: [{
              value: this.user.location.code + '%',
              clause: 'like',
              column: 'locality'
            }]
          }
        */
        this.filterYear = new Date().getFullYear()
        this.lineGraphData = response.data
        this.filter = 'daily'
        this.lineGraphLastIndex = 0
        this.lineGraphStartIndex = 0
        let filteredData = new Filtering(response.data, this.filterYear)
        filteredData.filteredDaily()
        filteredData.filteredWeekly()
        filteredData.filteredMonthly()
        filteredData.filteredYearly()
        this.filteredDailyData = filteredData.getDailyData()
        this.filteredDataWeekly = filteredData.getWeeklyData()
        this.filteredMonthlyData = filteredData.getMonthlyData()
        this.filteredYearlyData = filteredData.getYearlyData()
        this.filteredYears = filteredData.getYears()
        switch(this.filter){
          case 'daily':
            this.lineGraphLastIndex = (this.filteredDailyData.length >= 7) ? 7 : this.filteredDailyData.length
            this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDailyData)
            break
          case 'weekly':
            this.lineGraphLastIndex = (this.filteredDataWeekly.length >= 7) ? 7 : this.filteredDataWeekly.length
            this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDataWeekly)
        }
      })
    },
    dataNext(){
      if(this.filter === 'daily'){
        if(this.lineGraphLastIndex + 7 < this.filteredDailyData.length){
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex += 7
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDailyData)
        }else if(this.lineGraphLastIndex === this.filteredDailyData.length){
          this.reachLast = true
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDailyData)
        }else if(this.lineGraphLastIndex + 7 >= this.filteredDailyData.length){
          this.reachLast = true
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex = (this.filteredDailyData.length - this.lineGraphLastIndex) + this.lineGraphLastIndex
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDailyData)
        }
      }else if(this.filter === 'weekly'){
        if(this.lineGraphLastIndex + 7 < this.filteredDataWeekly.length){
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex += 7
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDataWeekly)
        }else if(this.lineGraphLastIndex === this.filteredDataWeekly.length){
          this.reachLast = true
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDataWeekly)
        }else if(this.lineGraphLastIndex + 7 >= this.filteredDataWeekly.length){
          this.reachLast = true
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex = (this.filteredDataWeekly.length - this.lineGraphLastIndex) + this.lineGraphLastIndex
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDataWeekly)
        }
      }else if(this.filter === 'monthly'){
        if(this.lineGraphLastIndex + 12 < this.filteredMonthlyData.length){
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex += 12
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredMonthlyData)
        }else if(this.lineGraphLastIndex === this.filteredMonthlyData.length){
          this.reachLast = true
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredMonthlyData)
        }else if(this.lineGraphLastIndex + 12 >= this.filteredMonthlyData.length){
          this.reachLast = true
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex = (this.filteredMonthlyData.length - this.lineGraphLastIndex) + this.lineGraphLastIndex
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredMonthlyData)
        }
      }else if(this.filter === 'yearly'){
        if(this.lineGraphLastIndex + 12 < this.filteredYearlyData.length){
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex += 12
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredYearlyData)
        }else if(this.lineGraphLastIndex === this.filteredYearlyData.length){
          this.reachLast = true
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredYearlyData)
        }else if(this.lineGraphLastIndex + 12 >= this.filteredYearlyData.length){
          this.reachLast = true
          this.lineGraphStartIndex = this.lineGraphLastIndex
          this.lineGraphLastIndex = (this.filteredYearlyData.length - this.lineGraphLastIndex) + this.lineGraphLastIndex
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredYearlyData)
        }
      }
    },
    dataPrevious(){
      if(this.filter === 'daily'){
        if(this.lineGraphStartIndex > 0 && (this.lineGraphLastIndex - 7 > 0)){
          if(this.reachLast){
            this.reachLast = false
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 7
          }else{
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 7
          }
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDailyData)
        }
      }else if(this.filter === 'weekly'){
        if(this.lineGraphStartIndex > 0 && (this.lineGraphLastIndex - 7 > 0)){
          if(this.reachLast){
            this.reachLast = false
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 7
          }else{
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 7
          }
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDataWeekly)
        }
      }else if(this.filter === 'monthly'){
        if(this.lineGraphStartIndex > 0 && (this.lineGraphLastIndex - 12 > 0)){
          if(this.reachLast){
            this.reachLast = false
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 12
          }else{
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 12
          }
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredMonthlyData)
        }
      }else if(this.filter === 'yearly'){
        if(this.lineGraphStartIndex > 0 && (this.lineGraphLastIndex - 12 > 0)){
          if(this.reachLast){
            this.reachLast = false
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 12
          }else{
            this.lineGraphLastIndex = this.lineGraphStartIndex
            this.lineGraphStartIndex -= 12
          }
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredYearlyData)
        }
      }
    },
    filterby(){
      this.lineGraphLastIndex = 0
      this.lineGraphStartIndex = 0
      switch(this.filter){
        case 'daily':
          this.lineGraphLastIndex = (this.filteredDailyData.length >= 7) ? 7 : this.filteredDailyData.length
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDailyData)
          break
        case 'weekly':
          this.lineGraphLastIndex = (this.filteredDataWeekly.length >= 7) ? 7 : this.filteredDataWeekly.length
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredDataWeekly)
          break
        case 'monthly':
          this.lineGraphLastIndex = (this.filteredMonthlyData.length >= 12) ? 12 : this.filteredMonthlyData.length
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredMonthlyData)
          break
        case 'yearly':
          this.lineGraphLastIndex = (this.filteredYearlyData.length >= 12) ? 12 : this.filteredYearlyData.length
          this.initializeLineGraph(this.lineGraphStartIndex, this.lineGraphLastIndex, this.filteredYearlyData)
          break
      }
    },
    yearFilter(){
      let newFilter = new Filtering(this.lineGraphData, this.filterYear)
      newFilter.filteredDaily()
      newFilter.filteredWeekly()
      newFilter.filteredMonthly()
      newFilter.filteredYearly()
      this.filteredDailyData = newFilter.getDailyData()
      this.filteredDataWeekly = newFilter.getWeeklyData()
      this.filteredMonthlyData = newFilter.getMonthlyData()
      this.filteredYearlyData = newFilter.getYearlyData()
      this.filteredYears = newFilter.getYears()
      this.filterby()
    },
    initializeLineGraph(start, stopper, datas){
      let series = [[], [], [], [], [], [], [], [], []]
      let dataCategory = []
      for(var i = start; i < stopper; ++i){
        if(datas[i].date !== null || datas[i].date !== undefined){
          switch(this.filter){
            case 'daily':
              dataCategory.push(this.months[new Date(datas[i].date).getMonth()] + ' ' + new Date(datas[i].date).getDate())
              break
            case 'weekly':
              dataCategory.push('week ' + String(i + 1))
              break
            case 'monthly':
              dataCategory.push(this.months[new Date(datas[i].date).getMonth()])
              break
            case 'yearly':
              dataCategory.push(new Date(datas[i].date).getFullYear())
          }
        }
        if(datas[i].positive_size !== null || datas[i].positive_size !== undefined){
          series[0].push(datas[i].positive_size)
        }
        if(datas[i].recovered_size !== null || datas[i].recovered_size !== undefined){
          series[1].push(datas[i].recovered_size)
        }
        if(datas[i].death_size !== null || datas[i].death_size !== undefined){
          series[2].push(datas[i].death_size)
        }
        if(datas[i].pui !== null || datas[i].pui !== undefined){
          series[3].push(datas[i].pui)
        }
        if(datas[i].pum !== null || datas[i].pum !== undefined){
          series[4].push(datas[i].pum)
        }
        if(datas[i].lsi !== null || datas[i].lsi !== undefined){
          series[5].push(datas[i].lsi)
        }
        if(datas[i].tested !== null || datas[i].tested !== undefined){
          series[6].push(datas[i].tested)
        }
        if(datas[i].rofw !== null || datas[i].rofw !== undefined){
          series[7].push(datas[i].rofw)
        }
        if(datas[i].symptoms !== null || datas[i].symptoms !== undefined){
          series[8].push(datas[i].symptoms)
        }
      }
      this.options = {
        chart: {
          id: 'topAffected'
        },
        title: {
          text: (this.user.type === 'AGENCY_BRGY') ? 'TOP AFFECTED SITIOS' : 'TOP AFFECTED BRGY',
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: '#007be0'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        markers: {
          size: [4, 4, 4, 4, 4],
          hover: {
            sizeOffset: 5
          }
        },
        xaxis: {
          categories: dataCategory
        },
        colors: ['#dc3545', '#28a745', '#343a40', '#005b96', '#ffc107', '#081cff', '#08ffd2', '#ff5a08', '#7d0202']
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
        },
        {
          name: 'pui',
          data: series[3]
        },
        {
          name: 'pum',
          data: series[4]
        },
        {
          name: 'lsi',
          data: series[5]
        },
        {
          name: 'tested',
          data: series[6]
        },
        {
          name: 'rofw',
          data: series[7]
        },
        {
          name: 'symptoms',
          data: series[8]
        }
      ]
      dataCategory = []
      series = [[], [], [], [], [], [], [], [], []]
    }
  }
}
</script>
