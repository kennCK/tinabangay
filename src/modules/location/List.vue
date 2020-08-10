<template>
  <div class="holder w-100">
    <div class="nav-buttons row">
      <button class="btn btn-primary" data-toggle="modal" data-target="#add_location" @click="googleProperty.placeholder = 'Type Location', locality = null">Add</button>
    </div>
    <div class="row w-100 m-0" v-if="data !== null">
      <div class="card card-half" v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;" >
        <div class="qr-code-container p-2">
          <div class="qr-code" v-if="item.code !== null" @click="setCode('https://birds-eye.org/#/location/' + item.code)">
            <button @click="redirect('location/' + item.code)">redirect nimal</button>
            <QrcodeVue :value="'https://birds-eye.org/#/location/' + item.code" :size="100"></QrcodeVue>
          </div>
          <div class="details" :class="item.code === null ? 'ml-4' : ''">
            <label class="card-title">
              {{item.route}}
            </label>
            <label class="card-title">
              {{item.locality ? item.locality : ''}} {{item.country === null ? '' : item.location ? `,  ${item.country}` : item.country}}
            </label>
          </div> 
          <button class="btn btn-primary mr-2" @click="selectedBranch = item, googleProperty.placeholder = item.locality, locality = null" type="button" data-toggle="modal" data-target="#add_location"><i class="fa fa-edit"></i></button>
          <button class="btn btn-secondary" @click="selectedBranch = item" type="button" data-toggle="modal" data-target="#delete"><i class="fa fa-trash"></i></button>
        </div>

      </div>
    </div>


    <showQrCode ref="imageView"></showQrCode>
    <empty v-if="data === null" :title="'No locations added!'" :action="'Add a location.'" :icon="'far fa-building'" :iconColor="'text-danger'"></empty>

    <!--MODAL FOR ADDING LOCATION-->
    <div class="modal fade right" id="add_location" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{selectedBranch ? `Edit: ${selectedBranch.route}` : 'Add Location'}}</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('add_location')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <div class="form-group mb-5">
              <label for="code">Location Name</label>
              <input type="text" name="branch" id="branch" class="form-control" placeholder="Enter Branch Name" :value="selectedBranch ? selectedBranch.route : ''">
            </div>
            <div class="form-group">
              <label>Barangay</label>
              <div class="text-danger font-weight-bold" v-if="!selectedBranch || (selectedBranch.brgy_info === null && locality === null)">Please <span class="link" data-toggle="modal" data-target="#addAddress">assign a barangay</span> to this branch.</div>
              <div v-else-if="selectedBranch.brgy_info && !locality">
                <span class="font-weight-bold text-danger">({{selectedBranch.brgy_info.code}})</span> {{selectedBranch.brgy_info.route}}, {{selectedBranch.brgy_info.locality}} <span class="link" data-toggle="modal" data-target="#addAddress"><i class="fa fa-edit"></i></span>
              </div>
              <div v-else>
                <span class="font-weight-bold text-danger">({{locality.code}})</span> {{locality.route}}, {{locality.locality}} <span class="link" data-toggle="modal" data-target="#addAddress"><i class="fa fa-edit"></i></span>
              </div>
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
                <div class="col font-weight-bold">Please move the red pin first.</div>
                <div class="col">
                  <span class="text-danger font-weight-bold">Pin Location</span><br> Pins your current location.
                </div>
                <div class="col">
                  <span class="text-primary font-weight-bold">Use Location</span> <br>Selects the location of the pin to use.
                </div>
              </div>
              <pin-location @onSelect="getLocation($event)" :property="{
                height: '400px'
              }"></pin-location>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('add_location')">Cancel</button>
            <button class="btn btn-primary" @click="addNew()">{{selectedBranch ? 'Update' : 'Submit'}}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- DELETE BRANCH MODAL -->
    <div class="modal fade right" id="delete" tabindex="-1" role="dialog" aria-labelledby="deleteHeader"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteheader">Delete Branch</h5>
            <button type="button" class="close" aria-label="Close" data-dismiss="modal" @click="selectedBranch = null">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            Are you sure you want to delete this branch?
          </div>
          <div class="modal-footer">
            <button class="btn btn-dark" data-dismiss="modal" @click="selectedBranch = null">Cancel</button>
            <button class="btn btn-secondary" data-dismiss="modal" @click="deleteBranch()">Delete</button>
          </div>
        </div>
      </div>
    </div>

     <!-- Assign Address Modal -->
    <div class="modal fade" id="addAddress" tabindex="-1" role="dialog" aria-labelledby="addAddressHeader" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAddressHeader">Assign Address</h5>
            <button type="button" class="close" @click="hideModal('addAddress')" aria-label="Close">
              <span aria-hidden="true" class="text-primary">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label style="width: 100%; float: left;">Filter</label>
              <input type="text" class="form-control form-control-custom" v-model="searchBrgy" placeholder="Town, Lungsod or locality" style="width: 80%; float:left; margin-right: 5px;" />
              <button type="button" class="btn btn-primary pull-right" @click="search('brgy')">Search</button>
            </div>
            <table class="table table-borderless table-responsive">
              <thead>
                <th>Address</th>
                <th>Action</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in brgys" :key="index">
                  <td>
                    <label>
                      <b class="text-danger">({{item.code}})</b>{{' ' + item.route + ', ' + item.locality + ', ' + item.country}}
                    </label>
                  </td>
                  <td>
                    <button class="btn btn-primary" @click="assignAddress(item)">{{ (selectedBranch && selectedBranch.brgy_info !== null) || locality === null ? 'Update' : 'Assign'}}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="hideModal('addAddress')">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .modal-backdrop {
  background-color: transparent;
  }

  .modal {
    background: rgba(0,0,0,0.6);
  }
</style>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}
.badge{
  margin-left: 5px;
}
.card-title{
  width: 100%;
  float: left;
}

.holder{
  float: left;
  margin-top: 25px;
}

.nav-buttons {
  width: 100%;
  padding: 0px .5%;
  margin: 0px 0px .5rem 0px;
  justify-content: flex-end;
}

.qr-code-container {
  display: flex;
}

.qr-code:hover{
  cursor: pointer;
  background: $primary;
}

.details{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  padding: 0 15px;
}

.form-control{
  height: 45px !important;
  margin-bottom: 25px;
}

.bg-black{
  background: #000000 !important;
  color: #ffffff !important;
  border: 0px;
}
input[type="number"] {
  -webkit-appearance: textfield;
    -moz-appearance: textfield;
          appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
}
.number-input {
    margin-bottom: 1rem;
    margin-left: 50rem;
    margin-right: 4rem;
    float: right;
}
.number-input button {
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0;
  position: relative;
}
.number-input button:before,
.number-input button:after {
  display: inline-block;
  position: absolute;
  content: '';
  height: 2px;
  transform: translate(-50%, -50%);
}
.number-input button.plus:after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.number-input input[type=number] {
  text-align: center;
}


.md-number-input.number-input {
  width: 11.8rem;
}
.md-number-input.number-input button {
  outline: none;
  width: 3rem;
  height: 2rem;
  padding-top: .8rem;
}
.md-number-input.number-input button.minus {
  padding-left: 8px;
}
.md-number-input.number-input button.plus {
  padding-left: 2px;
}
.md-number-input.number-input button:before,
.md-number-input.number-input button:after {
  width: 1rem;
  background-color: #212121;
}
.md-number-input.number-input input[type=number] {
  max-width: 5rem;
  padding: .5rem;
  border: solid #ddd;
  border-width: 0 2px;
  font-size: 2rem;
  height: 3rem;
  font-weight: bold;
  outline: none;
}

.card.card-half {
  width: 49%;
  margin: .5%;
}

.link {
  color: $success;
  cursor: pointer;
}

@media (max-width: 767px) {
  .card.card-half {
    width: 100%;
    margin: 0;
  }
  .nav-buttons {
    padding: 0px;
  }
}

@media not all and (min-resolution:.001dpcm)
{ @supports (-webkit-appearance:none) and (stroke-color:transparent) {
  .number-input.md-number-input.safari_only button:before, 
  .number-input.md-number-input.safari_only button:after {
    margin-top: -.6rem;
  }
}}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import QrcodeVue from 'qrcode.vue'
import showQrCode from './ShowMore.vue'
export default {
  mounted(){
    if(this.user.type !== 'ADMIN' && this.user.type !== 'BUSINESS' && this.user.type !== 'AGENCY_BRGY' && this.user.type !== 'AGENCY_GOV'){
      ROUTER.push('/dashboard')
    }
    this.retrieve()
  },
  data(){
    return {
      selectedBranch: null,
      customLocation: false,
      location: null,
      locality: null,
      searchBrgy: null,
      common: COMMON,
      user: AUTH.user,
      brgys: null,
      data: null,
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
      }
    }
  },
  components: {
    'google-autocomplete-location': require('src/components/increment/generic/location/GooglePlacesAutoComplete.vue'),
    'pin-location': require('components/increment/generic/map/PinLocation.vue'),
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    Pager,
    QrcodeVue,
    showQrCode
  },
  methods: {
    redirect(parameter){
      this.$router.push(`/${parameter}`)
    },
    setCode(code){
      this.$refs.imageView.setCode(code)
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('locations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    getLocation(event) {

      let location = {
        locality: event.locality,
        region: event.region,
        country: event.country,
        latitude: event.latitude,
        longitude: event.longitude
      }
      this.location = location
    },
    hideModal(id) {
      if(id === 'add_location') {
        $('#add_location .error-msg').remove()
        this.$refs.location.onCancel()
        this.location = null
        $('#branch').val('')
        this.selectedBranch = null
      } else if(id === 'addAddress') {
        this.brgys = null
        this.searchBrgy = null
      }

      $(`#${id}`).modal('hide')
    },
    assignAddress(brgy) {
      this.locality = brgy
      $('#addAddress').modal('hide')
    },
    addNew() {
      console.log('adding new')
      let branchName = $('#branch').val()
      let error = false
      $('#add_location .error-msg').remove()
      if(!this.selectedBranch && this.location === null) {
        $('<div>', {
          class: 'form-group text-danger error-msg',
          html: '<b>Uh oh!</b> Location is required.'
        }).prependTo('#add_location .modal-body')

        error = true
      }

      if(branchName === null || branchName === '') {
        $('<div>', {
          class: 'form-group text-danger error-msg',
          html: '<b>Uh oh!</b> Branch name is required.'
        }).prependTo('#add_location .modal-body')

        error = true
      }

      if((!this.selectedBranch && this.locality === null) || (this.selectedBranch && this.selectedBranch.assigned_code === null && this.locality === null)) {
        $('<div>', {
          class: 'form-group text-danger error-msg',
          html: '<b>Uh oh!</b> Please assign your branch to a barangay.'
        }).prependTo('#add_location .modal-body')

        error = true
      }

      if(!error && !this.selectedBranch) {
        this.location.route = branchName
        let par = this.location
        par.autogenerate = true
        par.account_id = this.user.userID
        par.assigned_code = this.locality.code

        $('#loading').css({display: 'block'})
        this.APIRequest('locations/create', par).then(response => {
          this.location = null
          this.locality = null
          $('#branch').val('')
          this.retrieve()
          this.hideModal('add_location')
        })
      } else if(!error && this.selectedBranch){
        let par = {}
        if(this.location) {
          this.location.route = branchName
          par = this.location
        }

        if(this.selectedBranch.route !== branchName){
          par.route = branchName
        }

        if(this.locality !== null) {
          par.assigned_code = this.locality.code
        }

        par.id = this.selectedBranch.id

        $('#loading').css({display: 'block'})
        this.APIRequest('locations/update', par).then(response => {
          this.location = null
          this.locality = null
          $('#branch').val('')
          this.retrieve()
          this.hideModal('add_location')
        })
      } else {
        console.log(this.selectedBranch)
      }
    },
    deleteBranch() {
      if(this.selectedBranch !== null) {
        let par = {
          id: this.selectedBranch.id
        }

        $('#loading').css({display: 'block'})
        this.APIRequest('locations/delete', par).then(response => {
          $('#loading').css({display: 'none'})
          this.selectedBranch = null
          this.retrieve()
        })
      }
    },
    search(type){
      if(type === 'brgy') {
        this.brgys = null
        if(this.searchBrgy === null || this.searchBrgy === ''){
          return
        }
        let parameter = {
          condition: [{
            value: this.searchBrgy + '%',
            clause: 'like',
            column: 'locality'
          }],
          sort: {
            route: 'asc'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('brgy_codes/retrieve', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data.length > 0){
            this.brgys = response.data
          }else{
            this.brgys = []
          }
        })
      } else {
        this.branches = null
        if(this.branch === null || this.searchBrgy === '') {
          return
        }

        let parameter = {
          condition: [{
            value: this.branch + '%',
            clause: 'like',
            column: 'route'
          }, {
            value: this.user.userID,
            clause: '=',
            column: 'account_id'
          }],
          sort: {
            route: 'asc'
          }
        }

        $('#loading').css({display: 'block'})
        this.APIRequest('locations/retrieve', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data.length > 0) {
            this.branches = response.data
          } else {
            this.branches = []
          }
        })
      }
    }
  }
}
</script>
