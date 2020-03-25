<template>
  <div>
    
    <h1>Temperature Summary</h1>
    <br>
    <div class="input-group">
      <input type="text" class="form-control" v-model="search" placeholder="Search Location">
      <div class="input-group-append">
      <select class="form-control select-range" v-model="range">
        <option value="all">--Choose Temperature Range--</option>
        <option value="all">All</option>
        <option value="hypotermia">Below 36.5</option>
        <option value="normal">36.5 - 37.5</option>
        <option value="fever">37.6 - 40.0</option>
        <option value="hyperpyrexia">Above 40.0</option>
      </select>
      </div>
    </div>


    <div class="card-body" style=' overflow-y: auto; height: auto;'>
      <table class="table table-responsive table-bordered">
        <thead class="custom-header-color">
          <th style='text-align: center;'>Name</th>
          <th style='text-align: center;'>Address</th>
          <th style='text-align: center;'>Contact Number</th>
          <th style='text-align: center;'>Temperature</th>
          <th style='text-align: center;'>Location</th>
          <th style='text-align: center;'>Date Taken</th>
          <th style='text-align: center;'>Action</th>
        </thead>
        <tbody>
          <tr v-for="(u, index) in filteredLocation" v-bind:key="index">
            <td>{{u.last_name}}, {{u.first_name}}</td>
            <td>{{u.address}}</td>
            <td>{{u.contact_number}}</td>
            <td>{{u.temperature.value}}°</td>
            <td>{{u.temperature.location}}</td>
            <td>{{u.temperature.date_taken}}</td>
            <td style='text-align: center;'>
              <button class='btn btn-primary' data-toggle="modal" @click="selected_user = u" data-target="#visitedPlaces">
                <i style='padding: 2px;' class="fa fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

    <!-- VISITED PLACES MODAL -->
      <div class="modal fade" id='visitedPlaces' tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" >Visited Places</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          <div class="modal-body" >
            <div v-if="selected_user!=null">
              <table class="table">
                <thead class="custom-header-color">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Locality</th>
                    <th scope="col">Country</th>
                  </tr>
                </thead>
                <tbody style='height: 300px; overflow-y:auto;'>
                  <tr v-for="(place, index) in selected_user.visited_places" v-bind:key="index">
                    <td>{{place.date}}</td>
                    <td>{{place.time}}</td>
                    <td>{{place.locality}}</td>
                    <td>{{place.country}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
       </div>
      </div>
      
    </div>
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
  width: 100%!important;
}

.input-group{
  width: 50%;
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
      selected_user: null,
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
            }
          ],
          temperature: {
            value: 36,
            date_taken: '2020-3-26',
            location: 'Opon'
          }
        }
      ],
      // data: null,
      message: 'Test message',
      messageFlag: true,
      search: '',
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
