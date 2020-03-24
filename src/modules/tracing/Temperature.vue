<template>
  <div>
    <button class="btn btn-primary pull-right" style="margin-bottom: 25px; margin-top: 25px;" @click="showModal('create', null)">New Place</button>
    <button class="btn btn-primary" @click="hideMessage()">Hide Message</button>
    <h1 v-if="messageFlag === true">{{message}}</h1>
    <h2 v-else>You hide me: {{message}}</h2>
    <!-- JER CHANGES -->
    <br>
    <div class="form-group">
      <input type="text" class="form-control" v-model="search" placeholder="Search Location">
    </div>
    <!-- UNTIL HERE -->
    <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <td>Username</td>
        <td>Address</td>
        <td>Location</td>
        <td>Temperature</td>
        <td>Date Taken</td>
        <td>Contact Number</td>
        <td>Action</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredLocation" :key="index">
          <!-- JER CHANGES -->
          <td>{{item.username}}</td>
          <td>{{item.address}}</td>
          <td>{{item.location}}</td>
          <td>{{item.temperature}}</td>
          <td>{{item.temperature_taken}}</td>
          <td>{{item.contact_no}}</td>
          <td>
            <button class="btn btn-primary" @click="showModal('update', item)">
              Show Visited Places
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
// JER CHANGES
.form-control{
  width: 30%!important;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import ModalProperty from 'src/modules/places/CreatePlaces.js'
export default {
  // JER CHANGES
  // mounted(){
  //   this.retrieve()
  // },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      modalProperty: ModalProperty,
      // JER CHANGES
      data: [{
        username: 'Allan12345',
        address: 'Cansaga, Consolacion Cebu',
        location: 'Mandaue',
        temperature: 37.8,
        temperature_taken: 31520,
        contact_no: 9458034816
      },
      {
        username: 'Jeanille',
        address: 'Lapu-lapu Cebu',
        location: 'Ayala',
        temperature: 35.8,
        temperature_taken: 31520,
        contact_no: 9555531254
      },
      {
        username: 'Ainz',
        address: 'Oslob Cebu',
        location: 'Mandaue',
        temperature: 35.8,
        temperature_taken: 31520,
        contact_no: 9258945611
      }],
      // data: null,
      message: 'Test message',
      messageFlag: true,
      search: ''
    }
  },
  // JER CHANGES
  computed: {
    filteredLocation: function(){
      return this.data.filter((data, checktemp) => {
        return data.location.match(this.search)
      })
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    hideMessage(){
      this.messageFlag = false
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
      // JER CHANGES
      this.APIRequest('tracing_temperatures/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    },
    removeItem(id){
      let parameter = {
        id: id
      }
      $('#loading').css({display: 'block'})
      // JER CHANGES
      this.APIRequest('tracing_temperatures/delete', parameter).then(response => {
        this.retrieve()
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
            // JER CHANGES
            route: 'tracing_temperatures/update',
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
            if(data.variable === 'longitude'){
              data.value = item.longitude
            }
            if(data.variable === 'latitude'){
              data.value = item.latitude
            }
            if(data.variable === 'country'){
              data.value = item.country
            }
            if(data.variable === 'locality'){
              data.value = item.locality
            }
            if(data.variable === 'region'){
              data.value = item.region
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
