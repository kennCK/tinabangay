<template>
  <div class="holder">
    <div class="form-group" v-if="user.location !== null">
      <label>Assigned address: <b class="text-primary">{{user.location.route + ',' + user.location.locality + ',' + user.location.region + ',' + user.location.country}}</b></label>
    </div>
    <div class="form-group">
      <select class="form-control" v-model="selectedOption" @change="chageOption()">
        <option v-for="(item, index) in options" :key="index" :value="item.value">{{item.title}}</option>
      </select>
      <select class="form-control" v-model="selectedWeek" @change="getDate()">
        <option v-for="(item, index) in 8" :key="index" :value="item">Last {{item > 1 ? item + ' Weeks' : item + ' Week'}}</option>
      </select>
      <select class="form-control" v-model="selectedCountry">
        <option v-for="(item, index) in country" :key="index">{{item.title}}</option>
      </select>
      <input type="text" v-model="selectedRegion" class="form-control" placeholder="Region">
      <input type="text" v-model="selectedLocality" class="form-control" placeholder="Town or City">
      <select class="form-control" v-if="selectedOption === 'visited_places'" v-model="selectedRadius">
        <option value="0.05">50 Meters radius</option>
        <option v-for="(item, index) in 10" :key="index" :value="item / 10">{{100 * item}} Meters radius</option>
      </select>
      <button class="btn btn-primary" @click="retrieve()">Search</button>
    </div>
    <div class="form-group">
      <button class="btn btn-primary" v-if="selectedOption === 'visited_places' && data.length > 0"  @click="$refs.mapModal.showModal()">VIEW ON MAP</button>
    </div>


    <!-- Results for Visited Places -->
    <table v-if="data.length > 0 && selectedOption === 'visited_places'" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>Date</td>
        <td>
          Location
          <i class="fa fa-chevron-down pull-right" v-if="placesLocationFlag === false" @click="manageSort('location', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="placesLocationFlag === true" @click="manageSort('location', 'asc', false)"></i>
        </td>
        <td>Status 
          <i class="fa fa-chevron-down pull-right" v-if="statusFlag === false" @click="manageSort('status_label', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="statusFlag === true" @click="manageSort('status_label', 'asc', false)"></i>
        </td>
        <td>Actions</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedData" :key="index">
          <td>
            {{item.date_human}}
          </td>
          <td><i class="fa fa-user" :class="{'text-primary': item.account.information && item.account.information.cellular_number !== null}" :alt="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" :title="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" v-if="item.account_id !== null"></i>
            <b class="text-danger">{{item.account && item.account.location ? '(' + item.account.location.code + ')': ''}}</b>
            {{item.route + ', ' + item.locality + ', ' + item.country}}
          </td>
          <td>
            <span class="badge text-uppercase" :class="{'badge-danger': item.status === 'positive', 'badge-warning': item.status === 'pum', 'badge-primary': item.status === 'pui', 'badge-black': item.status === 'death', 'badge-success': item.status === 'recovered' || item.status === 'negative', 'badge-gray': item.status === 'symptoms'}">{{item.status_label}}</span>

            <span class="badge text-uppercase" :class="{'badge-danger': item.remarks.toLowerCase().includes('admitted') === true || item.remarks.toLowerCase().includes('not admitted') === true, 'badge-black': item.remarks.toLowerCase().includes('death') === true, 'badge-success': item.remarks.toLowerCase().includes('negative') === true || item.remarks.toLowerCase().includes('recovered') === true}" v-if="item.remarks !== null">{{item.remarks}}</span>
          </td>
          <td>
            <i class="fa fa-envelope text-primary action-link"></i>
          </td>
        </tr>
      </tbody>
    </table>


    <!-- Results for transporation used -->
    <table v-if="data.length > 0 && selectedOption === 'transportation_used'" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>Date</td>
        <td>
          Location
          <i class="fa fa-chevron-down pull-right" v-if="placesLocationFlag === false" @click="manageSort('location', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="placesLocationFlag === true" @click="manageSort('location', 'asc', false)"></i>
        </td>
        <td>
          Transportation
        </td>
        <td>Status 
          <i class="fa fa-chevron-down pull-right" v-if="statusFlag === false" @click="manageSort('status_label', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="statusFlag === true" @click="manageSort('status_label', 'asc', false)"></i></td>
        <td>Actions</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedData" :key="index">
          <td>
            {{item.created_at_human}}
          </td>
          <td><i class="fa fa-user" :class="{'text-primary': item.account.information && item.account.information.cellular_number !== null}" :alt="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" :title="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" v-if="item.account_id !== null"></i>
            <b class="text-danger">{{item.account.location ? '(' + item.account.location.code + ')' : ''}}</b>
            {{item.route + ', ' + item.locality + ', ' + item.country}}
          </td>
          <td>
            {{item.type + '-' + item.model + ':' + item.number}}
          </td>
          <td>
            <span class="badge text-uppercase" :class="{'badge-danger': item.status === 'positive', 'badge-warning': item.status === 'pum', 'badge-primary': item.status === 'pui', 'badge-black': item.status === 'death', 'badge-success': item.status === 'recovered' || item.status === 'negative'}">{{item.status_label}}</span>
          </td>
          <td>
            <i class="fa fa-envelope text-primary action-link"></i>
          </td>
        </tr>
      </tbody>
    </table>


    <!-- Results for temperature used -->
    <table v-if="data.length > 0 && selectedOption === 'temperature'" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>Date</td>
        <td>
          Location
          <i class="fa fa-chevron-down pull-right" v-if="placesLocationFlag === false" @click="manageSort('location', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="placesLocationFlag === true" @click="manageSort('location', 'asc', false)"></i>
        </td>
        <td>
          Transportation
        </td>
        <td>Actions</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedData" :key="index">
          <td>
            {{item.created_at_human}}
          </td>
          <td><i class="fa fa-user" :class="{'text-primary': item.account.information && item.account.information.cellular_number !== null}" :alt="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" :title="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" v-if="item.account_id !== null"></i> 
            <b class="text-danger">{{item.account.location ? '(' + item.account.location.code + ')' : ''}}</b>
            {{item.route + ', ' + item.locality + ', ' + item.country}}
          </td>
          <td>
            {{item.value + ' Degree Celsius'}}
          </td>
          <td>
            <i class="fa fa-envelope text-primary action-link"></i>
          </td>
        </tr>
      </tbody>
    </table>


    <!-- Results for temperature used -->
    <table v-if="data.length > 0 && selectedOption === 'symptoms'" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>Date</td>
        <td>
          Location
          <i class="fa fa-chevron-down pull-right" v-if="placesLocationFlag === false" @click="manageSort('location', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="placesLocationFlag === true" @click="manageSort('location', 'asc', false)"></i>
        </td>
        <td>
          Type

          <i class="fa fa-chevron-down pull-right" v-if="typeFlag === false" @click="manageSort('type', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="typeFlag === true" @click="manageSort('type', 'asc', false)"></i></td>
        </td>
        <td>Remarks</td>
        <td>Actions</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedData" :key="index">
          <td>
            {{item.date_human}}
          </td>
          <td>
            <i class="fa fa-user" :class="{'text-primary': item.account.information && item.account.information.cellular_number !== null}" :alt="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" :title="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" v-if="item.account_id !== null"></i>
            <b class="text-danger">{{item.account.location ? '(' + item.account.location.code + ')' : ''}}</b>
            {{item.route + ', ' + item.locality + ', ' + item.country}}
          </td>
          <td class="text-uppercase">
            {{item.type}}
          </td>
          <td>
            {{item.remarks}}
          </td>
          <td>
            <i class="fa fa-envelope text-primary action-link"></i>
          </td>
        </tr>
      </tbody>
    </table>

    <empty v-if="data.length <= 0" :title="'No data available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <google-map-modal ref="mapModal" :place_data="data" v-if="data.length > 0 && selectedOption === 'visited_places'"></google-map-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.holder{
  margin-top: 25px;
}

.form-control{
  float: left !important;
  width: 15% !important;
  margin-right: 5px;
  height: 45px !important;
}

.btn{
  height: 45px !important;
}
.bg-primary, .badge-primary{
  background: $primary !important;
  color: $white !important;
}

.badge-black{
  background: #000;
  color: $white;
}

.text-primary{
  color: $primary !important;
}

.badge-gray{
  background: $gray !important;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
export default {
  mounted(){
    if(this.user.type !== 'AGENCY_DOH' && this.user.type !== 'AGENCY_GOV'){
      ROUTER.push('/dashboard')
    }
    this.getDate()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      country: [{
        title: 'Philippines',
        code: 'Philippines'
      }],
      locality: null,
      region: null,
      options: [{
        title: 'Visited Places',
        value: 'visited_places'
      }, {
        title: 'Transporation Used',
        value: 'transportation_used'
      }, {
        title: 'Temperature',
        value: 'temperature'
      }, {
        title: 'Symptoms',
        value: 'symptoms'
      }],
      selectedOption: 'visited_places',
      data: [],
      selectedCountry: 'Philippines',
      selectedRegion: '',
      selectedLocality: '',
      selectedWeek: 2,
      selectedDays: null,
      placesLocationFlag: false,
      statusFlag: false,
      sortedData: [],
      selectedRadius: 0.1,
      typeFlag: false
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    getDate(){
      let moment = require('moment')
      this.selectedDays = moment().subtract(this.selectedWeek * 7, 'days').format('YYYY-MM-DD')
    },
    chageOption(){
      this.sortedData = []
      this.data = []
    },
    manageSort(column, order, flag){
      if(column === 'location'){
        this.placesLocationFlag = flag
      }
      if(column === 'status_label'){
        this.statusFlag = flag
      }
      this.sortedData = this.data.sort((a, b) => {
        if(order === 'asc'){
          return a[column] < b[column] ? 1 : -1
        }else{
          return a[column] > b[column] ? 1 : -1
        }
      })
    },
    retrieve(){
      if(this.selectedRegion === '' && this.selectedLocality === ''){
        return
      }
      if(this.selectedOption === 'visited_places'){
        let parameter = {
          condition: [{
            clause: '=',
            column: 'country',
            value: this.selectedCountry
          }, {
            clause: 'like',
            column: 'region',
            value: '%' + this.selectedRegion + '%'
          }, {
            clause: 'like',
            column: 'locality',
            value: '%' + this.selectedLocality + '%'
          }, {
            clause: '>=',
            column: 'date',
            value: this.selectedDays
          }],
          radius: parseFloat(this.selectedRadius),
          sort: {
            route: 'asc'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('visited_places/retrieve_tracing', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.data = response.data
          this.sortedData = response.data
        })
      }else if(this.selectedOption === 'transportation_used'){
        let parameter = {
          country: '%' + this.selectedCountry + '%',
          region: '%' + this.selectedRegion + '%',
          locality: '%' + this.selectedLocality + '%',
          sort: {
            column: 'created_at',
            value: 'asc'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('transportations/retrieve_tracing', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.data = response.data
          this.sortedData = response.data
        })
      }else if(this.selectedOption === 'temperature'){
        let parameter = {
          country: '%' + this.selectedCountry + '%',
          region: '%' + this.selectedRegion + '%',
          locality: '%' + this.selectedLocality + '%',
          temperature: 35,
          sort: {
            column: 'created_at',
            value: 'asc'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('temperatures/retrieve_tracing', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.data = response.data
          this.sortedData = response.data
        })
      }else if(this.selectedOption === 'symptoms'){
        let parameter = {
          country: '%' + this.selectedCountry + '%',
          region: '%' + this.selectedRegion + '%',
          locality: '%' + this.selectedLocality + '%',
          sort: {
            column: 'date',
            value: 'asc'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('symptoms/retrieve_tracing', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.data = response.data
          this.sortedData = response.data
        })
      }
    }
  }
}
</script>
