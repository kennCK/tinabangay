<template>
  <div style="margin-top: 25px;">
    <div class="form-group" v-if="user.type !== 'USER'">
      <label>You can assign address to your employees for address status verification:</label>
    </div>
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead class="bg-primary">
        <th scope="col">Owner</th>
        <th scope="col">Linked User</th>
        <th scope="col">Date</th>
        <th scope="col" v-if="user.type !== 'USER'">
          Type
        </th>
        <th scope="col" v-if="user.type !== 'USER'">
          Home Address
        </th>
        <th scope="col" v-if="user.type !== 'USER'">
          Assigned Branch
        </th>
        <th scope="col" v-if="user.type !== 'USER'">
          Actions
        </th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-uppercase">{{item.owner_account.username}}</td>
          <td class="text-uppercase">{{item.account.username}}</td>
          <td class="text-uppercase">{{item.created_at_human}}</td>
          <td v-if="user.type !== 'USER'">
            <button class="btn btn-primary" @click="updateType(item, 'TEMP_SCANNER')" v-if="item.account.account_type !== 'TEMP_SCANNER'">Assign scanning</button>
            <button class="btn btn-danger" @click="updateType(item, 'USER')" v-if="item.account.account_type === 'TEMP_SCANNER'">Remove scanning</button>
          </td>
          <td v-if="user.type !== 'USER'">
            <label v-if="item.account.location !== null">
              <b class="text-danger">({{item.account.location.code}})</b> <span class="badge badge-pill badge-dark" :title="' ' + item.account.location.route + ', ' + item.account.location.locality + ', ' + item.account.location.country"><i class="fa fa-question pr-0"></i></span>
            </label>
          </td>
          <td v-if="user.type !== 'USER'">
            <i v-if="item.assigned_location === null">Not assigned</i>
            <label v-if="item.assigned_location !== null">
              <b>{{item.assigned_location.route}}</b> <span class="badge badge-pill badge-dark" :title=" item.assigned_location.locality + ', ' + item.assigned_location.region + ', ' + item.assigned_location.country"><i class="fa fa-question pr-0"></i></span>
            </label>
          </td>
          <td v-if="user.type !== 'USER'">
            <button class="btn btn-primary" v-if="item.assigned_location === null" @click="show('branch', item)">
              Assign branch
            </button>
            <button class="btn btn-primary" v-if="item.assigned_location !== null" @click="show('branch', item)">
              Edit branch
            </button>
            <button class="btn btn-warning" v-if="item.account.location === null" @click="show('brgy', item)">
              Assign address
            </button>
            <button class="btn btn-warning" v-if="item.account.location !== null" @click="show('brgy', item)">
              Edit address
            </button>
            <button type="button" @click="show('unlink', item)" class="btn btn-danger">
              <i class="fa fa-trash"></i> Unlink
            </button>
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
                    <button class="btn btn-primary" v-if="selectedItem.account.location === null" @click="createAddress('brgy', item)">Assign</button>
                    <button class="btn btn-primary" v-if="selectedItem.account.location !== null" @click="updateAddress('brgy', item)">Update</button>
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
            <h5 class="modal-title" id="assignHeader">Assign Address</h5>
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
                <th>Yeepers</th>
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
            <button type="button" class="btn btn-danger" @click="hideModal('addAddress')">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unlink Account Modal -->
    <div class="modal fade" id="unlink" tabindex="-1" role="dialog" aria-labelledby="unlinkHeader" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title text-white" id="unlinkHeader">Unlink Header</div>
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

  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import Vue from 'vue'

export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null,
      params: null,
      locality: null,
      branch: null,
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
    show(params, item){
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
      } else {
        this.selectedItem = item
        $('#unlink').modal('show')
      }
    },
    unlink() {
      let par = {
        id: this.selectedItem.id
      }

      if(this.selectedItem.assigned_location !== null) {
        let param = {
          id: this.selectedItem.assigned_location.id
        }

        this.APIRequest('locations/delete', param).then(response => {
          this.APIRequest('linked_accounts/delete', par).then(res => {
            this.hideModal('unlink')
            this.retrieve()
          })
        })
      } else {
        $('#loading').css({display: 'block'})
        this.APIRequest('linked_accounts/delete', par).then(response => {
          this.hideModal('unlink')
          this.retrieve()
        })
      }
    },
    hideModal(id){
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
          id: this.selectedItem.account.location.id,
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
          code: location.code
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
          }, {
            value: 'business',
            clause: '=',
            column: 'payload'
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
    retrieve(){
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
      $('#loading').css({display: 'block'})
      this.APIRequest('linked_accounts/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>

