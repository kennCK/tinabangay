<template>
  <div class="ledger-summary-container">
    <basic-filter 
      v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']"></basic-filter>
    
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      />
    <button class="btn btn-primary pull-right mr-3 ml-3" style="margin: .5% 0;" @click="showModal('new')">New Barangay</button>
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead class="bg-primary">
        <tr>
          <th scope="col">Route</th>
          <th scope="col">Locality</th>
          <th scope="col">Region</th>
          <th scope="col">UACS</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.route}}</td>
          <td>{{item.locality}}</td>
          <td>{{item.region}}</td>
          <td>{{item.code}}</td>
          <td>
            <button class="btn btn-warning" @click="editBarangay(item.id)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No barangays available!'" :action="'Keep growing.'"></empty>

    <!--MODAL FOR ADDING ADDRESS-->
    <div class="modal fade right" id="add_location" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Address</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('add_location')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <div class="form-group mb-5">
              <label for="code">UACS</label>
              <input type="text" name="code" id="code" class="form-control" placeholder="Enter Barangay Code">
            </div>
            <div v-if="customLocation === false">
              <div class="row mb-3 justify-content-end mx-0">
                <button class="btn btn-primary" @click="customLocation = true">Use Custom Location</button>
              </div>
              <div class="form-group">
                <label for="location">Set Address</label>
                <google-autocomplete-location
                  :property="googleProperty"
                  :id="'location'"
                  ref="location"
                  @onFinish="getLocation($event)"
                >
                </google-autocomplete-location>
              </div>
            </div>
            <div v-if="customLocation === true">
              <div class="row mb-3 justify-content-end mx-0">
                <button class="btn btn-primary" @click="customLocation = false">Use Google Autocomplete</button>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <span class="text-danger font-weight-bold">Pin Location</span> uses your current geolocation.
                </div>
                <div class="col">
                  <span class="text-primary font-weight-bold">Use Location</span> uses the location of the pin on the map.
                </div>
              </div>
              <pin-location @onSelect="getLocation($event)" :property="{
                height: '400px'
              }"></pin-location>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('add_location')">Cancel</button>
            <button class="btn btn-primary" @click="addNew()">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <!--MODAL FOR EDITING ADDRESS-->
    <div class="modal fade right" id="edit_barangay" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Address</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('edit_barangay')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <div class="form-group">
              <label for="code">Locality</label>
              <input v-model="editBarangayInfo.locality" type="text" class="form-control" placeholder="Enter Locality">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('edit_barangay')">Cancel</button>
            <button class="btn btn-primary" @click="editBarangay(null, true)">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

.ledger-summary-container{
  width: 100%;
  float: left;
  height: auto;
  margin-bottom: 100px;
  margin-top: 25px;
}

.ledger-summary-container-header{
  width: 100%;
  float: left;
  height: 70px;
  border: solid 1px #ddd;
}
.summary-container-item{
  width: 100%;
  float: left;
  border-radius: 5px;
  min-height: 50px;
  overflow-y: hidden;
  border: solid 1px #ddd;
  margin-top: 10px;
  padding-left: 10px;
}
.summary-container-item .header{
  width: 100%;
  float: left;
  height: 50px;
  line-height: 50px;
  color: #555;
}
.summary-container-item .body{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  padding-right: 10px;
}

td i {
  padding-right: 0px !important;
  padding-left: 0px !important;
}

@media (max-width: 992px){
  .ledger-summary-container{
    width: 100%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default{
  mounted(){
    $('#loading').css({display: 'block'})
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      selecteditem: null,
      config: CONFIG,
      customLocation: false,
      googleProperty: {
        style: {
          height: '45px !important'
        },
        GOOGLE_API_KEY: CONFIG.GOOGLE_API_KEY,
        results: {
          style: {
          }
        },
        placeholder: 'Type Location'
      },
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Username ascending',
          payload: 'username',
          payload_value: 'asc'
        }, {
          title: 'Username descending',
          payload: 'username',
          payload_value: 'desc'
        }, {
          title: 'Email ascending',
          payload: 'email',
          payload_value: 'asc'
        }, {
          title: 'Email descending',
          payload: 'email',
          payload_value: 'desc'
        }, {
          title: 'Type ascending',
          payload: 'status',
          payload_value: 'asc'
        }, {
          title: 'Type descending',
          payload: 'status',
          payload_value: 'desc'
        }, {
          title: 'Created ascending',
          payload: 'created_at',
          payload_value: 'asc'
        }, {
          title: 'Created descending',
          payload: 'created_at',
          payload_value: 'desc'
        }]
      }],
      filter: null,
      sort: null,
      editTypeIndex: null,
      newAccountType: null,
      selectedAccount: null,
      limit: 10,
      activePage: 1,
      numPages: null,
      location: null,
      editBarangayInfo: {
        id: null,
        locality: ''
      }
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'google-autocomplete-location': require('src/components/increment/generic/location/GooglePlacesAutoComplete.vue'),
    'pin-location': require('components/increment/generic/map/PinLocation.vue'),
    Pager
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    retrieve(sort, filter){
      if(sort !== null){
        this.sort = sort
      }
      if(filter !== null){
        this.filter = filter
      }
      if(sort === null && this.sort !== null){
        sort = this.sort
      }
      if(filter === null && this.filter !== null){
        filter = this.filter
      }
      let parameter = {
        condition: [{
          value: filter.value + '%',
          column: filter.column,
          clause: 'like'
        }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? this.activePage - 1 : this.activePage
      }
      this.APIRequest('brgy_codes/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = null
          this.numPages = null
        }
      })
    },
    showModal(type) {
      if(type === 'new') {
        $('#add_location').modal('show')
      }
    },
    hideModal(id) {
      if (id === 'edit_barangay') {
        $(`#${id}`).modal('hide')
        $('#edit_barangay #error').remove()
        this.editBarangayInfo.id = null
        this.editBarangayInfo.locality = ''
        return
      }
      $(`#${id}`).modal('hide')
      this.$refs.location.onCancel()
      this.location = null
    },
    getLocation(event) {
      let location = {
        route: event.route,
        locality: event.locality,
        region: event.region,
        country: event.country,
        latitude: event.latitude,
        longitude: event.longitude
      }
      this.location = location
    },
    addNew() {
      let code = $('#add_location #code').val()
      if(code === null || code === undefined || code === '') {
        if($('#add_location #error').length === 0) {
          $('<span>', {
            id: 'error',
            class: 'text-danger mt-3',
            html: '<b>Oops!</b> UACS Code is required.'
          }).appendTo('#add_location .modal-body')
        } else {
          $('#add_location #error').html('<b>Oops!</b> UACS Code is required.')
        }
      } else if(this.location === null) {
        if($('#add_location #error').length === 0) {
          $('<span>', {
            id: 'error',
            class: 'text-danger mt-3',
            html: '<b>Oops!</b> Location is required.'
          }).appendTo('#add_location .modal-body')
        } else {
          $('#add_location #error').html('<b>Oops!</b> Location is required.')
        }
      } else {
        let params = this.location
        params.code = code
        $('#loading').css({display: 'block'})
        this.APIRequest('brgy_codes/create', params).then(response => {
          this.location = null
          this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
          this.hideModal('add_location')
        })
      }
    },
    editBarangay(selectedId, onSubmit = false) {
      if (!onSubmit) {
        $('#edit_barangay').modal('show')
        this.editBarangayInfo.id = selectedId
        return
      }
      const { id, locality } = this.editBarangayInfo
      if (id === null || locality.trim() === '') {
        $('<span>', {
          id: 'error',
          class: 'text-danger',
          html: '<b>Oops!</b> Empty locality.'
        }).appendTo('#edit_barangay .modal-body')
        return
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('brgy_codes/update', { id, locality }).then(response => {
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
        this.hideModal('edit_barangay')
      })
    }
  }
}
</script>
