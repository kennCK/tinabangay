<template>
  <div class="mx-3">
    <button class="btn btn-primary pull-right" style="margin-bottom: 25px; margin-top: 25px;" @click="showModal('create', null)">New Place</button>
    <table class="table table-responsive table-bordered">
      <thead>
        <th scope="col" class="font-weight-bold alert-success">COVID Negative</th>
        <th scope="col" class="font-weight-bold alert-info">Person Under Investigation</th>
        <th scope="col" class="font-weight-bold alert-warning">Person Under Monitoring</th>
        <th scope="col" class="font-weight-bold alert-danger">COVID Positive</th>
      </thead>
    </table>
   <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <th scope="col">Country</th>
        <th scope="col">Region</th>
        <th scope="col">Locality</th>
        <th scope="col">Date</th>
        <th scope="col">Time</th>
        <th scope="col">Action</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index" :class="item.status === 'negative' ? 'alert-success' : item.status === 'positive' ? 'alert-danger' : item.status === 'pui' ? 'alert-info' : 'alert-warning'">
          <td>{{item.country}}</td>
          <td>{{item.region}}</td>
          <td>{{item.locality}}</td>
          <td>{{item.date | formatDate}}</td>
          <td>{{item.date+' '+item.time | formatTime}}</td>
          <td>
            <button class="btn btn-primary" @click="showModal('update', item)">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <increment-modal :property="modalProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import ModalProperty from './CreatePlaces.js'
import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
})

Vue.filter('formatTime', function(value){
  if(value) {
    return moment(String(value)).format('hh:mm A')
  }
})

export default {
  mounted(){

    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      modalProperty: ModalProperty,
      data: null,
      searchLocation: '',
      location: {
        route: null,
        locality: null,
        region: null,
        country: null,
        latitude: 0,
        longitude: 0,
        status: null,
        date: null,
        time: null
      }
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        condition: [{
          clause: '=',
          column: 'account_id',
          value: this.user.userID
        }],
        sort: {
          locality: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('visited_places/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    },
    showModal(action, item = null){
      switch(action){
        case 'create':
          this.modalProperty = {...ModalProperty}
          let inputs = this.modalProperty.inputs
          inputs.map(input => {
            input.value = null
          })
          this.modalProperty.params[0].value = this.user.userID
          break
        case 'update':
          let modalData = {...this.modalProperty}
          let parameter = {
            title: 'Update Requests',
            route: 'visited_places/update',
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
              value: item.id
            }]
          }
          modalData = {...modalData, ...parameter} // updated data without
          let object = Object.keys(item)
          modalData.inputs.map(data => {
            if(data.variable === 'location') {
              data.value = item.route + ', ' + item.locality + ', ' + item.country
            }
            if(data.variable === 'date'){
              data.value = item.date
            }
            if(data.variable === 'time'){
              data.value = item.time
            }
          })
          this.modalProperty = {...modalData}
          break
      }
      $('#createPlacesModal').modal('show')
    }
  }
}
</script>
