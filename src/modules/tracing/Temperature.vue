<template>
  <div>
    
    <h1>Temperature Summary</h1>
    <br>

    
    <div class="card-body" >
      <div class='row'>
        <div class='col-lg-8 col-sm-12 col-xs-12'>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button class='btn btn-warning' style='pointer-events: none;'>Search Location</button>
              </div>
              <input type="text" class="form-control " v-model="search" placeholder='e.g. Mandaue' >
              <div class="input-group-prepend ml-2">
                <button class='btn btn-warning' style='pointer-events: none;'>Sort by Temperature</button>
              </div>
              <select class="form-control custom-select" v-model="range">
                <option value="all">All</option>
                <option value="hypotermia">Below 36.5</option>
                <option value="normal">36.5 - 37.5</option>
                <option value="fever">37.6 - 40.0</option>
                <option value="hyperpyrexia">Above 40.0</option>
            </select>
            </div>
        </div>
      </div>
    

      <table class="table table-responsive table-bordered">
        <thead>
          <th style='text-align: center;'>Username</th>
          <th style='text-align: center;'>Contact Number</th>
          <th style='text-align: center;'>Temperature</th>
          <th style='text-align: center;'>Route</th>
          <th style='text-align: center;'>Location</th>
          <th style='text-align: center;'>Taken by</th>
          <th style='text-align: center;'>Date Taken</th>
          <!-- <th style='text-align: center;'>Action</th> -->
        </thead>
        
            <tbody>
            <tr v-for="user in filteredLocation" v-bind:key="user">
              <td>{{user.account.username}}</td>
              <td>{{user.account.information.cellular_number}}</td>
              <td>{{user.value}}</td>
              <td>{{user.route}}</td>
              <td>{{user.locality}}</td>
              <td>{{user.added_by_account.username}}</td>
              <td>{{user.created_at}}</td>
              <!-- <td style='text-align: center;'>
                <button class='btn btn-primary' data-toggle="modal" @click="selected_user = u" data-target="#visitedPlaces">
                  <i style='padding: 2px;' class="fa fa-eye"></i>
                </button>
              </td> -->
            </tr>
            </tbody>
        
      </table>

    <!-- VISITED PLACES MODAL -->
      <!-- <div class="modal fade" id='visitedPlaces' tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
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
                    <th >Date</th>
                    <th >Time</th>
                    <th >Locality</th>
                    <th >Country</th>
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
      </div> -->
      
    </div>
    <increment-modal :property="modalProperty"></increment-modal>
  </div>

  
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}

.btn, .btn-primary, .select-btn, .dropdown{
  border-radius: 0;
}

table{
  margin-top: 2%;
  width: 100%;
}

table thead{
  color: white;
  background-color:  rgb(0, 91, 150);
  
}

table thead th{
  font-weight: normal;
  padding: 10px;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import ModalProperty from 'src/modules/places/CreatePlaces.js'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      modalProperty: ModalProperty,
      selected_user: null,
      data: null,
      message: 'Test message',
      messageFlag: true,
      search: '',
      range: 'all'
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
      this.APIRequest('temperatures/summary?locality=Cebu City&temperature=35', parameter).then(response => {
        console.log('THESE ARE THE DATA!!')
        console.log(response.data)
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    },
    removeItem(id){
      let parameter = {
        id: id
      }
      $('#loading').css({display: 'block'})
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
  },
  computed: {
    filteredLocation: function(){
      var range = this.range
      return this.data.filter(data => {
        var search = this.search.toLowerCase()
        var loc = data.route.toLowerCase()
        if(range === 'hypotermia'){
          return (loc.match(search) && data.value < 36.5)
        }else if(range === 'normal'){
          return (loc.match(search) && (data.value >= 36.5 && data.value <= 37.5))
        }else if(range === 'fever'){
          return (loc.match(search) && (data.value >= 37.6 && data.value <= 40.0))
        }else if(range === 'hyperpyrexia'){
          return (loc.match(search) && data.value > 40.0)
        }else{
          return loc.match(search)
        }
      })
    }
  }
}
</script>
