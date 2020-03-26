<template>
  <div class="mx-3">
    <h1 class="my-4">Ride History</h1>
    <div class="alert alert-info mt-3 p-3" role="alert">
      <b>Note:</b> COVID Positive rows <b><u>do not</u></b> automatically mean that you have contracted the virus. It just means that a passenger onboard is affected.
    </div>
    <!-- <button class="btn btn-primary pull-right" style="margin-bottom: 25px; margin-top: 25px;" @click="showModal('create', null)">New Place</button> -->
    <table class="table mt-4 legend-table">
      <thead>
        <th scope="col" class="font-weight-bold alert-success legend">A passenger is COVID Negative</th>
        <th scope="col" class="font-weight-bold alert-info legend">A passenger is a Person Under Investigation</th>
        <th scope="col" class="font-weight-bold alert-warning legend">A passenger is a Person Under Monitoring</th>
        <th scope="col" class="font-weight-bold alert-danger legend">A passenger is COVID Positive</th>
      </thead>
    </table>
   <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <th class="text-center">Date</th>
        <th class="text-center">Plate Number</th>
        <th class="text-center">Driver's Username</th>
        <th class="text-center">Vehicle</th>
        <!-- <th scope="col">Vehicle Type</th>
        <th scope="col">Vehicle Model</th> -->
        <th class="text-center">Passengers</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-center">{{item.created_at}}</td>
          <td class="text-center">{{item.number}}</td>
          <td class="text-center">{{item.username}}</td>
          <td class="text-center">{{item.type}}</td>
          <td class=text-center>
            <button type="button" class="btn btn-primary" @click="selectedItem = item" data-toggle="modal" data-target="#passenger_list">
              <i class="fa fa-eye px-2"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
     <!--MODAL FOR PASSENGERS-->
    <div class="modal fade right" id="passenger_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content text-center">
          <div class="modal-header">
            <h5 class="heading pt-2">List of Passengers</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4" v-if="selectedItem !== null">
            <table class="table table-responsive table-bordered">
              <thead class="custom-header-color">
                <th class="text-center">Passenger's Username</th>
                <th class="text-center">Status</th>
              </thead>
             <tbody>
              <tr v-for="(item, index) in selectedItem.passengers" :key="index">
                <td>{{item.username}}</td>
                <td>{{item.status}}</td>
              </tr>
             </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";

.custom-header-color{
  color: $primary;
}

.legend {
  background-color: transparent !important;

  &::before {
    content: 'x';
    height: 5px;
    padding: 0 4px;
    font-size: 10px;
    background: currentColor;
    border-radius: 50px;
    margin-right: .5rem;
  }

  &-table thead th {
    border: none;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ModalProperty from 'src/modules/places/CreatePlaces.js'
export default {
  mounted(){
   // this.retrieve()
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      selectedItem: null,
      data: [{
        number: 'A00CB',
        username: 'Monica',
        type: 'Bus',
        created_at: '2020-3-3 8:00 AM',
        passenger: [{
          username: 'Therese',
          status: 'pui',
          created_at: '2020-3-3 8:00 AM'
        }]
      }]
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
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
        sort: sort
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
        console.log(response)
      })
    }
  }
}
</script>
