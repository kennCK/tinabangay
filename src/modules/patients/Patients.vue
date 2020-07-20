<template>
  <div style="margin-top: 25px;">

    <div class="form-group" v-if="user.location !== null">
      <label>Location: <b class="text-danger">({{user.location.code}})</b> {{user.location.route + ', ' + user.location.locality}}</label>
    </div>
    <div class="row m-0 justify-content-end">
   
        <button class="btn btn-primary" style="margin-right: 5px;" @click="showModal('patient')">New</button>
        <!-- <button class="btn btn-warning" style="margin-right: 5px;" @click="importFlag = true">Import</button> -->
        <!-- <button class="btn btn-danger pull-right" style="margin: .5% 0;" @click="exportPatients()">Export Patients</button> -->
        <!-- <button class="btn btn-primary" style="margin-right: 5px;" @click="showSummaryFlag = true">Summary</button> -->
         <Pager
          :pages="numPages"
          :active="activePage"
          :limit="limit"
          />
      </div>


    <div class="form-group" v-if="importFlag === true">
      <label style="width: 100%;">Using google sheet</label>
      <input type="text" class="form-control" style="width: 30% !important; float: left;" v-model="googleId" placeholder="Google Sheet Id">
      <input type="text" class="form-control" style="width: 30% !important; float: left; margin-right: 5px; margin-left: 5px;" placeholder="sheet number" v-model="googleSheetNumber">
      <button class="btn btn-primary" @click="syncing()">Start syncing</button>
    </div>


    <div class="form-group" v-if="exportFlag === true">
      <label style="width: 100%;">Using google sheet</label>
      <input type="text" class="form-control" style="width: 50% !important; float: left;" v-model="offset" placeholder="Offset">
      <button class="btn btn-primary" @click="exportPatients()">Start export</button>
    </div>



    <div class="form-group">
      <!-- <label style="width: 100%;">Get summary per locality:</label> -->
      <!-- <input type="text" class="form-control" style="width: 30% !important; float: left; margin-right: 5px;" v-model="localitySearch" placeholder="Locality">
      <button class="btn btn-primary" @click="retrieveLocality()">Search</button> -->
      <p v-if="summary !== null">
        Positive: {{summary.positive}}, Deceased: {{summary.death}}, Recovered: {{summary.recovered}}, Negative: {{summary.negative}}
      </p>
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
        <th scope="col">Status</th>
        <th scope="col">Patient's Username / Patient Code<i class="fa fa-caret-down float-right" @click="sortTable(1)"></i></th>
        <th scope="col">Remarks</th>
        <th scope="col">Locality</th>
        <th scope="col">Contact Number</th>
        <th scope="col">Date Recorded</th>
        <th scope="col">Actions</th>
      </tr>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-uppercase" :class="{'alert-info': item.status === 'symptoms', 'bg-danger': item.status === 'positive', 'bg-warning': item.status === 'pum', 'bg-primary': item.status === 'pui', 'bg-success': item.status === 'tested'}">{{item.status}}</td>
          <td><i class="fa fa-map-marker text-primary" @click="selectedItem = item" data-toggle="modal" data-target="#visited_places" title="Visited Places" alt="Visited Places" ></i> {{item.account ? item.account.username : item.code}}</td>
          <td>{{item.remarks}}</td>
          <td>{{item.locality}}</td>
          <td>{{ item.account === null ? 'Not Specified' : item.account.information.contact_number ? item.account.information.contact_number : 'Not Specified'}}</td>
          <td>{{item.created_at_human}}</td>
          <td>
            <button class="btn btn-success" style="margin: .5% 0;" @click="showModal('place', item.account_id, item.id)">Add Visited Place</button>
            <button class="btn btn-primary" style="margin: .5% 0;" @click="showModal('patient', null, null, item)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger" style="margin: .5% 0;" @click="removeItem(item.id)"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!--MODAL FOR VISITED PLACES-->
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
                <td>Actions</td>
              </thead>
             <tbody>
              <tr v-for="(item, index) in selectedItem.places" :key="index">
                <td>{{item.date_human}}</td>
                <td>{{item.time}}</td>
                <td>{{item.route}}</td>
                <td>{{item.locality}}</td>
                <td>{{item.country}}</td>
                <td><button class="btn btn-danger" type="button" @click="deletePlace(item)"><i class="fa fa-trash"></i></button></td>
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
import { ExportToCsv } from 'export-to-csv'
import moment from 'moment'
export default {
  mounted(){
   // this.retrieve()
    if(this.user.type !== 'ADMIN' && this.user.type !== 'AGENCY_GOV' && this.user.type !== 'AGENCY_DOH' && this.user.type !== 'AGENCY_BRGY'){
      ROUTER.push('/dashboard')
    }
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    this.retrieveLocality()
    this.date = moment().format('MM-DD-YYYY-HH-mm-ss')
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
      date: null,
      config: CONFIG,
      accounts: [],
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Locality ascending',
          payload: 'locality',
          payload_value: 'asc'
        }, {
          title: 'Locality descending',
          payload: 'locality',
          payload_value: 'desc'
        }, {
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
      sort: null,
      importFlag: false,
      googleId: null,
      googleSheetNumber: null,
      totalSize: null,
      activeExportPage: 0,
      exportFlag: false,
      offset: 0,
      showSummaryFlag: false,
      localitySearch: null,
      summary: null
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
    retrieveLocality(){
      if(this.user.location === null){
        return
      }
      let parameter = {
        locality: this.user.location.code
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/summary', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.summary = response.data
      })
    },
    exportPatients(){
      let parameter = {
        condition: [{
          value: 'positive',
          column: 'status',
          clause: '='
        }],
        sort: {
          created_at: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        this.exportData(response.data)
      })
    },
    exportData(data){
      let options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Covid19 - BirdsEye',
        useTextFile: false,
        useBom: true,
        // useKeysAsHeaders: true,
        filename: COMMON.APP_NAME + ' - ' + this.date,
        headers: ['Code', 'Status', 'Remarks', 'Source', 'Route', 'Locality', 'Region', 'Country', 'Longitude', 'Latitude', 'Date', 'Time']
      }
      var exportData = []
      if(data !== null){
        for (var i = 0; i < data.length; i++) {
          let item = data[i]
            // this is an export hehe
          let place = item.places.length > 0 ? item.places[0] : null
          if(item.status === 'positive'){
            var object = {
              code: item.code,
              status: item.status,
              remarks: item.remarks,
              source: item.source,
              route: place ? place.route : null,
              locality: place ? place.locality : null,
              region: place ? place.region : null,
              country: place ? place.country : null,
              longitude: place ? `${place.longitude} °` : null,
              latitude: place ? `${place.latitude} °` : null,
              date: place ? place.date : null,
              time: place ? place.time : null
            }
            exportData.push(object)
          }
        }
      }
      if(exportData.length > 0){
        var csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(exportData)
      }
      $('#loading').css({'display': 'none'})
    },
    syncing(){
      // syncing here
      if(this.googleId !== null && this.googleSheetNumber !== null){
        $.get('https://spreadsheets.google.com/feeds/cells/' + this.googleId + '/' + this.googleSheetNumber + '/public/values?alt=json', response => {
          let entries = response.feed.entry
          let counter = counter
          for (var i = 0; i < entries.length; i += 12) {
            if(i > 11){
              counter++
              let object = {
                code: entries[i].content.$t,
                status: entries[i + 1].content.$t,
                remarks: entries[i + 2].content.$t,
                source: entries[i + 3].content.$t,
                route: entries[i + 4].content.$t,
                locality: entries[i + 5].content.$t,
                region: entries[i + 6].content.$t,
                country: entries[i + 7].content.$t,
                longitude: entries[i + 8].content.$t,
                latitude: entries[i + 9].content.$t,
                date: entries[i + 10].content.$t,
                time: entries[i + 11].content.$t
              }
              if(object.code === '' || object.status === '' || object.remarks === '' || object.source === '' || object.route === '' || object.locality === '' || object.region === '' || object.country === '' || object.longitude === '' || object.latitude === '' || object.date === '' || object.time === ''){
                alert('Error on line ' + counter)
                break
              }else{
                // add to backend
                let entries = []
                entries.push(object)
                // console.log(entries)
                let parameter = {
                  entries: entries
                }
                $('#loading').css({display: 'block'})
                this.APIRequest('patients/linking', parameter).then(response => {
                  $('#loading').css({display: 'none'})
                  // console.log(response)
                })
              }
            }
          }
        })
      }
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
      let parameter = null
      if(this.user.type === 'ADMIN'){
        if(filter.column !== 'locality'){
          parameter = {
            condition: [{
              value: filter.value + '%',
              column: filter.column,
              clause: 'like'
            }],
            sort: sort,
            limit: this.limit,
            offset: (this.activePage > 0) ? this.activePage - 1 : this.activePage
          }
        }else{
          parameter = {
            condition: [{
              value: filter.value + '%',
              column: filter.column,
              clause: 'like'
            }],
            sort: sort
          }
        }
      }else{
        if(this.user.location === null){
          return
        }
        parameter = {
          condition: [{
            value: this.user.location.code + '%',
            column: 'locality',
            clause: 'like'
          }],
          sort: {
            created_at: 'desc'
          }
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
        if(response.data.length > 0){
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          this.numPagesExport = parseInt(response.size / 100) + (response.size % 100 ? 1 : 0)
          this.totalSize = response.size
        }else{
          this.numPages = null
          this.totalSize = null
          this.numPagesExport = null
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
            if(input.variable === 'locality') {
              if(this.user.location !== null){
                input.value = this.user.location.code
              }else{
                input.value = null
              }
            }else{
              input.value = null
            }
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

            if(input.variable === 'locality'){
              input.value = update.locality
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
        // console.log('dead end for now')
      }
    },
    deletePlace(item){
      console.log(this.selectedItem)
      let params = {
        id: item.id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('visited_places/delete', params).then(response => {
        // $('#visited_places').modal('hide')
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
      })
    }
  }
}
</script>
