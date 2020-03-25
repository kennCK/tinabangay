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
      <select class="form-control select-range" v-model="range">
        <option value="all">--Choose Temperature Range--</option>
        <option value="hypotermia">Below 36.5</option>
        <option value="normal">36.5 - 37.5</option>
        <option value="fever">37.6 - 40.0</option>
        <option value="hyperpyrexia">Above 40.0</option>
      </select>
    </div>
    <!-- UNTIL HERE -->
     <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <th>Name</th>
        <th>Address</th>
        <th>Contact Number</th>
        <th>Temperature</th>
        <th>Temperature Taken At</th>
        <th>Date Taken</th>
        <th>Action</th>
      </thead>
      <tbody>
        <tr v-for="user in filteredLocation " v-bind:key="user">
          <td>{{user.last_name}}, {{users.first_name}}</td>
          <td>{{user.address}}</td>
          <td>{{user.contact_number}}</td>
          <td>{{user.temperature.value}}°</td>
          <td>{{user.temperature.location}}</td>
          <td>{{user.temperature.date_taken}}</td>
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
.select-range{
  width: 22%!important;
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
      users: [
        {
          id: 1,
          first_name: 'Allan',
          last_name: 'Bargamento',
          contact_number: '+639205024633',
          address: 'Consolacion',
          visited_places: [
            {
              locality: 'Babag 2',
              region: 'Lapulapu City, Cebu',
              country: 'Philippines',
              date: '2020-3-25',
              time: '9:30AM'
            },
            {
              locality: 'Timpolok',
              region: 'Lapulapu City, Cebu',
              country: 'Philippines',
              date: '2020-3-25',
              time: '12:30AM'
            }
          ],
          temperature: {
            value: 37,
            date_taken: '2020-3-26',
            location: 'Opon'
          }
        },
        {
          id: 2,
          first_name: 'Jeanille',
          last_name: 'Abayon',
          contact_number: '+639999024633',
          address: 'La Aldea Buena Mactan',
          visited_places: [
            {
              locality: 'Timpolok',
              region: 'Lapulapu City, Cebu',
              country: 'Philippines',
              date: '2020-3-25',
              time: '9:30AM'
            },
            {
              locality: 'Mandaue',
              region: 'Lapulapu City, Cebu',
              country: 'Philippines',
              date: '2020-3-25',
              time: '12:30AM'
            }
          ],
          temperature: {
            value: 35,
            date_taken: '2020-3-26',
            location: 'Mandaue'
          }
        },
        {
          id: 3,
          first_name: 'Ainz',
          last_name: 'Gown',
          contact_number: '+639999024633',
          address: 'La Aldea Buena Mactan',
          visited_places: [
            {
              locality: 'Timpolok',
              region: 'Lapulapu City, Cebu',
              country: 'Philippines',
              date: '2020-3-25',
              time: '9:30AM'
            },
            {
              locality: 'Mandaue',
              region: 'Lapulapu City, Cebu',
              country: 'Philippines',
              date: '2020-3-25',
              time: '12:30AM'
            }
          ],
          temperature: {
            value: 37,
            date_taken: '2020-3-26',
            location: 'Mandaue'
          }
        }
      ],
      // data: null,
      message: 'Test message',
      messageFlag: true,
      search: '',
      checktemp: false,
      range: 'all'
    }
  },
  // JER CHANGES
  computed: {
    filteredLocation: function(){
      var range = this.range
      return this.users.filter((users) => {
        var search = this.search.toLowerCase()
        var loc = users.temperature.location.toLowerCase()
        if(range === 'hypotermia'){
          return (loc.match(search) && users.temperature.value < 36.5)
        }else if(range === 'normal'){
          return (loc.match(search) && (users.temperature.value >= 36.5 && users.temperature.value <= 37.5))
        }else if(range === 'fever'){
          return (loc.match(search) && (users.temperature.value >= 37.6 && users.temperature.value <= 40.0))
        }else if(range === 'hyperpyrexia'){
          return (loc.match(search) && users.temperature.value > 40.0)
        }else{
          return loc.match(search)
        }
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
