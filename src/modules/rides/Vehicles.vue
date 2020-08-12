<template>
  <div class="holder w-100">
    <div class="nav-buttons row">
      <button @click="showModal('create')" class="btn btn-primary">Add</button>
    </div>
    <div class="row w-100 m-0" v-if="data !== null">
      <div class="card card-half" v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;" >
        <div class="qr-code-container p-2">
          <div class="qr-code" v-if="item.code !== null">
            <QrcodeVue :value="common.APP_URL + '/#/transportations/' + item.code" :size="100"></QrcodeVue>
          </div>
          <div class="details">
            <label class="card-title">
              {{item.type}}
            </label>
            <label class="card-title">
              {{item.model}}
            </label>
            <label class="card-title">
              {{item.number}}
            </label>
          </div> 
          <button @click="showModal('create', item)" class="btn btn-primary mr-2" type="button" data-toggle="modal"><i class="fa fa-edit"></i></button>
          <button class="btn btn-secondary" @click="deleteId(item)" type="button"><i class="fa fa-trash"></i></button>
        </div>
      </div>
    </div>
    <empty v-if="data === null" :title="'No vehicles added!'" :action="'Add a vehicle.'" :icon="'far fa-building'" :iconColor="'text-danger'"></empty>
      <div class="modal fade right" id="delete" tabindex="-1" role="dialog" aria-labelledby="deleteHeader"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteheader">Delete Transportation</h5>
            <button type="button" class="close" aria-label="Close" data-dismiss="modal">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            Are you sure you want to delete this vehicle?
          </div>
          <div class="modal-footer">
            <button class="btn btn-dark" data-dismiss="modal">Cancel</button>
            <button class="btn btn-secondary" data-dismiss="modal" @click="deleteVehicle()">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <increment-modal :property="propertyModal"></increment-modal>
  </div>
</template>
<style lang="scss">
  .modal-backdrop {
  background-color: transparent;
  }
  .modal {
    background: rgba(0,0,0,0.6);
  }
</style>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}
.badge{
  margin-left: 5px;
}
.card-title{
  width: 100%;
  float: left;
}

.holder{
  float: left;
  margin-top: 25px;
}

.nav-buttons {
  width: 100%;
  padding: 0px .5%;
  margin: 0px 0px .5rem 0px;
  justify-content: flex-end;
}

.qr-code-container {
  display: flex;
}

.qr-code:hover{
  cursor: pointer;
  background: $primary;
}

.details{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  padding: 0 15px;
}

.form-control{
  height: 45px !important;
  margin-bottom: 25px;
}

.bg-black{
  background: #000000 !important;
  color: #ffffff !important;
  border: 0px;
}
input[type="number"] {
  -webkit-appearance: textfield;
    -moz-appearance: textfield;
          appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
}
.number-input {
    margin-bottom: 1rem;
    margin-left: 50rem;
    margin-right: 4rem;
    float: right;
}
.number-input button {
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0;
  position: relative;
}
.number-input button:before,
.number-input button:after {
  display: inline-block;
  position: absolute;
  content: '';
  height: 2px;
  transform: translate(-50%, -50%);
}
.number-input button.plus:after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.number-input input[type=number] {
  text-align: center;
}


.md-number-input.number-input {
  width: 11.8rem;
}
.md-number-input.number-input button {
  outline: none;
  width: 3rem;
  height: 2rem;
  padding-top: .8rem;
}
.md-number-input.number-input button.minus {
  padding-left: 8px;
}
.md-number-input.number-input button.plus {
  padding-left: 2px;
}
.md-number-input.number-input button:before,
.md-number-input.number-input button:after {
  width: 1rem;
  background-color: #212121;
}
.md-number-input.number-input input[type=number] {
  max-width: 5rem;
  padding: .5rem;
  border: solid #ddd;
  border-width: 0 2px;
  font-size: 2rem;
  height: 3rem;
  font-weight: bold;
  outline: none;
}

.card.card-half {
  width: 49%;
  margin: .5%;
}

.link {
  color: $success;
  cursor: pointer;
}

@media (max-width: 767px) {
  .card.card-half {
    width: 100%;
    margin: 0;
  }
  .nav-buttons {
    padding: 0px;
  }.nav-buttons {
    padding: 0px;
  }
}

@media not all and (min-resolution:.001dpcm)
{ @supports (-webkit-appearance:none) and (stroke-color:transparent) {
  .number-input.md-number-input.safari_only button:before, 
  .number-input.md-number-input.safari_only button:after {
    margin-top: -.6rem;
  }
}}
</style>
<script>
import PropertyVehicleModal from './createTransportations.js'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import QrcodeVue from 'qrcode.vue'
export default {
  mounted(){
    if(this.user.type !== 'ADMIN' && this.user.type !== 'BUSINESS' && this.user.type !== 'AGENCY_BRGY' && this.user.type !== 'AGENCY_GOV'){
      ROUTER.push('/dashboard')
    }
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null,
      item: null,
      propertyModal: PropertyVehicleModal
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    Pager,
    QrcodeVue
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    showModal(action, item = null){
      if(action === 'create') {
        console.log(action)
        this.propertyModal = {...PropertyVehicleModal}
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
      }
      if(item !== null) {
        console.log(item)
        let modalData = {...this.propertyModal}
        let parameter = {
          title: 'Update Transportation',
          route: 'transportations/update',
          button: {
            left: 'Cancel',
            right: 'Update'
          },
          params: [{
            variable: 'id',
            value: item.id
          }]
        }
        modalData = {...modalData, ...parameter}
        modalData.inputs.map(input => {
          if(input.variable === 'type') {
            input.value = item.type
          }
          if(input.variable === 'model') {
            input.value = item.model
          }
          if(input.variable === 'number'){
            input.value = item.number
          }
          this.propertyModal = {...modalData}
        })
      }
      $('#createTransportationsModal').modal('show')
    },
    deleteId(item){
      $('#delete').modal('show')
      this.item = item
    },
    deleteVehicle() {
      $('#loading').css({display: 'block'})
      this.APIRequest('transportations/delete', this.item).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve()
      })
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('transportations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.length = response.data.length
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>
