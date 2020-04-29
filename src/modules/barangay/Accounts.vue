<template>
  <div class="ledger-summary-container">
    <button class="btn btn-primary pull-right" style="margin: .5% 0;" @click="showModal('account')">New Account</button>
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
          <td>Add Place</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.account.created_at}}</td>
          <td>
            <label class="action-link text-primary"><i class="fa fa-map-marker text-primary" @click="getVisited(item.account.id)" title="Visited Places" alt="Visited Places" ></i> {{item.account.username}}</label>
          </td>
          <td>{{item.account.email}}</td>
          <td><button class="btn btn-primary" @click="exportUser(item.account)">Export User</button></td>
          <td><button class="btn btn-success" @click="showModal('place', item.account.id)">Add Visited Place</button></td>
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
            <button type="button" class="close" aria-label="Close" @click="hideVisit()">
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

    <empty v-if="data === null" :title="'No accounts available!'" :action="'Keep growing.'"></empty>
    <increment-modal :property="modalProperty"></increment-modal>
    <increment-modal ref="modal" :property="placeProperty"></increment-modal>
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
import PlacesProperty from 'src/modules/barangay/AddPlace.js'
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
      modalProperty: ModalProperty,
      placeProperty: PlacesProperty,
      config: CONFIG,
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
          value: filter.value + '%',
          column: filter.column,
          clause: 'like'
        }, {
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }, {
          value: this.user.userID,
          column: 'member',
          clause: '<>'
        }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? this.activePage - 1 : this.activePage
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
    hideVisit() {
      console.log('clicked to close')
      $('#visited_places').modal('hide')
    }
  }
}
</script>
