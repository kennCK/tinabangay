<template>
  <div class="ledger-summary-container">
    <button class="btn btn-primary pull-right" style="margin-bottom: 25px;" @click="showModal('create')">New Report</button>
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead class="bg-primary">
        <tr>
          <td>Date</td>
          <td>Type</td>
          <td>Remarks</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.date_human}}</td>
          <td>
            <label class="text-uppercase">{{item.type}}</label>
          </td>
          <td>{{item.remarks}}</td>
        </tr>
      </tbody>
    </table>

    <increment-modal :property="propertyModal"></increment-modal>
    <empty v-if="data === null" :title="'No symptoms reported!'" :action="'Stay safe and report your symptoms to help us flatten the curve againts covid19.'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

.ledger-summary-container{
  width: 100%;
  float: left;
  height: auto;
  margin-bottom: 100px;
  margin-top: 25px;
}

.ledger-summary-container-header{
  width: 100%;
  float: left;
  height: 70px;
  border: solid 1px #ddd;
}
.summary-container-item{
  width: 100%;
  float: left;
  border-radius: 5px;
  min-height: 50px;
  overflow-y: hidden;
  border: solid 1px #ddd;
  margin-top: 10px;
  padding-left: 10px;
}

td i {
  padding-right: 0px !important;
  padding-left: 0px !important;
}

@media (max-width: 992px){
  .ledger-summary-container{
    width: 100%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import PropertyModal from './CreateSymptom.js'
export default{
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      config: CONFIG,
      propertyModal: PropertyModal
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue')
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }],
        sort: {
          date: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('symptoms/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    showModal(action, item = null){
      switch(action){
        case 'create':
          this.propertyModal = {...PropertyModal}
          let inputs = this.propertyModal.inputs
          inputs.map(input => {
            input.value = null
          })
          let params = this.propertyModal.params
          params.map(param => {
            if(param.variable === 'account_id'){
              param.value = this.user.userID
            }
          })
          break
      }
      $('#createSymptomModal').modal('show')
    }
  }
}
</script>
