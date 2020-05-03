<template>
  <div class="ledger-summary-container">
    <!-- <button class="btn btn-warning pull-right mr-3" style="margin: .5% 0;" @click="importFlag = 3">Import Visited Places</button>
    <button class="btn btn-danger pull-right mr-3" style="margin: .5% 0;" @click="importFlag = 2">Import Symptoms</button> -->
    <button class="btn btn-primary pull-right mr-3" style="margin: .5% 0;" @click="importFlag = 1">Import Accounts</button>
    <button class="btn btn-primary pull-right mr-3" style="margin: .5% 0;" @click="showModal('account')">New Account</button>
    <div class="form-group" v-if="importFlag !== 0">
      <label style="width: 100%;">Using google sheet</label>
      <input type="text" class="form-control" style="width: 30% !important; float: left;" v-model="googleId" placeholder="Google Sheet Id">
      <input type="text" class="form-control" style="width: 30% !important; float: left; margin-right: 5px; margin-left: 5px;" placeholder="sheet number" v-model="googleSheetNumber">
      <button v-if="importFlag === 1" class="btn btn-primary" @click="importData('accounts')">Import Accounts</button>
      <!-- <button v-if="importFlag === 2" class="btn btn-primary" @click="importData()">Import Symptoms</button>
      <button v-if="importFlag === 3" class="btn btn-primary" @click="importData()">Import Visited Places</button> -->
    </div>
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
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead class="bg-primary">
        <tr>
          <td>Date</td>
          <td>Username</td>
          <td>Email</td>
          <td>Export</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.account.created_at}}</td>
          <td>
            <label class="text-primary"><i class="fa fa-map-marker text-primary" @click="getVisited(item.account.id)" title="Visited Places" alt="Visited Places" ></i> {{item.account.username}}</label>
          </td>
          <td>{{item.account.email}}</td>
          <td><button class="btn btn-primary" @click="exportUser(item.account)">Export User</button></td>
          <td>
            <button class="btn btn-success" @click="showModal('place', item.account.id)">Add Visited Place</button>
            <button class="btn btn-warning" @click="showModal('user', item.account.id)">Edit User</button>
            <button class="btn btn-dark" @click="showModal('address', item.account.id)">Add Address</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!--MODAL FOR VISITED PATIENTS-->
    <div class="modal fade right" id="visited_places" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Visited Places</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('visited_places')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4" v-if="places !== null">
            <table class="table table-responsive table-bordered"  id="myTable2">
              <thead class="bg-primary">
                <td colspan="2">Date and Time Visited</td>
                <!-- <td>Time</td> -->
                <td>Establishment</td>
                <td>City</td>
                <td>Country</td>
              </thead>
              <tbody>
                <tr v-for="(item, index) in places" :key="index">
                  <td>{{item.date_human}}</td>
                  <td>{{item.time}}</td>
                  <td>{{item.route}}</td>
                  <td>{{item.locality}}</td>
                  <td>{{item.country}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

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
            <div v-if="currentAdd !== null">
              <div class="row mb-3 mx-0">
                <div class="col">
                  <b>Current Address: </b> {{currentAdd}}
                </div>
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
                <div class="col">
                  <span class="text-danger font-weight-bold">Pin Location</span> uses your current geolocation.
                </div>
                <div class="col">
                  <span class="text-primary font-weight-bold">Use Location</span> uses the location of the pin on the map.
                </div>
              </div>
              <pin-location @onSelect="getLocation" :property="{
                height: '400px'
              }"></pin-location>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('add_location')">Cancel</button>
            <button class="btn btn-primary" @click="addLoc()">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <empty v-if="data === null" :title="'No accounts available!'" :action="'Keep growing.'"></empty>
    <increment-modal :property="modalProperty"></increment-modal>
    <increment-modal ref="modal" :property="placeProperty"></increment-modal>
    <increment-modal ref="profile" :property="profileProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

.text-danger {
  color: $danger !important;
}

.text-primary {
  color: $primary !important;
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
import ModalProperty from 'src/modules/barangay/CreatePatientAccount.js'
import PlacesProperty from 'src/modules/barangay/AddPlace.js'
import ProfilesProperty from 'src/modules/barangay/Profile.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import PdfPrinter from 'pdfmake'
import vfsFonts from 'pdfmake/build/vfs_fonts'
import moment from 'moment'
export default{
  mounted(){
    $('#loading').css({display: 'block'})
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    const {vfs} = vfsFonts.pdfMake
    PdfPrinter.vfs = vfs
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      selecteditem: null,
      currentAdd: null,
      modalProperty: ModalProperty,
      placeProperty: PlacesProperty,
      profileProperty: ProfilesProperty,
      config: CONFIG,
      location: null,
      customLocation: false,
      places: null,
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
      importFlag: 0,
      googleId: null,
      googleSheetNumber: null,
      editTypeIndex: null,
      newAccountType: null,
      selectedAccount: null,
      limit: 10,
      activePage: 1,
      numPages: null,
      Password: {
        _pattern: /[a-zA-Z0-9_]/,
        _getRandomByte: function() {
          if(window.crypto && window.crypto.getRandomValues) {
            let result = new Uint8Array(1)
            window.crypto.getRandomValues(result)
            return result[0]
          } else if (window.msCrypto && window.msCrypto.getRandomValues) {
            let result = new Uint8Array(1)
            window.msCrypto.getRandomValues(result)
            return result[0]
          } else {
            return Math.floor(Math.random() * 256)
          }
        },
        generate: function(length) {
          return Array.apply(null, {'length': length})
            .map(function(){
              let result
              while(true) {
                result = String.fromCharCode(this._getRandomByte())
                if(this._pattern.test(result)) {
                  return result
                }
              }
            }, this)
            .join('')
        }
      }
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'google-autocomplete-location': require('src/components/increment/generic/location/GooglePlacesAutoComplete.vue'),
    'pin-location': require('components/increment/generic/map/PinLocation.vue'),
    Pager
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    async retrieve(sort, filter){
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
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        },
        {
          value: this.user.userID,
          column: 'member',
          clause: '!='
        }],
        sort: sort
        // limit: this.limit,
        // offset: (this.activePage > 0) ? this.activePage - 1 : this.activePage
      }
      await this.APIRequest('sub_accounts/retrieve', parameter).then(async response => {
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
    update(item){
      if(item.status !== 'NOT_VERIFIED'){
        let parameter = {
          id: item.id,
          status: 'GRANTED'
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('accounts/update_verification', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.retrieve(null, null)
        })
      }else{
        alert('Not Allowed!')
      }
    },
    showModal(type, id = null) {
      if(type === 'account') {
        this.modalProperty = {...ModalProperty}
        this.modalProperty.params.push({variable: 'account_id', value: this.user.userID})
        let inputs = this.modalProperty.inputs
        $('#createAccountModal label[for=password]+input').attr('readonly', '')
        $('#createAccountModal span#success').remove()
        inputs.map(input => {
          if(input.variable !== 'password') {
            input.value = null
          } else {
            input.value = this.Password.generate(16)
          }
        })
        $('#createAccountModal').modal('show')
      } else if(type === 'place'){
        this.placeProperty = {...PlacesProperty}
        this.$refs.modal.$refs.location[0].onCancel()
        this.placeProperty.params.map(par => {
          if(par.variable === 'account_id') {
            par.value = id
          }
        })
        let inputs = this.placeProperty.inputs
        inputs.map(input => {
          input.value = null
        })
        $('#createPlacesModal').modal('show')
      } else if (type === 'user') {
        let parameter = {
          condition: [{
            value: id,
            column: 'account_id',
            clause: '='
          }]
        }
        let inputs = this.profileProperty.inputs
        this.profileProperty.params.map(par => {
          par.value = id
        })
        $('#loading').css({'display': 'block'})
        this.APIRequest('account_informations/retrieve', parameter).then(response => {
          $('#loading').css({'display': 'none'})
          if(response.data.length > 0){
            let user = response.data[0]
            inputs.map(input => {
              input.value = user[input.variable]
            })
          }else{
            inputs.map(input => {
              input.value = null
            })
          }
          $('#updateUser').modal('show')
        })
      } else if (type === 'address') {
        this.selecteditem = id
        let params = {
          condition: [{
            value: id,
            column: 'account_id',
            clause: '='
          }]
        }
        $('#add_location #error').remove()
        $('#loading').css({display: 'block'})
        this.APIRequest('locations/retrieve', params).then(response => {
          if(response.data.length > 0) {
            let add = response.data[response.data.length - 1]
            console.log(add)
            if(add.locality === null) {
              if(add.longitude !== null) {
                this.currentAdd = `Custom Location (${add.longitude}, ${add.latitude})`
              } else {
                this.currentAdd = null
              }
            } else if (add.route === null){
              this.currentAdd = add.locality
            } else {
              this.currentAdd = `${add.route}, ${add.locality}`
            }
          } else {
            this.currentAdd = null
          }
          $('#loading').css({display: 'none'})
          $('#add_location').modal('show')
          console.log(this.currentAdd)
        })
      }
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
    exportUser(user){
      let newPassword = this.Password.generate(16)
      let parameter = {
        id: user.id,
        password: newPassword
      }
      let pdf = {
        content: [
          {
            text: [{
              text: 'Username: ',
              bold: true
            }, ` ${user.username}`]
          },
          {
            text: [{
              text: 'Password: ',
              bold: true
            }, ` ${newPassword}`]
          },
          {
            text: [{
              text: 'Email: ',
              bold: true
            }, ` ${user.email}`]
          },
          ' ',
          ' ',
          {qr: user.code},
          ' ',
          ' ',
          `EXPORTED ON: ${moment().format('MMMM DD, YYYY :: hh:mm:ss A')}`
        ]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/update_password', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data === true){
          AUTH.checkAuthentication(null)
          this.successMessagePassword = 'Successfully updated!'
          PdfPrinter.createPdf(pdf).download(`${user.username}.pdf`)
        }
      })
    },
    getVisited(id) {
      $('#loading').css({display: 'block'})
      let parameter = {
        condition: [{
          value: id,
          column: 'account_id',
          clause: '='
        }]
      }
      this.APIRequest('visited_places/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.places = response.data
        $('#visited_places').modal('show')
      })
    },
    hideModal(id) {
      $(`#${id}`).modal('hide')
      if(id === 'add_location') {
        this.$refs.location.onCancel()
        this.location = null
        this.selecteditem = null
      }
    },
    addLoc() {
      console.log('clickity')
      if(this.location === null) {
        if($('#add_location .modal-body #error').length === 0) {
          $('#add_location').prepend('<span id="error font-weight-bold">Oops! Please set a location first.</span>')
        }
      } else {
        let par = this.location
        par.account_id = this.selecteditem
        $('#loading').css({display: 'block'})
        this.APIRequest('locations/create', par).then(response => {
          $('#loading').css({display: 'none'})
          this.hideModal('add_location')
        })
      }
    },
    validateSpreadSheet(template = null, headers = []){
      switch(template) {
        case 'accounts':
          if (headers.length > 5) {
            return (
              headers[0].content.$t.trim() === 'Username' &&
              headers[1].content.$t.trim() === 'Email' &&
              headers[2].content.$t.trim() === 'UACS Brgy Code' &&
              headers[3].content.$t.trim() === 'First Name' &&
              headers[4].content.$t.trim() === 'Middle Name' &&
              headers[5].content.$t.trim() === 'Last Name'
            )
          }
          return false
        default:
          return false
      }
    },
    importData(type = null){
      if(this.googleId !== null && this.googleSheetNumber !== null){
        $.get('https://spreadsheets.google.com/feeds/cells/' + this.googleId + '/' + this.googleSheetNumber + '/public/values?alt=json', response => {
          let { entry } = response.feed
          if (entry) {
            let parameter = {
              entries: []
            }
            switch (type) {
              case 'accounts':
                if (this.validateSpreadSheet('accounts', entry)) {
                  // column count for the template
                  const columnCount = 6
                  // removing headers
                  entry.splice(0, columnCount)
                  const entries = [...entry]
                  if (entries.length % columnCount === 0) {
                    let counter = 0
                    for (let i = 0; i < entries.length; i += columnCount) {
                      counter++
                      let account = {
                        username: entries[i].content.$t.trim(),
                        email: entries[i + 1].content.$t.trim(),
                        password: this.Password.generate(16),
                        account_type: 'USER',
                        status: 'AGENCY_BRGY',
                        creator: this.user.userID,
                        uacs_brgy_code: entries[i + 2].content.$t.trim(),
                        first_name: entries[i + 3].content.$t.trim(),
                        middle_name: entries[i + 4].content.$t.trim(),
                        last_name: entries[i + 5].content.$t.trim()
                      }
                      if (AUTH.validateEmail(account.email) === false) {
                        alert(`Invalid email on row ${counter + 1}`)
                        return
                      }
                      if (account.username === '' || account.uacs_brgy_code === '' || account.first_name === '' || account.middle_name === '' || account.last_name === '') {
                        alert(`Error on row ${counter + 1}`)
                        return
                      }
                      // push valid data
                      parameter.entries.push(account)
                    }
                  } else {
                    alert('There is an empty cell.')
                    return
                  }
                } else {
                  alert('Please use the import accounts template for the spreadsheet')
                  return
                }
                // insert entries to db
                $('#loading').css({display: 'block'})
                this.APIRequest('custom/import_accounts', parameter).then(response => {
                  $('#loading').css({display: 'none'})
                  const { errorMessage } = response
                  if(errorMessage){
                    alert(errorMessage)
                  } else {
                    alert('Successful')
                  }
                  this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
                  console.log({ response })
                })
                break
              case 'symptoms':
                break
              case 'visited_place':
                break
              default:
                return
            }
          } else {
            alert('Empty spreadsheet.')
          }
        })
      }
    }
  }
}
</script>
