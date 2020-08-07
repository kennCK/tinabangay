<template>
    <div style="margin-bottom: 50px;">
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
                          <select class="form-control Affectedfilter" v-model="filterYear" @change="filterby">
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
                            <img v-if="agencyInfo.logo !== null"
                                :src="backend + agencyInfo.logo"
                                alt="logo"
                                class="AgencyLogo"
                            >
                            <i v-else class="fa fa-image AgencyLogo"></i>
                        </center>
                    </div>
                    <div class="card-body">
                        <p class="Binfo" v-if="agencyInfo.name !== null">{{agencyInfo.name}}</p>
                        <p class="Binfo" v-if="agencyInfo.address !== null">{{agencyInfo.address}}</p>
                        <p class="Binfo" v-if="agencyInfo.email !== null">{{agencyInfo.email}}</p>
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
.affectedSection{
  padding-right:0px;
}
.Affectedfilter{
  width:100%;
  padding-bottom:0px;
  padding-top:0px;
  font-size: 13px !important;
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
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import ROUTER from 'src/router'
import topAffectedPlaces from 'vue-apexcharts'
export default{
  mounted(){
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
      this.APIRequest('patients/retrieve', forLineGraphCondition).then(response => {
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
        this.filteringData(response.data)
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
      this.filteringData(this.lineGraphData)
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
    filteringData(data){
      let weeklyData = []
      let monthlyData = []
      let dailyData = []
      let YearlyData = []
      let databyMonths = [
        {'January': [], 'weeks': null},
        {'February': [], 'weeks': null},
        {'March': [], 'weeks': null},
        {'April': [], 'weeks': null},
        {'May': [], 'weeks': null},
        {'June': [], 'weeks': null},
        {'July': [], 'weeks': null},
        {'August': [], 'weeks': null},
        {'September': [], 'weeks': null},
        {'October': [], 'weeks': null},
        {'November': [], 'weeks': null},
        {'December': [], 'weeks': null}
      ]
      data.forEach(element => {
        element.places.forEach(affectedPlaces => {
          if(new Date(affectedPlaces.date).getFullYear() === this.filterYear){
            affectedPlaces['status'] = element.status
            databyMonths[new Date(affectedPlaces.date).getMonth()][this.months[new Date(affectedPlaces.date).getMonth()]].push(affectedPlaces)
            if(databyMonths[new Date(affectedPlaces.date).getMonth()]['weeks'] === null){
              let year = new Date(affectedPlaces.date).getFullYear()
              let month = new Date(affectedPlaces.date).getMonth()
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
              databyMonths[new Date(affectedPlaces.date).getMonth()]['weeks'] = weeks
            }
          }
        })
      })
      databyMonths.forEach((element, index) => {
        if(!element[this.months[index]].length < 1){
          /* code block for daily data */
          element[this.months[index]].forEach(values => {
            switch(values.status.toLowerCase()){
              case 'positive':
                values.positive_size = 1
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 0
                values.pui = 0
                values.tested = 0
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 0
                break
              case 'recovered':
                values.positive_size = 0
                values.recovered_size = 1
                values.death_size = 0
                values.pum = 0
                values.pui = 0
                values.tested = 0
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 0
                break
              case 'death':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 1
                values.pum = 0
                values.pui = 0
                values.tested = 0
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 0
                break
              case 'pum':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 1
                values.pui = 0
                values.tested = 0
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 0
                break
              case 'pui':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 0
                values.pui = 1
                values.tested = 0
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 0
                break
              case 'tested':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 0
                values.pui = 0
                values.tested = 1
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 0
                break
              case 'lsi':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 0
                values.pui = 0
                values.tested = 0
                values.lsi = 1
                values.symptoms = 0
                values.rofw = 0
                break
              case 'symptoms':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 0
                values.pui = 0
                values.tested = 0
                values.lsi = 0
                values.symptoms = 1
                values.rofw = 0
                break
              case 'rofw':
                values.positive_size = 0
                values.recovered_size = 0
                values.death_size = 0
                values.pum = 0
                values.pui = 0
                values.tested = 0
                values.lsi = 0
                values.symptoms = 0
                values.rofw = 1
                break
            }
            if(!this.filteredYears.includes(new Date(values.date).getFullYear())){
              this.filteredYears.push(new Date(values.date).getFullYear())
            }
            values.month = this.months[index]
            dailyData.push(values)
          })
          /* daily data ends here */
          /*
          *
          *
          */
          /* code block for weekly data */
          element['weeks'].forEach((within, x) => {
            let init = {
              positive_size: 0,
              recovered_size: 0,
              death_size: 0,
              pum: 0,
              pui: 0,
              lsi: 0,
              tested: 0,
              symptoms: 0,
              rofw: 0,
              month: this.months[index],
              weekNo: x + 1
            }
            let tracker = false
            for(var i = within.start; i < within.end + 1; i++){
              element[this.months[index]].forEach(cases => {
                if(new Date(cases.date).getDate() === i && new Date(cases.date).getMonth() === index){
                  switch(cases.status){
                    case 'positive':
                      init.positive_size++
                      break
                    case 'recovered':
                      init.recovered_size++
                      break
                    case 'death':
                      init.death_size++
                      break
                    case 'pui':
                      init.pui++
                      break
                    case 'pum':
                      init.pum++
                      break
                    case 'lsi':
                      init.lsi++
                      break
                    case 'tested':
                      init.tested++
                      break
                    case 'rofw':
                      init.rofw++
                      break
                    case 'symptoms':
                      init.symptoms++
                      break
                  }
                  tracker = true
                  init['date'] = cases.date
                }
              })
            }
            if (tracker) weeklyData.push(init)
          })
          /* weekly data ends here */
          /*
          *
          *
          */
          /* code block for montly data */
          let initMonthly = {
            positive_size: 0,
            recovered_size: 0,
            death_size: 0,
            pui: 0,
            pum: 0,
            lsi: 0,
            tested: 0,
            symptoms: 0,
            rofw: 0,
            month: this.months[index]
          }
          element[this.months[index]].forEach((daily, i) => {
            switch(daily.status){
              case 'positive':
                initMonthly.positive_size++
                break
              case 'recovered':
                initMonthly.recovered_size++
                break
              case 'death':
                initMonthly.death_size++
                break
              case 'pui':
                initMonthly.pui++
                break
              case 'pum':
                initMonthly.pum++
                break
              case 'lsi':
                initMonthly.lsi++
                break
              case 'tested':
                initMonthly.tested++
                break
              case 'rofw':
                initMonthly.rofw++
                break
              case 'symptoms':
                initMonthly.symptoms++
            }
            initMonthly.date = daily.date
          })
          monthlyData.push(initMonthly)
          /* monthly data ends here */
        }
      })
      /* code block for yearly data */
      let initYearly = [{
        positive_size: 0,
        recovered_size: 0,
        death_size: 0,
        pui: 0,
        pum: 0,
        lsi: 0,
        tested: 0,
        symptoms: 0,
        rofw: 0
      }]
      monthlyData.forEach(monthly => {
        initYearly[0].positive_size += monthly.positive_size
        initYearly[0].recovered_size += monthly.recovered_size
        initYearly[0].death_size += monthly.death_size
        initYearly[0].pui += monthly.pui
        initYearly[0].pum += monthly.pum
        initYearly[0].lsi += monthly.lsi
        initYearly[0].tested += monthly.tested
        initYearly[0].symptoms += monthly.symptoms
        initYearly[0].rofw += monthly.rofw
        initYearly[0].year = this.filterYear
      })
      this.filteredYearlyData = initYearly
      /* yearly data until here */
      /*
      *
      */
      this.filteredDataWeekly = weeklyData
      this.filteredMonthlyData = monthlyData
      this.filteredDailyData = dailyData
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
              dataCategory.push([String(datas[i].month), 'week ' + String(datas[i].weekNo)])
              break
            case 'monthly':
              dataCategory.push(datas[i].month)
              break
            case 'yearly':
              dataCategory.push(datas[i].year)
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
          text: ['AFFECTED BRGY'],
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
