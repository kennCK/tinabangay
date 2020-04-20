<template>
  <div style="margin-top: 25px;">
    <div class="row m-0 justify-content-end">
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      />
    <button class="btn btn-primary pull-right" style="margin: .5% 0;" @click="showModal('patient')">New Patient</button>
    </div>
    <basic-filter 
      v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']"></basic-filter>

    <table class="table table-responsive table-bordered" id="myTable">
      <tr class="bg-primary">
        <td>Status</td>
        <td>Patient's Username / Patient Code<i class="fa fa-caret-down float-right" @click="sortTable(1)"></i></td>
        <td>Contact Number</td>
        <td>Date Recorded</td>
        <td>Actions</td>
      </tr>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-uppercase" :class="{'bg-black': item.status === 'death', 'bg-danger': item.status === 'positive', 'bg-warning': item.status === 'pum', 'bg-primary': item.status === 'pui', 'bg-success': item.status === 'negative'}">{{item.status}}</td>
          <td><i class="fa fa-map-marker text-primary" @click="selectedItem = item" data-toggle="modal" data-target="#visited_places" title="Visited Places" alt="Visited Places" ></i> {{item.account ? item.account.username : item.code}}</td>
          <td>{{ item.account === null ? 'Not Specified' : item.account.information.contact_number ? item.account.information.contact_number : 'Not Specified'}}</td>
          <td>{{item.created_at_human}}</td>
          <td>
            <button class="btn btn-success" style="margin: .5% 0;" @click="showModal('place', item.account_id, (item.account_id === null ? item.id : null))">Add Visited Place</button>
            <button class="btn btn-primary" style="margin: .5% 0;" @click="showModal('patient', null, null, item)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger" style="margin: .5% 0;" @click="removeItem(item.id)"><i class="fas fa-trash"></i></button>
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
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4" v-if="selectedItem !== null">
            <table class="table table-responsive table-bordered"  id="myTable2">
              <thead class="bg-primary">
                <td colspan="2"> <i class=" fa fa-caret-down float-right" @click="sortTable2(0)"></i>Date Visited</td>
                <!-- <td> <i class=" fa fa-caret-down float-right" @click="sortTable2(1)"></i>Time</td> -->
                <td> <i class=" fa fa-caret-down float-right" @click="sortTable2(2)"></i>Establishment</td>
                <td>City</td>
                <td>Country</td>
              </thead>
             <tbody>
              <tr v-for="(item, index) in selectedItem.places" :key="index">
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
    <increment-modal :property="patientProperty"></increment-modal>
    <increment-modal ref="modal" :property="placeProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

.bg-black{
  color: $white !important;
  background: #000000 !important;
}

.bg-warning, .bg-danger{
  color: $white !important;
}

</style>
<script>

import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import PatientModalProperty from 'src/modules/patients/CreatePatients.js'
import PlaceModalProperty from 'src/modules/patients/AddPlace.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default {
  mounted(){
   // this.retrieve()
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      numPages: null,
      activePage: 1,
      limit: 5,
      common: COMMON,
      user: AUTH.user,
      auth: AUTH,
      patientProperty: PatientModalProperty,
      placeProperty: PlaceModalProperty,
      selectedItem: null,
      data: null,
      config: CONFIG,
      accounts: [],
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Status ascending',
          payload: 'status',
          payload_value: 'asc'
        }, {
          title: 'Status descending',
          payload: 'status',
          payload_value: 'desc'
        }, {
          title: 'Code ascending',
          payload: 'code',
          payload_value: 'asc'
        }, {
          title: 'Code descending',
          payload: 'code',
          payload_value: 'desc'
        }]
      }],
      filter: null,
      sort: null
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue'),
    Pager
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    linkGen (pageNum){
      return '#page=' + pageNum
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
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
        if(response.data.length > 0){
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.numPages = null
        }
      })
    },
    sortTable(n) {
      var table, rows, switching, i, x, y, shouldSwitch, dir
      var switchcount = 0
      table = document.getElementById('myTable')
      switching = true
      dir = 'asc'
      while (switching) {
        switching = false
        rows = table.rows
        for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false
          x = rows[i].getElementsByTagName('TD')[n]
          y = rows[i + 1].getElementsByTagName('TD')[n]
          if (dir === 'asc') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          } else if (dir === 'desc') {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          switchcount++
        } else {
          if (switchcount === 0 && dir === 'asc') {
            dir = 'desc'
            switching = true
          }
        }
      }
    },
    sortTable2(n) {
      var table, rows, switching, i, x, y, shouldSwitch, dir
      var switchcount = 0
      table = document.getElementById('myTable2')
      switching = true
      dir = 'asc'
      while (switching) {
        switching = false
        rows = table.rows
        for (i = 0; i < (rows.length - 1); i++) {
          shouldSwitch = false
          x = rows[i].getElementsByTagName('TD')[n]
          y = rows[i + 1].getElementsByTagName('TD')[n]
          if (dir === 'asc') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          } else if (dir === 'desc') {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          switchcount++
        } else {
          if (switchcount === 0 && dir === 'asc') {
            dir = 'desc'
            switching = true
          }
        }
      }
    },
    removeItem(id){
      let parameter = {
        id: id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/delete', parameter).then(response => {
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
      })
    },
    showModal(modal, account = null, patientID = null, update = false){
      if(modal === 'patient') {
        this.patientProperty = {...PatientModalProperty}
        let inputs = this.patientProperty.inputs
        if($('#createPatientsModal #search-username').length === 0) {
          $('#createPatientsModal .modal-body .form-group:first-child label').attr('style', 'display: flex; flex-flow: row wrap; justify-content: space-between; align-items: center')
          $('<button>', {
            class: 'btn btn-primary mt-3 w-25 ml-auto',
            id: 'search-username',
            html: 'Search Account',
            click: () => {
              let userParams = {
                condition: [{
                  value: $('#username').val() + '%',
                  column: 'username',
                  clause: 'like'
                }]
              }
              $('#loading').css({display: 'block'})
              this.APIRequest('accounts/retrieve_accounts', userParams).then(response => {
                $('#loading').css({display: 'none'})
                this.accounts = response.data
                let filtered = null
                if($('#username').val() !== '') {
                  filtered = this.accounts.filter(account => account !== null && account.username.toLowerCase().indexOf($('#username').val().toLowerCase()) > -1)
                } else {
                  filtered = null
                  let freshInput = inputs.filter(input => input.variable !== 'account_id')
                  this.patientProperty.inputs = freshInput
                }
                let offset = $('#username').offset()
                let content = []
                if(filtered) {
                  console.log('filter exists')
                  filtered.forEach(account => {
                    let item = $('<div>', {
                      class: 'px-3 py-2 border bg-white username-option',
                      html: account.username,
                      click: () => {
                        let par = {
                          condition: [{
                            value: account.id,
                            column: 'account_id',
                            clause: '='
                          }]
                        }
                        let data = null
                        $('#loading').css({display: 'block'})
                        this.APIRequest('account_informations/retrieve', par).then(response => {
                          $('#loading').css({display: 'none'})
                          data = response.data[0]
                          if($('#user-info').length === 0) {
                            $('<div>', {
                              class: 'card mb-3',
                              id: 'user-info'
                            }).insertBefore('#createPatientsModal .modal-body .form-group:nth-child(2)')
                            $('<div>', {
                              class: 'card-body alert-info',
                              html: `<h5 class="card-title">User Information</h5>
                                    <div class="row">
                                      <div class="col-5"><b>Full Name:</b> ${data.first_name ? `${data.first_name} ${data.middle_name} ${data.last_name}` : 'Not Specified'}</div>
                                      <div class="col-5 text-capitalize"><b>Sex:</b> ${data.sex ? data.sex : 'Not Specified'}</div>
                                    </div>
                                    <div class="row mt-2">
                                      <div class="col-10"><b>Address:</b> ${data.address ? data.address : 'Not Specified'}</div>
                                    </div>`
                            }).appendTo('#user-info')
                          } else {
                            $('#user-info .card-body').html(`<h5 class="card-title">User Information</h5>
                                    <div class="row">
                                      <div class="col-5"><b>Full Name:</b> ${data.first_name ? `${data.first_name} ${data.middle_name ? data.middle_name : ''} ${data.last_name}` : 'Not Specified'}</div>
                                      <div class="col-5 text-capitalize"><b>Sex:</b> ${data.sex ? data.sex : 'Not Specified'}</div>
                                    </div>
                                    <div class="row mt-2">
                                      <div class="col-10"><b>Address:</b> ${data.address ? data.address : 'Not Specified'}</div>
                                    </div>`)
                          }
                        })
                        this.patientProperty.inputs.push({
                          row: 'full',
                          variable: 'account_id',
                          placeholder: 'Account ID',
                          value: account.id,
                          required: false,
                          id: 'account_id',
                          type: 'hidden',
                          inputType: 'hidden',
                          validation: {
                            size: 0,
                            type: 'number'
                          }
                        })
                        $('#username').val(account.username)
                        $('.username-dropdown').remove()
                      }
                    })
                    content.push(item)
                  })
                } else {
                  content = null
                }
                if($('.username-dropdown').length === 0) {
                  $('<div>', {
                    class: 'username-dropdown border shadow',
                    style: `width: ${$('#username').outerWidth()}px; top: ${offset.top + 50}px; left: 50%; transform: translateX(-50%); position: absolute; z-index: 1060; display: flex; flex-flow: column wrap;`,
                    html: content === null ? '<div class="px-3 py-2 text-danger border bg-white">Please type a search query</div>' : content.length === 0 ? '<div class="px-3 py-2 text-danger border bg-white">There are no usernames that match that</div>' : content
                  }).appendTo('#createPatientsModal')
                } else {
                  $('.username-dropdown').html('')
                  $('.username-dropdown').html(content === null ? '<div class="px-3 py-2 text-danger border bg-white">Please type a search query</div>' : content.length === 0 ? '<div class="px-3 py-2 text-danger border bg-white">There are no usernames that match that</div>' : content)
                  if($(this).val() === null || $(this).val() === '') {
                    if(this.patientProperty.inputs[this.patientProperty.inputs.length - 1].variable === 'account_id') {
                      this.patientProperty.inputs.pop()
                    }
                  }
                }
              })
            }
          }).appendTo('#createPatientsModal .modal-body .form-group:first-child label')
        }
        let freshInput = inputs.filter(input => input.variable !== 'account_id')
        this.patientProperty.inputs = freshInput
        if(!update) {
          inputs.map(input => {
            input.value = null
          })
          this.patientProperty.params.map(par => {
            if(par.variable === 'added_by') {
              par.value = this.user.userID
            }
          })
        } else {
          let modalData = {...this.patientProperty}
          let parameter = {
            title: 'Update Patient Entry',
            route: 'patients/update',
            button: {
              left: 'Cancel',
              right: 'Update'
            },
            sort: {
              column: 'created_at',
              value: 'desc'
            },
            params: [{
              variable: 'id',
              value: update.id
            }]
          }
          modalData = {...modalData, ...parameter}
          if(modalData.inputs[modalData.inputs.length - 1].variable === 'account_id') {
            modalData.inputs.pop()
          }
          modalData.inputs.map(input => {
            if(update.account_id && input.variable === 'username') {
              input.value = update.account.username
              modalData.inputs.push({
                row: 'full',
                variable: 'account_id',
                placeholder: 'Account ID',
                value: update.account_id,
                required: false,
                id: 'account_id',
                type: 'hidden',
                inputType: 'hidden',
                validation: {
                  size: 0,
                  type: 'number'
                }
              })
            }

            if(input.variable === 'code') {
              input.value = update.code
            }

            if(input.variable === 'status') {
              input.value = update.status
            }

            if(input.variable === 'remarks'){
              input.value = update.remarks
            }

            if(input.variable === 'source') {
              input.value = update.source
            }
            this.patientProperty = {...modalData}
          })
        }
        $('#createPatientsModal #user-info').remove()
        $('#createPatientsModal .username-dropdown').remove()
        $('#createPatientsModal').modal('show')
        $('#createPatientsModal input[type=text]').attr('autocomplete', 'off')
      } else {
        this.placeProperty = {...PlaceModalProperty}
        if(this.placeProperty.params[this.placeProperty.params.length - 1].variable === 'account_id') {
          this.placeProperty.params.pop()
        }
        let inputs = this.placeProperty.inputs
        this.$refs.modal.$refs.location[0].onCancel()
        inputs.map(input => {
          input.value = null
        })
        this.placeProperty.params.map(par => {
          if (par.variable === 'patient_id') {
            par.value = patientID
          }
        })
        if(account !== null) {
          this.placeProperty.params.push({variable: 'account_id', value: account})
        }
        $('#createPlacesModal').modal('show')
        console.log('dead end for now')
      }
    }
  }
}
</script>
