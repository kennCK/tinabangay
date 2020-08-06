<template>
  <div style="margin-top: 25px;">
    <button class="btn btn-primary pull-right" style="margin-bottom: 5px;" @click="showModal('patient')">New</button>
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
    if(this.user.type !== 'ADMIN' && this.user.type !== 'AGENCY_GOV'){
      ROUTER.push('/dashboard')
    }
    this.retrieve()
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
      data: null
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
    retrieve(){
      if(this.user.location === null){
        return
      }
      let parameter = {
        condition: [{
          value: this.user.lcoation.locality,
          column: 'locality',
          clause: '='
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
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
