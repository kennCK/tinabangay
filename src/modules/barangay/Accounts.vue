<template>
  <div class="ledger-summary-container">
    <button class="btn btn-warning pull-right" style="margin: .5% 0;" @click="importFlag = 3">Import Visited Places</button>
    <button class="btn btn-danger pull-right mr-3" style="margin: .5% 0;" @click="importFlag = 2">Import Symptoms</button>
    <button class="btn btn-success pull-right mr-3" style="margin: .5% 0;" @click="importFlag = 1">Import Accounts</button>
    <button class="btn btn-dark pull-right mr-3" style="margin: .5% 0;" @click="showModal('edit_clearance')">Edit Clearance Layout</button>
    <button class="btn btn-primary pull-right mr-3" style="margin: .5% 0;" @click="showModal('account')">New Account</button>
    <button class="btn btn-primary pull-left mr-3" style="margin: .5% 0;" @click="showBrgyCodes()">Barangay Codes</button>
    <div class="form-group" v-if="importFlag !== 0">
      <label style="width: 100%;">Using google sheet</label>
      <input type="text" class="form-control" style="width: 30% !important; float: left;" v-model="googleId" placeholder="Google Sheet Id">
      <input type="text" class="form-control" style="width: 30% !important; float: left; margin-right: 5px; margin-left: 5px;" placeholder="sheet number" v-model="googleSheetNumber">
      <button v-if="importFlag === 1" class="btn btn-success" @click="importData('accounts')">Import Accounts</button>
      <button v-if="importFlag === 2" class="btn btn-success" @click="importData('symptoms')">Import Symptoms</button>
      <button v-if="importFlag === 3" class="btn btn-success" @click="importData('visited_places')">Import Visited Places</button>
    </div>
    <div v-if="errorMessage !== null" :class="['alert', errorMessage === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
      {{ errorMessage ? errorMessage === 'success' ? 'Import successfully.' : errorMessage : 'Error'}}
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
          <td>Code</td>
          <td>Username</td>
          <td>Email</td>
          <td>Export</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.account.created_at}}</td>
          <td>{{item.account.location ? item.account.location.code : 'No Code'}}</td>
          <td>
            <label class="text-primary"><i class="fa fa-map-marker text-primary" @click="getVisited(item.account.id)" title="Visited Places" alt="Visited Places" ></i> {{item.account.username}}</label>
          </td>
          <td>{{item.account.email}}</td>
          <td>
            <button class="btn btn-primary" v-if="item.account_id === user.userID && item.member !== user.userID" @click="exportUser(item.account)">Export User</button>
            <button class="btn btn-info" @click="exportClearance(item.account)">Export Clearance</button>
          </td>
          <td>
            <button class="btn btn-dark" @click="showModal('address', item.account.id)">Set Barangay</button>
            <button class="btn btn-success" @click="showModal('place', item.account.id)">Add Visited Place</button>
            <button class="btn btn-warning" v-if="item.account_id === user.userID" @click="showModal('user', item.account.id)">Edit User</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!--MODAL FOR BRGY CODES-->
    <div class="modal fade right" id="brgy_codes" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ !brgy_codes ? 'No' : ''}} Available Barangay Codes</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('brgy_codes')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4" v-if="brgy_codes !== null">
            <table class="table table-responsive table-bordered"  id="myTable2">
              <thead class="bg-primary">
                <td>Code</td>
                <td>Locality</td>
                <td>Country</td>
                <td>Region</td>
              </thead>
              <tbody>
                <tr v-for="(item, index) in brgy_codes" :key="index">
                  <td>{{item.code}}</td>
                  <td>{{item.locality}}</td>
                  <td>{{item.country}}</td>
                  <td>{{item.region}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

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

    <!--MODAL FOR EDITING CLEARANCE LAYOUT-->
    <div class="modal fade right" id="edit_clearance" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Clearance Layout</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('edit_clearance')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <h5>Barangay Logo</h5>
            <div class="row mb-3 mx-0 align-items-start">
              <div class="col-5">
                <img :src="brgy_logo ? brgy_logo : require('src/assets/img/no_image.png')" alt="Barangay Logo" class="img-fluid">
              </div>
              <div class="col-3" v-if="user.location">
                <button class="btn btn-primary" @click="showModal('browseImagesModal')">Upload Logo</button>
              </div>
              <div class="col-7" v-if="!user.location">
                <span class="text-danger">Please join a barangay before uploading a barangay logo</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('edit_clearance')">Cancel</button>
            <button class="btn btn-primary" @click="addLoc()">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <images></images>

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
            <div class="row mb-3 mx-0">
              <div class="col">
                <b>Current Barangay: </b> {{brgyCodeParams.currentAdd ? brgyCodeParams.currentAdd : 'No address'}}
              </div>
            </div>
            <div class="form-group mt-2">
              <div id="err" />
              <label for="location">Set Address</label>
              <input v-model="brgyCodeParams.brgyCode" type="text" class="form-control" placeholder="Enter barangay code" required>
              <small class="form-text text-muted">Please refer to the available barangay codes above the search bar</small>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('add_location')">Cancel</button>
            <button class="btn btn-primary" @click="addLoc()">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <!--MODAL FOR BRGY CLEARANCE ERROR-->
    <div class="modal fade right" id="no_code_clearance" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Oops!</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('no_code_clearance')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            That user is not assigned to a barangay yet. Please assign a barangay before exporting a clearance.
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="hideModal('no_code_clearance')">Okay</button>
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
<style>
.option {
  cursor: pointer;
}

.option:hover {
  background: rgba(0,0,0,0.2)
}
</style>
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
    if(this.user.type !== 'ADMIN' && this.user.type !== 'AGENCY_BRGY'){
      ROUTER.push('/dashboard')
    }
    $('#loading').css({display: 'block'})
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    // if (AUTH.user.location) {
    this.retrieveBrgyCodes({locality: 'asc'})
    // }
    const {vfs} = vfsFonts.pdfMake
    PdfPrinter.vfs = vfs
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      brgy_codes: null,
      brgy_logo: null,
      withLogo: true,
      auth: AUTH,
      selecteditem: null,
      brgy: null,
      modalProperty: ModalProperty,
      placeProperty: PlacesProperty,
      profileProperty: ProfilesProperty,
      config: CONFIG,
      location: null,
      places: null,
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
      errorMessage: null, // error message for all import module
      brgyCodeParams: {
        brgyCode: null,
        currentAdd: null,
        currentCode: null
      },
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
    'images': require('components/increment/generic/image/BrowseModal.vue'),
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
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        },
        {
          value: this.user.userID,
          column: 'member',
          clause: '!='
        }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? this.activePage - 1 : this.activePage
      }

      if(this.user.location && this.user.location.code) {
        let brgyImgPar = {
          condition: [{
            value: this.user.location.code,
            column: 'code',
            clause: '='
          }]
        }
        this.APIRequest('brgy_codes/retrieve', brgyImgPar).then(response => {
          if(response.data.length > 0) {
            this.brgy_logo = CONFIG.BACKEND_URL + response.data[0].url
          }
        })

        let param = {
          condition: [{
            value: this.user.location.code,
            column: 'code',
            clause: '='
          }]
        }
        this.APIRequest('locations/retrieve', param).then(res => {
          this.APIRequest('sub_accounts/retrieve', parameter).then(response => {
            if(response.data.length > 0){
              this.data = response.data
              this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
            }else{
              this.data = null
              this.numPages = null
            }
            if(res.data.length > 0) {
              res.data.map(loc => {
                let flag
                this.data.map(acc => {
                  if(acc.account_id === loc.account_id) {
                    flag = true
                  }
                })
                if(!flag) {
                  let par = {
                    condition: [{
                      value: loc.account_id,
                      column: 'account_id',
                      clause: '='
                    }]
                  }
                  $('#loading').css({display: 'block'})
                  this.APIRequest('sub_accounts/retrieve', par).then(resp => {
                    if(resp.data.length > 0) {
                      resp.data.map(newAcc => {
                        this.data.push(newAcc)
                      })
                    }
                    $('#loading').css({display: 'none'})
                  })
                }
              })
            }
          })
        })
      } else {
        this.APIRequest('sub_accounts/retrieve', parameter).then(response => {
          if(response.data.length > 0){
            this.data = response.data
            this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          }else{
            this.data = null
            this.numPages = null
          }
          $('#loading').css({display: 'none'})
        })
      }

    },
    manageImageUrl(imageURL) {
      let par = {
        condition: [{
          value: this.user.location.code,
          column: 'code',
          clause: '='
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('brgy_codes/retrieve', par).then(response => {
        if(response.data.length > 0) {
          let id = response.data[0].id
          let param = {
            id: id,
            url: imageURL
          }
          this.APIRequest('brgy_codes/update', param).then(res => {
            $('#loading').css({display: 'none'})
            this.brgy_logo = CONFIG.BACKEND_URL + imageURL
          })
        } else {
          $('#loading').css({display: 'none'})
        }
      })
    },
    retrieveBrgyCodes(sort){
      let parameter = {
        sort
      }
      this.APIRequest('brgy_codes/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.brgy_codes = response.data
        }else{
          this.brgy_codes = null
        }
      })

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
        $('#add_location input').val('')
        $('#loading').css({display: 'block'})
        this.APIRequest('locations/retrieve', params).then(response => {
          if(response.data.length > 0) {
            const {
              code,
              route,
              locality,
              region,
              country
            } = response.data[0]
            this.brgyCodeParams.currentCode = code
            this.brgyCodeParams.currentAdd = `${code}, ${route}, ${locality}, ${region}, ${country}`
          } else {
            this.brgyCodeParams.currentCode = null
            this.brgyCodeParams.currentAdd = null
          }
          $('#loading').css({display: 'none'})
          $('#add_location').modal('show')
        })
      } else {
        $(`#${type}`).modal('show')
      }
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
        this.location = null
        this.selecteditem = null
      }
    },
    addLoc() {
      $('#loading').css({display: 'block'})
      if (this.brgyCodeParams.brgyCode === null || this.brgyCodeParams.brgyCode.trim() === '') {
        $('#add_location #err #error').remove()
        $('#add_location #err').append(
          '<div id="error" class="alert alert-danger"><b>Oops!</b> Please set a barangay code first.</div>'
        )
        this.brgyCodeParams.brgyCode = null
        $('#loading').css({display: 'none'})
        return
      }
      if (this.brgyCodeParams.brgyCode === this.brgyCodeParams.currentCode) {
        $('#add_location #err #error').remove()
        $('#add_location #err').append(
          `<div id="error" class="alert alert-warning">The code: ${this.brgyCodeParams.brgyCode} is already set to this user.</div>`
        )
        this.brgyCodeParams.brgyCode = null
        $('#loading').css({display: 'none'})
        return
      }
      this.APIRequest('customs/set_address', {params: this.brgyCodeParams, accountId: this.selecteditem}).then(response => {
        const { invalidCode } = response
        if (invalidCode) {
          $('#loading').css({display: 'none'})
          $('#add_location #err #error').remove()
          $('#add_location #err').append(
            `<div id="error" class="alert alert-danger">
              Invalid barangay code: <b>${this.brgyCodeParams.brgyCode}</b>.
              Please refer to the available barangay codes.
            </div>`
          )
        } else {
          this.brgyCodeParams.brgyCode = null
          this.hideModal('add_location')
          this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
        }
      })
    },
    getBrgyLogo() {

    },
    exportClearance(user) {
      $('#loading').css({display: 'block'})
      if(user.location === null) {
        $('#loading').css({display: 'none'})
        this.showModal('no_code_clearance')
      } else {
        let par = {
          condition: [{
            value: this.user.userID,
            column: 'account_id',
            clause: '='
          }]
        }
        this.APIRequest('account_informations/retrieve', par).then(response => {
          if(response.data.length > 0) {
            let data = response.data[0]
            let brgyImg = this.brgy_logo
            let image = require('assets/img/logo.png')
            let brgy = user.location
            let xhr = new XMLHttpRequest()
            xhr.open('GET', image)
            xhr.responseType = 'blob'
            xhr.onload = function() {
              let reader = new FileReader()
              reader.onloadend = function() {
                let cont = [
                  ' ',
                  ' ',
                  {
                    text: 'CLEARANCE REPORT',
                    bold: true,
                    fontSize: 20,
                    alignment: 'center'
                  },
                  ' ',
                  {
                    text: 'To whom it may concern:',
                    fontSize: 14
                  },
                  ' ',
                  'This is to certify that the following individual is clear from any contact. Please see the given details below',
                  ' ',
                  {
                    text: user.username,
                    fontSize: 15,
                    bold: true,
                    alignment: 'center'
                  },
                  ' ',
                  {
                    qr: user.code,
                    alignment: 'center'
                  },
                  ' ',
                  ' ',
                  {
                    text: `${data.first_name !== null && data.last_name !== null ? `${data.first_name.toUpperCase()} ${data.last_name.toUpperCase()}` : ''}`,
                    italics: true,
                    bold: true,
                    decoration: 'underline'
                  },
                  'BARANGAY OFFICIAL',
                  `${brgy.route}, ${brgy.locality}, ${brgy.region}`,
                  ' ',
                  ' ',
                  `EXPORTED ON: ${moment().format('MMMM DD, YYYY :: hh:mm:ss A')}`
                ]
                let pdf = {
                  content: [
                    {
                      alignment: 'left',
                      columns: [
                        {
                          image: 'birdseyeLogo',
                          width: 50
                        },
                        [
                          {
                            text: 'BIRDSEYE',
                            bold: true,
                            style: 'header'
                          },
                          {
                            text: 'www.birds-eye.org',
                            style: 'header',
                            decoration: 'underline'
                          },
                          {
                            text: [
                              {
                                text: 'FB: ',
                                bold: true
                              },
                              ' @birdseyeph'
                            ],
                            style: 'header'
                          }
                        ]
                      ]
                    }],
                  images: {
                    birdseyeLogo: `${reader.result}`
                  },
                  styles: {
                    header: {
                      marginLeft: 10,
                      color: 'blue',
                      fontSize: 12
                    }
                  }
                }
                if(brgyImg !== null && brgyImg !== undefined) {
                  fetch(brgyImg)
                  .then(res => {
                    return res.blob()
                  })
                  .then(blob => {
                    let read = new FileReader()
                    read.onloadend = function() {
                      pdf.images.brgyLogo = `${read.result}`
                      pdf.content.push({
                        image: 'brgyLogo',
                        width: 120,
                        alignment: 'center'
                      })
                      cont.map(pdfContent => {
                        pdf.content.push(pdfContent)
                      })
                      $('#loading').css({display: 'none'})
                      PdfPrinter.createPdf(pdf).download(`${user.username}_clearance.pdf`)
                    }
                    read.readAsDataURL(blob)
                  })
                } else {
                  cont.map(pdfContent => {
                    pdf.content.push(pdfContent)
                  })
                  $('#loading').css({display: 'none'})
                  PdfPrinter.createPdf(pdf).download(`${user.username}_clearance.pdf`)
                }
              }
              reader.readAsDataURL(xhr.response)
            }
            xhr.send()
          } else {
            console.error('big error boi')
          }
        })
      }
    },
    showBrgyCodes(){
      $('#brgy_codes').modal('show')
    },
    validateSpreadSheet(template = null, headers = []){
      switch(template) {
        case 'accounts':
          if (headers.length >= 5) {
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
        case 'symptoms':
          if (headers.length >= 4) {
            return (
              headers[0].content.$t.trim() === 'Username' &&
              headers[1].content.$t.trim() === 'Type' &&
              headers[2].content.$t.trim() === 'Remarks' &&
              headers[3].content.$t.trim() === 'Date'
            )
          }
          return false
        case 'visited_places':
          if (headers.length >= 4) {
            return (
              headers[0].content.$t.trim() === 'Username' &&
              headers[1].content.$t.trim() === 'Brgy Code' &&
              headers[2].content.$t.trim() === 'Date' &&
              headers[3].content.$t.trim() === 'Time'
            )
          }
          return false
        default:
          return false
      }
    },
    importData(type = null){
      this.errorMessage = null
      if(this.googleId !== null && this.googleSheetNumber !== null){
        $('#loading').css({display: 'block'})
        $.ajax({
          url: `https://spreadsheets.google.com/feeds/cells/${this.googleId}/${this.googleSheetNumber}/public/values?alt=json`,
          type: 'GET',
          success: (data) => {
            $('#loading').css({display: 'none'})
            let { entry } = data.feed
            if (entry) {
              let parameter = {
                entries: []
              }
              let columnCount = 0
              let headers = []
              switch (type) {
                case 'accounts':
                  // column count for the template
                  columnCount = 6
                  headers = entry.splice(0, columnCount)
                  if (this.validateSpreadSheet('accounts', headers)) {
                    // get remaining data
                    const entries = [...entry]
                    if (entries.length % columnCount === 0) {
                      let rowCounter = 1
                      for (let i = 0; i < entries.length; i += columnCount) {
                        rowCounter++
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
                          this.errorMessage = `Invalid email on row ${rowCounter}`
                          return
                        }
                        if (account.username === '' || account.uacs_brgy_code === '' || account.first_name === '' || account.middle_name === '' || account.last_name === '') {
                          this.errorMessage = `Error on row ${rowCounter}`
                          return
                        }
                        // push valid data
                        parameter.entries.push(account)
                      }
                    } else {
                      this.errorMessage = 'There is an empty cell'
                      return
                    }
                  } else {
                    this.errorMessage = 'Please use the import accounts template for the spreadsheet'
                    return
                  }
                  // insert entries to db
                  $('#loading').css({display: 'block'})
                  this.APIRequest('customs/import_accounts', parameter).then(response => {
                    $('#loading').css({display: 'none'})
                    const { errorMessage } = response
                    if (errorMessage) {
                      this.errorMessage = errorMessage
                    } else {
                      this.errorMessage = 'success'
                    }
                    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
                  })
                  break
                case 'symptoms':
                  // column count for the template
                  columnCount = 4
                  headers = entry.splice(0, columnCount)
                  const symptomsArr = [...COMMON.symptoms]
                  if (this.validateSpreadSheet('symptoms', headers)) {
                    // get remaining data
                    const entries = [...entry]
                    if (entries.length % columnCount === 0) {
                      let rowCounter = 1
                      for (let i = 0; i < entries.length; i += columnCount) {
                        rowCounter++

                        const date = entries[i + 3].content.$t.trim()
                        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
                          this.errorMessage = `Please input a valid date in row ${rowCounter} and use YYYY-MM-DD format. E.g. 2020-12-31`
                          return
                        }

                        let symptoms = {
                          creator_id: this.user.userID,
                          username: entries[i].content.$t.trim(),
                          type: entries[i + 1].content.$t.trim(),
                          remarks: entries[i + 2].content.$t.trim(),
                          date
                        }
                        if (symptoms.username === '' || symptoms.type === '' || symptoms.remarks === '' || symptoms.date === '') {
                          this.errorMessage = `Error on row ${rowCounter}`
                          return
                        }
                        if (!symptomsArr.some(d => d.value === symptoms.type)) {
                          this.errorMessage = `Invalid symptom type '${symptoms.type}' at row ${rowCounter}`
                          return
                        }
                        // push valid data
                        parameter.entries.push(symptoms)
                      }
                    } else {
                      this.errorMessage = 'There is an empty cell'
                      return
                    }
                  } else {
                    this.errorMessage = 'Please use the import symptoms template for the spreadsheet'
                    return
                  }
                  // insert entries to db
                  $('#loading').css({display: 'block'})
                  this.APIRequest('customs/import_symptoms', parameter).then(response => {
                    $('#loading').css({display: 'none'})
                    const { errorMessage } = response
                    if(errorMessage){
                      this.errorMessage = errorMessage
                    } else {
                      this.errorMessage = 'success'
                    }
                  })
                  break
                case 'visited_places':
                  // column count for the template
                  columnCount = 4
                  headers = entry.splice(0, columnCount)
                  if (this.validateSpreadSheet('visited_places', headers)) {
                    // get remaining data
                    const entries = [...entry]
                    if (entries.length % columnCount === 0) {
                      let rowCounter = 1
                      for (let i = 0; i < entries.length; i += columnCount) {
                        rowCounter++

                        const date = entries[i + 2].content.$t.trim()
                        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
                          this.errorMessage = `Please input a valid date in row ${rowCounter} and use YYYY-MM-DD format. E.g. 2020-12-31`
                          return
                        }

                        const time = entries[i + 3].content.$t.trim()
                        if (!moment(time, 'HH:mm', true).isValid()) {
                          this.errorMessage = `Please input a valid time in row ${rowCounter} and use 24 hour format. E.g. 19:30`
                          return
                        }

                        let data = {
                          creator_id: this.user.userID,
                          username: entries[i].content.$t.trim(),
                          brgy_code: entries[i + 1].content.$t.trim(),
                          date,
                          time
                        }

                        if (data.username === '' || data.brgy_code === '' || data.date === '' || data.time === '') {
                          this.errorMessage = `Error on row ${rowCounter}`
                          return
                        }
                        // push valid data
                        parameter.entries.push(data)
                      }
                    } else {
                      this.errorMessage = 'There is an empty cell'
                      return
                    }
                  } else {
                    this.errorMessage = 'Please use the import visited places template for the spreadsheet'
                    return
                  }
                  // insert entries to db
                  $('#loading').css({display: 'block'})
                  this.APIRequest('customs/import_visited_places', parameter).then(response => {
                    $('#loading').css({display: 'none'})
                    const { errorMessage } = response
                    if(errorMessage){
                      this.errorMessage = errorMessage
                    } else {
                      this.errorMessage = 'success'
                    }
                  })
                  break
                default:
                  return
              }
            } else {
              this.errorMessage = 'Empty spreadsheet'
            }
          },
          error: (err) => {
            $('#loading').css({display: 'none'})
            const { responseText } = err
            if (responseText) {
              this.errorMessage = 'Error sheet number'
            } else {
              this.errorMessage = 'Error google sheet id'
            }
          }
        })
      }
    }
  }
}
</script>
