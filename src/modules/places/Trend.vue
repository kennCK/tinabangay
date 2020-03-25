<template>
  <div>
    <button class="btn btn-primary pull-right" style="margin-bottom: 25px; margin-top: 25px;" @click="showModal('create', null)">New Place</button>
    <button class="btn btn-primary" @click="hideMessage()">Hide Message</button>
    <h1 v-if="messageFlag === true">{{message}}</h1>
    <h2 v-else>You hide me: {{message}}</h2>
    <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <td>Country</td>
      
   
        <td>Action</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
         <td>
            
             
                   <span class="bg-info text-light d-inline rounded-circle p-2 font-weight-bold" style="font-size: 22px ,height: 25px, width: 25px;">{{item.size}}</span>
    
                  <h5 class="card-title" style="font-size: 25px;">{{item.route}}</h5>
                   <p class="card-text">{{item.locality === 'testin' ? 'true' : item.locality}} , {{item.country}}</p>
                   
       
        
        </td>

          <td>
            <button class="btn btn-primary" @click="showModal('update', item)">
              <i class="fas fa-edit"></i>
            </button>

            <button class="btn btn-danger" @click="removeItem(item.id)">
              <i class="fas fa-trash"></i>
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
      message: 'High risk areas',
      messageFlag: true
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
        status: 'positive'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tracing_places/places', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    },
    removeItem(id){
      let parameter = {
        id: id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('visited_places/delete', parameter).then(response => {
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
            if(data.variable === 'PositiveCount'){
              data.value = item.PositiveCount
            }
            if(data.variable === 'PUICount'){
              data.value = item.PUICount
            }
            if(data.variable === 'PUMCount'){
              data.value = item.PUMCount
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
