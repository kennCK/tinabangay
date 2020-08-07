<template>
  <div class="holder">
    <div class="form-group" v-if="user.location !== null">
      <label>Assigned address: <b class="text-primary">{{user.location.route + ',' + user.location.locality + ',' + user.location.region + ',' + user.location.country}}</b></label>
    </div>
    <div class="form-group">
      <select class="form-control" v-model="selectedOption" @change="chageOption()">
        <option v-for="(item, index) in options" :key="index" :value="item.value">{{item.title}}</option>
      </select>
      <select class="form-control" v-model="selectedLocationIndex" v-if="locations !== null && selectedOption === 'customers'">
        <option v-for="(item, index) in locations" :key="index" :value="index">{{item.route + ',' + item.locality + ', ' + item.country}}</option>
      </select>
      <select class="form-control" v-model="selectedWeek" @change="getDate()" v-if="selectedOption === 'customers'">
        <option v-for="(item, index) in 8" :key="index" :value="item">Last {{item > 1 ? item + ' Weeks' : item + ' Week'}}</option>
      </select>
      <button class="btn btn-custom btn-primary" @click="retrieve()" v-if="selectedOption === 'customers' && locations !== null">Search</button>
      <button class="btn btn-custom btn-primary" @click="retrieve()" v-if="selectedOption === 'linked_accounts'">Search</button>
    </div>

    <!-- Results for Visited Places -->
    <table v-if="data.length > 0 && selectedOption === 'linked_accounts'" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>
          Employee
        </td>
        <td>Status 
          <i class="fa fa-chevron-down pull-right" v-if="statusFlag === false" @click="manageSort('status_label', 'desc', true)"></i>
          <i class="fa fa-chevron-up pull-right" v-if="statusFlag === true" @click="manageSort('status_label', 'asc', false)"></i>
        </td>
        <td>Actions</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedData" :key="index">
          <td><i class="fa fa-user" :class="{'text-primary': item.account.information && item.account.information.cellular_number !== null}" :alt="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" :title="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" v-if="item.account_id !== null"></i>
            <b class="text-danger">{{item.account.information && item.account.information.first_name && item.account.information.last_name ? item.account.information.first_name + ' ' + item.account.information.last_name : item.account.username}}</b>
          </td>
          <td>
            <span class="badge text-uppercase" :class="{'badge-danger': item.status === 'positive', 'badge-warning': item.status === 'pum', 'badge-primary': item.status === 'pui', 'badge-black': item.status === 'death', 'badge-success': item.status === 'recovered' || item.status === 'negative', 'badge-gray': item.status === 'symptoms', 'badge-info': item.status === 'tested'}">{{item.status_label}}</span>
          </td>
          <td>
            <button @click="showModal('view_health_dec', item)" class="btn btn-primary">View Health Declaration</button>
          </td>
        </tr>
      </tbody>
    </table>


    <!-- Results for Visited Places -->
    <table v-if="data.length > 0 && selectedOption === 'customers'" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>
          Date Posted
        </td>
        <td>Date Visited</td>
        <td>
          Customer Name
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
            {{item.created_at_human}}
          </td>
          <td>
            {{item.date_human}}
          </td>
          <td><i class="fa fa-user" :class="{'text-primary': item.account.information && item.account.information.cellular_number !== null}" :alt="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" :title="item.account.information && item.account.information.cellular_number !== null ? item.account.information.cellular_number : null" v-if="item.account_id !== null"></i>
            <b class="text-danger">{{item.account.information && item.account.information.first_name && item.account.information.last_name ? item.account.information.first_name + ' ' + item.account.information.last_name : item.account.username}}</b>
          </td>
          <td>
            <span class="badge text-uppercase" :class="{'badge-danger': item.status === 'positive', 'badge-warning': item.status === 'pum', 'badge-primary': item.status === 'pui', 'badge-black': item.status === 'death', 'badge-success': item.status === 'recovered' || item.status === 'negative', 'badge-gray': item.status === 'symptoms'}">{{item.status_label}}</span>
          </td>
          <td>
            <button @click="showModal('view_health_dec', item)" class="btn btn-primary">View Health Declaration</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!--MODAL FOR VIEWING HEALTH DECLARATION -->
    <div class="modal fade" id="view_health_dec" tabindex="-1" role="dialog" aria-labelledby="healthDecModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="healthDecModal">Health Declaration</h5>
            <button type="button" class="close" @click="hideModal('view_health_dec')" aria-label="Close">
              <span aria-hidden="true" class="text-primary">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="healthDecList.length > 0" class="w-100">
              <table class="table table-responsive">
                <thead class="bg-primary">
                  <td>Type</td>
                  <td>Submitted</td>
                  <td>Status</td>
                  <td>Label</td>
                  <td>Action</td>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in healthDecList" :key="index">
                    <td>{{ item.format.replace('_', ' ').toUpperCase() }}</td>
                    <td>{{ getRelativeTime(item.submitted_on) }}</td>
                    <td :class="[{
                        'text-success': item.status === 'clear' || item.status === null,
                        'text-danger': item.status !== 'clear' && item.status !== null
                      }]"
                    >
                      <b>{{ item.status === null ? 'clear' : item.status }}</b>
                    </td>
                    <td :class="[{
                        'text-success': item.status === 'clear' || item.status === null,
                        'text-danger': item.status !== 'clear' && item.status !== null
                      }]"
                    >
                      <b>{{ item.statusLabel === null ? 'clear' : item.status }}</b>
                    </td>
                    <td>
                      <button @click="redirect(`/form/${item.code}`)" class="btn btn-primary">View Form</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="w-100">
              <center>
                <h3>No Health Declaration Records</h3>
              </center>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="hideModal('view_health_dec')">Cancel</button>
          </div>
        </div>
      </div>
    </div>

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

.btn-custom{
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

#view_health_dec {
  overflow: auto !important
}
#view_health_dec .modal-dialog {
  max-width: 90% !important;
}
</style>
<script>
import moment from 'moment'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
export default {
  mounted(){
    if(this.user.type !== 'BUSINESS' && this.user.type !== 'ADMIN'){
      ROUTER.push('/dashboard')
    }
    this.getDate()
    this.getLocation()
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
        title: 'Linked Accounts',
        value: 'linked_accounts'
      }, {
        title: 'Customers',
        value: 'customers'
      }],
      selectedOption: 'linked_accounts',
      data: [],
      healthDecList: [],
      selectedCountry: 'Philippines',
      selectedRegion: '',
      selectedLocality: '',
      selectedWeek: 2,
      selectedDays: null,
      placesLocationFlag: false,
      statusFlag: false,
      sortedData: [],
      selectedRadius: 0.1,
      typeFlag: false,
      selectedLocationIndex: null,
      locations: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  methods: {
    getRelativeTime(time) {
      return moment(time).fromNow()
    },
    getLocation(){
      const parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }, {
          value: null,
          column: 'payload',
          clause: '='
        }],
        sort: {
          route: 'asc'
        }
      }
      this.APIRequest('locations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.selectedLocationIndex = 0
          this.locations = response.data
        }else{
          this.selectedLocationIndex = null
          this.locations = null
        }
      })
    },
    redirect(parameter){
      this.hideModal('view_health_dec')
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
      // if(this.user.location === null){
      //   return
      // }
      if(this.selectedOption === 'linked_accounts'){
        let parameter = {
          condition: [{
            value: this.user.userID,
            clause: '=',
            column: 'owner'
          }]
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('linked_accounts/retrieve_tracing', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.data = response.data
          this.sortedData = response.data
        })
      }else if(this.selectedOption === 'customers'){
        let parameter = {
          condition: [{
            clause: '=',
            column: 'latitude',
            value: this.locations[this.selectedLocationIndex].latitude
          }, {
            clause: '=',
            column: 'longitude',
            value: this.locations[this.selectedLocationIndex].longitude
          }, {
            clause: '>=',
            column: 'date',
            value: this.selectedDays
          }],
          sort: {
            created_at: 'desc'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('visited_places/retrieve_customers', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.data = response.data
          this.sortedData = response.data
        })
      }
    },
    isValidForm(data) {
      const parsedContent = JSON.parse(data)
      if (parsedContent === null || typeof parsedContent === 'undefined') return false

      const { format, status, statusLabel } = parsedContent
      return (
        (format !== null && typeof format !== 'undefined') &&
        (typeof status !== 'undefined') &&
        (typeof statusLabel !== 'undefined')
      )
    },
    showModal(id, item = null) {
      if (item) {
        $('#loading').css({display: 'block'})
        this.healthDecList = []

        const parameter = {
          condition: [{
            clause: '=',
            column: 'account_id',
            value: item.account_id
          }, {
            clause: '!=',
            column: 'updated_at',
            value: null
          }],
          sort: {
            updated_at: 'desc'
          }
        }
        this.APIRequest('health_declarations/retrieve', parameter).then(response => {
          if (response.data.length > 0) {
            response.data.map(data => {
              if (data.updated_at !== null) {
                if ((data.content !== null && typeof data.content !== 'undefined') && this.isValidForm(data.content)) {
                  const parsedContent = JSON.parse(data.content)
                  const details = {
                    code: data.code,
                    format: parsedContent.format,
                    status: parsedContent.status,
                    statusLabel: parsedContent.statusLabel,
                    submitted_on: data.updated_at_human
                  }
                  this.healthDecList.push(details)
                }
              }
            })
            $(`#${id}`).modal('show')
          } else {
            $(`#${id}`).modal('show')
          }
          $('#loading').css({display: 'none'})
        })
      }
    },
    hideModal(id) {
      $(`#${id}`).modal('hide')
    }
  }
}
</script>
