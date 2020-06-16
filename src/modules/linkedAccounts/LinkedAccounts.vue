<template>
  <div style="margin-top: 25px;">
    <div class="form-group" v-if="user.type !== 'USER'">
      <label>You can assign address to your employees for address status verification:</label>
    </div>
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead class="bg-primary">
        <td>Owner's Username</td>
        <td>Linked Account's Username</td>
        <td>Date</td>
        <td v-if="user.type !== 'USER'">
          Type
        </td>
        <td v-if="user.type !== 'USER'">
          Address
        </td>
        <td v-if="user.type !== 'USER'">
          Actions
        </td>
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
              <b class="text-danger">({{item.account.location.code}})</b>{{' ' + item.account.location.route + ', ' + item.account.location.locality + ', ' + item.account.location.country}}
            </label>
          </td>
          <td v-if="user.type !== 'USER'">
            <button class="btn btn-primary" v-if="item.account.location === null" @click="show('create', item)">
              Assign address
            </button>
            <button class="btn btn-primary" v-if="item.account.location !== null" @click="show('update', item)">
              Edit address
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No linked accounts.'" :action="' You can link your account with your family, friends and company!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>



    <div class="modal fade" id="addAddress" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Assign Address</h5>
            <button type="button" class="close" @click="hideModal()" aria-label="Close">
              <span aria-hidden="true" class="text-primary">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label style="width: 100%; float: left;">Filter</label>
              <input type="text" class="form-control form-control-custom" v-model="locality" placeholder="Town, Lungsod or locality" style="width: 80%; float:left; margin-right: 5px;" />
              <button type="button" class="btn btn-primary pull-right" @click="search()">Search</button>
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
                    <button class="btn btn-primary" v-if="selectedItem.account.location === null" @click="createAddress(item)">Assign</button>
                    <button class="btn btn-primary" v-if="selectedItem.account.location !== null" @click="updateAddress(item)">Update</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="hideModal()">Close</button>
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
      brgys: [],
      selectedItem: null,
      newAccountType: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  methods: {
    show(params, item){
      this.selectedItem = item
      this.params = params
      this.brgys = null
      $('#addAddress').modal('show')
    },
    hideModal(){
      this.selectedItem = null
      this.params = null
      this.brgys = null
      $('#addAddress').modal('hide')
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
    createAddress(location){
      if(this.selectedItem === null){
        return
      }
      let parameter = {
        account_id: this.selectedItem.account_id,
        code: location.code,
        longitude: location.longitude,
        latitude: location.latitude,
        route: location.route,
        locality: location.locality,
        region: location.region,
        country: location.country
      }
      this.APIRequest('locations/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.hideModal()
        this.retrieve()
      })
    },
    updateAddress(location){
      if(this.selectedItem === null){
        return
      }
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
      this.APIRequest('locations/update', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.hideModal()
        this.retrieve()
      })
    },
    search(){
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

