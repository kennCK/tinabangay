<template>
  <div class="ledger-summary-container">
    <button class="btn btn-primary pull-right" style="margin: .5% 0;" @click="showModal()">New Patient Account</button>
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
          <td>Status</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.created_at}}</td>
          <td>
            <label class="action-link text-primary">{{item.username}}</label>
          </td>
          <td>{{item.email}}</td>
          <td>{{item.status}}</td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No accounts available!'" :action="'Keep growing.'"></empty>
    <increment-modal :property="modalProperty"></increment-modal>
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
import ModalProperty from 'src/modules/barangay/CreatePatientAccount.js'
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
      modalProperty: ModalProperty,
      config: CONFIG,
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
      this.APIRequest('accounts/retrieve_accounts', parameter).then(response => {
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
    showModal() {
      this.modalProperty = {...ModalProperty}
      this.modalProperty.params.push({variable: 'account_id', value: this.user.userID})
      let inputs = this.modalProperty.inputs
      $('#createAccountModal label[for=password]+input').attr('readonly', '')
      inputs.map(input => {
        if(input.variable !== 'password') {
          input.value = null
        } else {
          input.value = this.Password.generate(8)
        }
      })
      $('#createAccountModal').modal('show')
    }
  }
}
</script>
