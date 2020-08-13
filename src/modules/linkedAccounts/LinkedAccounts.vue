<template>
 <div style="margin-top: 25px;">
    <div class="form-group" v-if="user.type !== 'USER'">
      <label>You can assign address to your employees for address status verification:</label>
    </div>
    <!-- <button class="btn pull-right mr-3" :class="[{'btn-success': !importFlag}, {'btn-danger': importFlag}]" style="margin: .5% 0;" @click="importFlag = !importFlag, googleId = googleSheetNumber = null">{{importFlag ? 'Cancel Import' : 'Import Accounts'}}</button>
    <button class="btn btn-primary pull-right mr-3" style="margin: .5% 0;" @click="show('accounts')">New Account</button>
    <div class="form-group" v-if="importFlag">
      <label style="width: 100%;">Using google sheet
        <small class="text-uppercase">(Please follow the <a href="https://i.imgur.com/V3GB8Hq.png" target="_blank" class="font-weight-bold">import template</a>)</small>
      </label>
      <input type="text" class="form-control" style="width: 30% !important; float: left;" v-model="googleId" placeholder="Google Sheet Id">
      <input type="text" class="form-control" style="width: 30% !important; float: left; margin-right: 5px; margin-left: 5px;" placeholder="sheet number" v-model="googleSheetNumber">
      <button class="btn btn-success" @click="importData()">Import Accounts</button>
    </div> -->
    <div v-if="errorMessage !== null" :class="['alert', errorMessage === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
      {{ errorMessage ? errorMessage === 'success' ? 'Import successfully.' : errorMessage : 'Error'}}
    </div>
    <table class="table table-bordered table-responsive" v-if="data !== null" >
        <thead class="bg-primary">
            <!-- <th scope="col">Owner</th> -->
            <th scope="col">Employee</th>
            <!-- <th scope="col">Name</th> -->
            <th scope="col">Date</th>
            <!-- <th scope="col" v-if="user.type !== 'USER'">
            User Type
            </th> -->
            <th scope="col" v-if="user.type !== 'USER'">Home Address</th>
            <th scope="col" v-if="user.type !== 'USER'">Assigned Branch</th>
            <th scope="col" v-if="user.type !== 'USER'">Assigned As</th>
            <th scope="col" v-if="user.type !== 'USER'">Actions</th>
        </thead>
        <tbody>
            <tr v-for="(item, index) in data" :key="index">
            <!-- <td class="text-uppercase">{{item.owner_account.username}}</td> -->
              <td>
                  <span v-if="item.account.information.first_name !== null">{{item.account.information.first_name}}</span> 
                  <span v-if="item.account.information.last_name !== null">{{item.account.information.last_name}}</span> 
                  <small class="text-uppercase font-weight-bold text-primary">({{item.account.username}})</small>
              </td>
              <td class="text-uppercase">{{item.created_at_human}}</td>
            <!-- <td v-if="user.type !== 'USER'">
            <button class="btn btn-primary" @click="updateType(item, 'TEMP_SCANNER')" v-if="item.account.account_type !== 'TEMP_SCANNER'">Assign scanning</button>
            <button class="btn btn-danger" @click="updateType(item, 'USER')" v-if="item.account.account_type === 'TEMP_SCANNER'">Remove scanning</button>
            </td> -->
              <td v-if="user.type !== 'USER'">
                  <i v-if="item.address === null">No address recorded</i>
                  <label v-if="item.address !== null">
                  <b class="text-danger">({{item.address.code}})</b> <span class="badge badge-pill badge-dark" :title="' ' + item.address.route + ', ' + item.address.locality + ', ' + item.address.country"><i class="fa fa-question pr-0"></i></span>
                  </label>
              </td>
              <td v-if="user.type !== 'USER'">
                  <i v-if="item.assigned_location === null">Not assigned</i>
                  <label v-if="item.assigned_location !== null">
                  <b>{{item.assigned_location.route}}</b> <span class="badge badge-pill badge-dark" :title=" item.assigned_location.locality + ', ' + item.assigned_location.region + ', ' + item.assigned_location.country"><i class="fa fa-question pr-0"></i></span>
                  </label>
              </td>
              <td v-if="user.type !== 'USER'">
                  <i v-if="item.account.account_type === 'USER'">No assignment</i>
                  <label v-if="item.account.account_type !== 'USER'">
                  <b>{{item.account.account_type}}</b>
                  </label>
              </td>
              <td v-if="user.type !== 'USER'">

                <div class="dropdownn">
                  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                    Actions
                  </button>
                  <div class="dropdown-menu" role="menu">
                      <a class="dropdown-item"  @click="updateType(item, 'USER')" v-if="item.account.account_type === 'TEMP_SCANNER' || item.account.account_type === 'BUSINESS_AUTHORIZED'" style="color:red">Remove assign as {{item.account.account_type}}</a>
                      <a class="dropdown-item" @click="updateType(item, 'BUSINESS_AUTHORIZED')" v-if="item.account.account_type !== 'BUSINESS_AUTHORIZED'">Assign as business authorized</a>
                      <!-- <div v-if="item.account.account_type === 'TEMP_SCANNER'"> -->
                      <a class="dropdown-item" @click="updateType(item, 'TEMP_SCANNER')" v-if="item.account.account_type !== 'TEMP_SCANNER'">Assign as scanner</a>
                      <a class="dropdown-item" v-if="item.assigned_location === null" @click="show('branch', item, 'add')">Assign branch</a>
                      <a class="dropdown-item" v-if="item.assigned_location !== null" @click="show('branch', item, 'edit')">Edit branch</a>
                      <a class="dropdown-item" v-if="item.address === null" @click="show('brgy', item, 'add')">Assign address</a>
                      <a class="dropdown-item" v-if="item.address !== null" @click="show('brgy', item, 'edit')">Edit address</a>
                      <!-- </div> -->
                      <!-- <div v-if="item.account.account_type === 'BUSINESS_AUTHORIZED'">
                      <a class="dropdown-item" @click="updateType(item, 'TEMP_SCANNER')" v-if="item.account.account_type !== 'TEMP_SCANNER'">Assign as scanner</a>
                      <a class="dropdown-item" v-if="item.assigned_location === null" @click="show('vehicle', item, 'add')">Assign vehicle</a>
                      <a class="dropdown-item" v-if="item.assigned_location !== null" @click="show('branch', item, 'edit')">Edit branch</a>
                      <a class="dropdown-item" v-if="item.assigned_location !== null" @click="show('vehicle', item, 'edit')">Edit vehicle</a>
                      <a class="dropdown-item" v-if="item.address === null" @click="show('brgy', item, 'add')">Assign address</a>
                      <a class="dropdown-item" v-if="item.address !== null" @click="show('brgy', item, 'edit')">Edit address</a>
                      </div> -->
                      <a class="dropdown-item" @click="show('unlink', item)" style="color:red">Delete</a>
                  </div>
                </div>
                <!-- The Modal -->
                <div class="modal fade" id="myModal" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <!-- Modal Header -->
                            <div class="modal-header">
                                <h4 class="modal-title">Assign as:</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <!-- Modal body -->
                            <div class="modal-body" style="justify-content:center; display:flex">
                                <button class="btn btn-danger" @click="updateType(item, 'USER')" v-if="item.account.account_type === 'TEMP_SCANNER' || item.account.account_type === 'BUSINESS_AUTHORIZED'">Remove assignment</button>
                                &nbsp;&nbsp;
                                <h5>OR Change to:</h5>&nbsp;&nbsp;
                                <button class="btn btn-primary" @click="updateType(item, 'BUSINESS_AUTHORIZED')" v-if="item.account.account_type !== 'BUSINESS_AUTHORIZED'" style="margin-right:10px;" data-dismiss='modal'>BUSINESS_AUTHORIZED</button>
                                <button class="btn btn-primary" @click="updateType(item, 'TEMP_SCANNER')" v-if="item.account.account_type !== 'TEMP_SCANNER'" data-dismiss='modal'>SCANNER</button>
                            </div>
                                <!-- Modal footer -->
                                <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div> 
                </td>
            </tr>
        </tbody>
    </table>
    <empty v-if="data === null" :title="'No linked accounts.'" :action="' You can link your account with your family, friends and company!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>

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
                        <input type="text" class="form-control form-control-custom" v-model="locality" placeholder="Town, Lungsod or locality" style="width: 80%; float:left; margin-right: 5px;" />
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
                                <button class="btn btn-primary" v-if="selectedItem.address === null" @click="createAddress('brgy', item)">Assign</button>
                                <button class="btn btn-primary" v-if="selectedItem.address !== null" @click="updateAddress('brgy', item)">Update</button>
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

    <!-- Assign Branch Modal -->
    <div class="modal fade" id="assign" tabindex="-1" role="dialog" aria-labelledby="assignHeader" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="assignHeader">Assign Branch</h5>
                    <button type="button" class="close" @click="hideModal('assign')" aria-label="Close">
                      <span aria-hidden="true" class="text-primary">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label style="width: 100%; float: left;">Filter</label>
                        <input type="text" class="form-control form-control-custom" v-model="branch" placeholder="Branch" style="width: 80%; float:left; margin-right: 5px;" />
                        <button type="button" class="btn btn-primary pull-right" @click="search('branch')">Search</button>
                    </div>
                    <table class="table table-borderless table-responsive">
                        <thead>
                            <th>Branch</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in branches" :key="index">
                              <td>
                                <label>
                                <b>{{item.route}}</b> <span class="badge badge-pill badge-dark" :title="item.locality + ', ' + item.country"><i class="fa fa-question pr-0"></i></span>
                                </label>
                              </td>
                              <td>
                                <button class="btn btn-primary" v-if="selectedItem.assigned_location === null" @click="createAddress('branch', item)">Assign</button>
                                <button class="btn btn-primary" v-if="selectedItem.assigned_location !== null" @click="updateAddress('branch', item)">Reassign</button>
                              </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="hideModal('assign')">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Unlink Account Modal -->
    <div class="modal fade" id="unlink" tabindex="-1" role="dialog" aria-labelledby="unlinkHeader" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title" id="unlinkHeader">Unlink Account</div>
                    <button type="button" class="close" @click="hideModal('unlink')" aria-label="Close">
                        <span aria-hidden="true" class="text-primary">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                Are you sure you want to unlink this account?
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="hideModal('unlink')">Cancel</button>
                    <button type="button" class="btn btn-success" @click="unlink()">Unlink</button>
                </div>
            </div>
        </div>
    </div>

    <!-- CREATE ACCOUNT MODAL -->
    <div class="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="createHeader" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title" id="createHeader">Create Employee Account</div>
            <button type="button" class="close" @click="hideModal('create')" aria-label="Close">
              <span aria-hidden="true" class="text-primary">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <span v-if="errorMessage !== null" class="text-danger text-center">
              <label><b>Oops!</b> {{errorMessage}}</label>
            </span>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" name="username" id="username" class="form-control" v-model="username" placeholder="Employee Username">
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="text" name="password" id="password" class="form-control" readonly :value="username ? username + '_temp': ''" placeholder="Auto generated based on username">
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" name="email" id="email" class="form-control" v-model="email">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal('create')">Cancel</button>
            <button type="button" class="btn btn-success" @click="create()">Create Account</button>
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

.dropdown-menu{
  margin-right: 40px
}

.dropdown-menu:hover{
    cursor: pointer;
}


.dropdown-menu:hover ~ a{
  background-color: aliceblue
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import Vue from 'vue'

export default {
  mounted(){
    let data = JSON.parse(localStorage.getItem('linked_accounts/' + this.user.code))
    if(data){
      if(data.data.length > 0){
        this.data = data.data
      }else{
        this.data = null
      }
      this.retrieve(false)
    }else{
      this.data = null
      this.retrieve(true)
    }
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null,
      params: null,
      locality: null,
      branch: null,
      importFlag: false,
      googleId: null,
      googleSheetNumber: null,
      username: null,
      errorMessage: null,
      email: null,
      brgys: [],
      branches: [],
      selectedItem: null,
      newAccountType: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  methods: {
    show(params, item, operation){
      // console.log(item)
      if(operation === 'add'){
        if(params === 'brgy') {
          this.selectedItem = item
          this.params = params
          this.brgys = null
          $('#addAddress').modal('show')
        } else if(params === 'branch') {
          this.locality = null
          this.selectedItem = item
          this.branches = null
          this.branch = null
          $('#assign').modal('show')
        } else {
          this.selectedItem = item
          $('#unlink').modal('show')
        }
      }else{
        if(params === 'brgy') {
          this.selectedItem = item
          this.params = params
          this.brgys = null
          $('#addAddress').modal('show')
        } else if(params === 'branch') {
          this.locality = null
          this.selectedItem = item
          this.branches = null
          $('#assign').modal('show')
        } else if(params === 'unlink'){
          this.selectedItem = item
          $('#unlink').modal('show')
        } else {
          this.username = null
          this.email = null
          $('#create').modal('show')
        }
      }
    },
    unlink() {
      $('#loading').css({display: 'block'})
      const linkedAccountsParam = {
        id: this.selectedItem.id
      }
      const accountTypeParam = {
        id: this.selectedItem.account_id,
        account_type: this.selectedItem.account.account_type === 'TEMP_SCANNER' ? 'USER' : this.selectedItem.account.account_type
      }

      if(this.selectedItem.assigned_location !== null) {
        const locationsParam = {
          id: this.selectedItem.assigned_location.id
        }
        this.APIRequest('accounts/update_account_type', accountTypeParam).then(() => {
          this.APIRequest('locations/delete', locationsParam).then(() => {
            this.APIRequest('linked_accounts/delete', linkedAccountsParam).then(() => {
              this.hideModal('unlink')
              this.retrieve()
            })
          })
        })
      } else {
        this.APIRequest('accounts/update_account_type', accountTypeParam).then(() => {
          this.APIRequest('linked_accounts/delete', linkedAccountsParam).then(response => {
            this.hideModal('unlink')
            this.retrieve()
          })
        })
      }
    },
    hideModal(id){
      console.log(id)
      if(id === 'addAddress') {
        this.selectedItem = null
        this.locality = null
        this.brgys = null
      } else if(id === 'assign'){
        this.selectedItem = null
        this.branch = null
        this.branches = null
      } else {
        this.selectedItem = null
      }

      $(`#${id}`).modal('hide')
    },
    redirect(parameter){
      ROUTER.push(parameter)
    },
    updateType(item, status){
      let parameter = {
        id: item.account.id,
        account_type: status
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/update_account_type', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve()
      })
    },
    createAddress(type, location){
      if(this.selectedItem === null){
        return
      }

      if(type === 'brgy') {
        let parameter = {
          account_id: this.selectedItem.account_id,
          code: location.code,
          longitude: location.longitude,
          latitude: location.latitude,
          route: location.route,
          locality: location.locality,
          region: location.region,
          country: location.country,
          payload: 'brgy'
        }
        this.APIRequest('locations/create', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.hideModal('addAddress')
          this.retrieve()
        })
      } else {
        let parameter = {
          account_id: this.selectedItem.account_id,
          assigned_code: location.code,
          payload: 'business'
        }

        this.APIRequest('locations/create', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.hideModal('assign')
          this.retrieve()
        })
      }
    },
    updateAddress(type, location){
      if(this.selectedItem === null){
        return
      }
      if(type === 'brgy') {
        let parameter = {
          id: this.selectedItem.address.id,
          code: location.code,
          longitude: location.longitude,
          latitude: location.latitude,
          route: location.route,
          locality: location.locality,
          region: location.region,
          country: location.country
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('locations/update', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.hideModal('addAddress')
          this.retrieve()
        })
      } else {
        let parameter = {
          id: this.selectedItem.assigned_location.id,
          assigned_code: location.code
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('locations/update', parameter).then(response => {
          $('#loading').css({display: 'none'})
          this.hideModal('assign')
          this.retrieve()
        })
      }
    },
    search(type){
      if(type === 'brgy') {
        this.brgys = null
        if(this.locality === null || this.locality === ''){
          return
        }
        let parameter = {
          condition: [{
            value: this.locality + '%',
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
        if(this.branch === null || this.locality === '') {
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
    },
    retrieve(flag = false){
      let parameter = null
      if(this.user.type === 'USER'){
        parameter = {
          condition: [{
            clause: '=',
            column: 'account_id',
            value: this.user.userID
          }, {
            clause: 'or',
            column: 'owner',
            value: this.user.userID
          }]
        }
      }else{
        parameter = {
          condition: [{
            clause: '=',
            column: 'owner',
            value: this.user.userID
          }]
        }
      }
      $('#loading').css({display: flag ? 'block' : 'none'})
      this.APIRequest('linked_accounts/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        localStorage.setItem('linked_accounts/' + this.user.code, JSON.stringify(response))
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    create() {
      if(!this.username || !this.email) {
        this.errorMessage = 'All fields are required.'
      } else {
        let parameter = {
          account_id: this.user.userID,
          username: this.username,
          password: `${this.username}_temp`,
          email: this.email,
          account_type: 'USER',
          status: 'ADDED',
          referral_code: null
        }

        $('#loading').css({display: 'block'})
        this.APIRequest('accounts/create', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data !== null) {
            this.errorMessage = null
            let par = {
              owner: this.user.userID,
              account_id: response.data
            }

            this.APIRequest('linked_accounts/create', par).then(res => {
              if(res.data) {
                this.hideModal('create')
              } else if (response.error !== null){
                this.errorMessage = 'There was something wrong with linking the account. Please link the account manually.'
              }
            })
          } else if (response.error !== null) {
            for(let key of Object.keys(response.error.message)) {
              this.errorMessage = response.error.message[key][0]
              break
            }
          }

          this.retrieve()
        })
      }
    },
    importData() {
      this.errorMessage = null
      if(this.googleId !== null && this.googleSheetNumber !== null) {
        $('#loading').css({display: 'block'})
        $.ajax({
          url: `https://spreadsheets.google.com/feeds/cells/${this.googleId}/${this.googleSheetNumber}/public/values?alt=json`,
          type: 'GET',
          success: (data) => {
            $('#loading').css({display: 'none'})
            let {entry} = data.feed
            if(entry) {
              let parameter = {
                entries: []
              }
              let columnCount = 5
              let headers = entry.splice(0, columnCount)
              if(this.validateSpreadSheet(headers)) {
                const entries = [...entries]
                if(entries.length % columnCount === 0) {
                  let rowCounter = 1
                  for(let i = 0; i < entries.length; i += columnCount) {
                    rowCounter++
                    let account = {
                      username: entries[i].content.$t.trim(),
                      email: entries[i + 1].content.$t.trim(),
                      password: `${entries[i].content.$t.trim()}_temp`,
                      account_type: 'USER',
                      status: 'ADDED',
                      creator: this.user.userID,
                      first_name: entries[i + 2].content.$t.trim(),
                      middle_name: entries[i + 3].content.$t.trim(),
                      last_name: entries[i + 4].content.$t.trim()
                    }
                    if(AUTH.validateEmail(account.email) === false) {
                      this.errorMessage = `Invalid email on row ${rowCounter}`
                    }else if(account.username === '' || account.first_name === '' || account.middle_name === '' || account.last_name === '') {
                      this.errorMessage = `Error on row ${rowCounter}`
                    }
                    parameter.entries.push(account)
                  }
                } else {
                  this.errorMessage = 'There is an empty cell'
                }
              } else {
                this.errorMessage = 'Please use the import accounts template for the spreadsheet'
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
                this.retrieve()
              })
            }
          }
        })
      }
    },
    validateSpreadSheet(headers = []) {
      let verdict = false
      if(headers.length >= 5) {
        verdict = (
          headers[0].content.$t.trim() === 'Username' &&
          headers[1].content.$t.trim() === 'Email' &&
          headers[2].content.$t.trim() === 'First Name' &&
          headers[3].content.$t.trim() === 'Middle Name' &&
          headers[4].content.$t.trim() === 'Last Name'
        )
      }
      return verdict
    }
  }
}
</script>

