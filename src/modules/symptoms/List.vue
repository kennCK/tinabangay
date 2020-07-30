<template>
  <!-- <div class="ledger-summary-container">
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
  </div> -->
  <div>
    <div>
      <div class="row symptomsD">
        <div class="col-sm-6 feelings" v-for="(feelin, index) in symptoms" :key="feelin.name">
          <button 
            type="button" 
            v-bind:class="feelings[index].clicked ? 'btn feelingStyler' : 'btn btnfeeling'"
            @click="feelingsEvent(index)"
            :data-toggle=" feelings[index].clicked ? 'modal' : '' "
            data-target="#confirmation"
          >
            {{feelin.name}}
          </button>
        </div>
      </div>
    </div>
    <div class="modal"
      id="confirmation"
      role="dialog" 
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    > 
      <div class="modal-dialog"> 
        <div class="modal-content"> 
          <div class="modal-body data"> 
            <button class="close" data-dismiss="modal"> 
                × 
              </button>  
            <br>
            <br>
            <div class="row">
                <div class="col-sm-3">
                  <p>Date Started:<i style="color:red;">*</i></p>
                </div>
                <div class="col-sm-9">
                  <date-picker 
                    v-model="date" 
                    valueType="format"
                    :input-attr="{style: 'width: 100% !important'}"
                  >
                  </date-picker>
                </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <p>Remarks:</p>
                <textarea class="form-control" rows="4" id="comment"></textarea>
              </div>
            </div>
          </div>
          <center>
            <button 
            type="button" 
            class="btn symptomsSubmit" 
            :data-dismiss=" validReport ? 'modal' : ''"
            @click="symptomsSubmit"
            :disabled="valid"
            >submit
            </button>
          </center>
        </div> 
      </div> 
    </div> 
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.mx-datepicker,
.mx-input-wrapper {
  width: unset;
  position: unset;
  display: unset;
}
.btnfeeling{
  width:100%;
  border:1px solid #bd3a47;
  font-size:12px;
  height:35px;
  border-radius:20px;
  font-weight:bold;
  background-color:white;
}
.btnfeeling:focus{
  box-shadow: none!important;
}
.feelings{
  padding:2px;
}
.feelingStyler{
  width:100%;
  border:1px solid #bd3a47;
  font-size:12px;
  height:35px;
  border-radius:20px;
  font-weight:bold;
  color: white;
  background-color:#bd3a47;
  outline: none !important;
}
.feelingStyler:focus{
  box-shadow: none!important;
}
.symptomsD{
  padding-right: 11px;
  padding-left: 11px;
}

@media (min-width:575px) {
  .btnfeeling {
    font-size: 13px;
  }
  .feelingStyler{
  width:100%;
  border:1px solid #bd3a47;
  font-size:12px;
  height:35px;
  border-radius:20px;
  font-weight:bold;
  color: white;
  background-color:#bd3a47;
  outline: none !important;
}
.feelingStyler:focus{
  box-shadow: none!important;
}
}

@media (min-width:576px) {
  .btnfeeling {
    font-size: 7px;
    padding:1px;
  }
  .feelingStyler{
    width:100%;
    border:1px solid #bd3a47;
    font-size: 7px;
    padding:1px;
    height:35px;
    border-radius:20px;
    font-weight:bold;
    color: white;
    background-color:#bd3a47;
    outline: none !important;
  }
  .feelingStyler:focus{
    box-shadow: none!important;
  }
}

@media (min-width:768px) {
  .btnfeeling {
    font-size: 9px;
    padding:1px;
  }
  .feelingStyler{
    width:100%;
    border:1px solid #bd3a47;
    font-size: 9px;
    padding:1px;
    height:35px;
    border-radius:20px;
    font-weight:bold;
    color: white;
    background-color:#bd3a47;
    outline: none !important;
  }
  .feelingStyler:focus{
    box-shadow: none!important;
  }
}

@media (min-width:1000px) {
  .btnfeeling {
    font-size: 10px;
  }
  .feelingStyler{
    width:100%;
    border:1px solid #bd3a47;
    font-size: 10px;
    height:35px;
    border-radius:20px;
    font-weight:bold;
    color: white;
    background-color:#bd3a47;
    outline: none !important;
  }
  .feelingStyler:focus{
    box-shadow: none!important;
  }
}
.modalData{
  padding:40px;
}

.symptomsSubmit{
  width: 170px;
  outline: none;
  border-radius: 20px;
  margin-bottom: 40px;
  box-shadow: 0px 0px 70px #bfbfbf;
  border: 1px solid #dc3545;
}
.symptomsSubmit:focus{
  width: 170px;
  outline: none;
  border: 1px solid #dc3545;
  box-shadow: 0px 0px 30px #bfbfbf;
  border-radius: 20px;
  margin-bottom: 40px;
  background-color: #dc3545;
  color: white;
}

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
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default{
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      date: null,
      validReport: true,
      index: null,
      config: CONFIG,
      propertyModal: PropertyModal,
      feelings: [
        {
          name: 'Fever',
          clicked: false
        },
        {
          name: 'Diarrhea',
          clicked: false
        },
        {
          name: 'Sore Throat',
          clicked: false
        },
        {
          name: 'Colds',
          clicked: false
        },
        {
          name: 'Loss of sense of taste/smell',
          clicked: false
        }
      ]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    DatePicker
  },
  computed: {
    symptoms(){
      return this.feelings
    },
    valid(){
      let validator = false
      if(this.date === null){
        validator = this.validReport
      }else{
        validator = !this.validReport
      }
      return validator
    }
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    feelingsEvent(index){
      this.feelings.filter((el, i) => {
        if (index === i) {
          el.clicked = !el.clicked
          this.index = index
          return el
        }
      })
    },
    symptomsSubmit(){
      let parameters = {
        account_id: this.user.userID,
        date: this.date,
        remarks: '',
        type: this.feelings[this.index].name
      }
      if(this.feelings[this.index].clicked){
        if(this.date !== null){
          this.APIRequest('symptoms/create', parameters).then(response => {
            console.log(response)
          })
        }else{
          this.validReport = !this.validReport
        }
      }
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
        console.log(response.data)
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
