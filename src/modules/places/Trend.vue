<template>
  <div>
  
     <h1 v-if="messageFlag === true">{{message}}</h1>
    <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <td>Data</td>
      
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
         <td>
            <div class="card">
                <div class="row">
                  <div class="col-md-4 bg-info text-center" style="font-size: 25px;">
                  
                       {{item.size}}
                  </div>
                  <div class="col-md-8 px-3">
                       <div class="card-block px-3">
                            <h4 class="card-title" style="font-size: 25px;">{{item.route}}</h4>
                            <p class="card-text" style="font-size: 16px;">POSITIVE : {{item.positive_size}} | PUI : {{item.pui_size}} | PUM : {{item.pum_size}}</p>
                            <p class="card-text">{{item.locality === 'testin' ? 'true' : item.locality}} , {{item.country}}</p>
                        </div> 
                   </div> 
                </div>
             </div> 
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
