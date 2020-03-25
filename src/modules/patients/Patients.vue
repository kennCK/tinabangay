<template>
  <div>
    <table class="table table-responsive table-bordered">
      <thead class="custom-header-color">
        <th colspan="3" class="text-center">Patient's Name</th>
        <th colspan="3" class="text-center">Location</th>
        <th class="text-center">Status</th>
        <th class="text-center">Temperature</th>
        <th class="text-center">Date Recorded</th>
        <th  colspan="2" class="text-center">Action</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.first_name}}</td>
          <td>{{item.middle_name}}</td>
          <td>{{item.last_name}}</td>
          <td>{{item.country}}</td>
          <td>{{item.region}}</td>
          <td>{{item.locality}}</td>
          <td class="text-warning text-center">{{item.status}}</td>
          <td class="text-danger text-center">{{item.temperature_value}}</td>
           <td class="text-info text-center">{{item.created_at}}</td>
          <td>
            <button class="btn btn-primary justify-content-center align-items-center" @click="showModal('update', item)">
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
import ModalProperty from 'src/modules/patients/UpdatePatient.js'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      // if(this.user.type == 'AGENT');
      common: COMMON,
      user: AUTH.user,
      modalProperty: ModalProperty,
      data: [{
        first_name: 'Monica Claire',
        middle_name: 'Mamalias',
        last_name: 'Apor',
        country: 'Philippines',
        region: 'Region VII',
        locality: 'Mandaue City',
        status: 'PUI',
        temperature_value: '37.6',
        created_at: '2020-03-19'
      }, {
        first_name: 'Nicole Amber',
        middle_name: 'Gonzales',
        last_name: 'Mariscal',
        country: 'Philippines',
        region: 'Region VII',
        locality: 'Cebu City',
        status: 'PUM',
        temperature_value: '38.6',
        created_at: '2020-03-21'
      }, {
        first_name: 'Mary Therese',
        middle_name: 'Sun',
        last_name: 'Alegre',
        country: 'Philippines',
        region: 'Region VII',
        locality: 'Lapu-Lapu City',
        status: 'POSITIVE',
        temperature_value: '40.6',
        created_at: '2020-03-20'
      }, {
        first_name: 'Leah Joyce',
        middle_name: 'Gonzales',
        last_name: 'Bancale',
        country: 'Philippines',
        region: 'Region VII',
        locality: 'Danao City',
        status: 'NEGATIVE',
        temperature_value: '36.6',
        created_at: '2020-03-24'
      }, {
        first_name: 'James Michael',
        middle_name: 'Gonzales',
        last_name: 'Bañes',
        country: 'Philippines',
        region: 'Region VII',
        locality: 'Toledo City',
        status: 'POSITIVE',
        temperature_value: '39.6',
        created_at: '2020-03-20'
      }],
      message: 'Test message',
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
        this.retrieve()
      })
    },
    showModal(action, item = null){
      switch(action){
        // case 'create':
        //   this.modalProperty = {...ModalProperty}
        //   let inputs = this.modalProperty.inputs
        //   inputs.map(input => {
        //     input.value = null
        //   })
        //   this.modalProperty.params[0].value = this.user.userID
        //   break
        case 'update':
          let modalData = {...this.modalProperty}
          let parameter = {
            title: 'Update Requests',
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
              value: item.id
            }]
          }
          modalData = {...modalData, ...parameter} // updated data without
          let object = Object.keys(item)
          modalData.inputs.map(data => {
            if(data.variable === 'status'){
              data.value = item.status
            }
            if(data.variable === 'date'){
              data.value = item.created_at
            }
          })
          this.modalProperty = {...modalData}
          break
      }
      $('#updatePatientModal').modal('show')
    }
  }
}
</script>
