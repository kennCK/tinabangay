<template>
  <div class="container-fluid">
    <div v-if="$route.name !== 'symptomsReporting'" class="row">
      <div class="col-sm-6 feelings" v-for="(feelin, index) in symptoms" :key="feelin.value">
        <button 
          type="button" 
          v-bind:class="feelin.clicked ? 'btn feelingStyler' : 'btn btnfeeling'"
          @click="feelingsEvent(index)"
          :data-toggle=" symptoms[index].clicked ? 'modal' : '' "
          data-target="#confirmation"
          :title="feelin.label"
          v-b-popover.hover.right="feelin.description"
        >
          {{feelin.label}}
        </button>
      </div>
    </div>
    <div v-if="$route.name === 'symptomsReporting'" class="container-fluid symptomsReportingViewContainer">
      <br>
      <br>
      <div class="col-sm-12 symptomsReportingView">
        <div class="row">
          <div class="col-sm-3 symptoms">
            <div class="col-sm-12 feelingsBTNgroup">
              <p class="col-sm-12 alert alert-info symptomsQuest">
                Hi, <b>{{user.username}}!</b> How are you feeling today?
              </p>
              <div class="col-sm-12 feelings " v-for="(feelin, index) in symptoms" :key="feelin.value">
                <button 
                  type="button" 
                  v-bind:class="feelin.clicked ? 'btn feelingStyler' : 'btn btnfeeling'"
                  @click="feelingsEvent(index)"
                  :data-toggle=" feelings[index].clicked ? 'modal' : '' "
                  data-target="#confirmation"
                  :title="feelin.label"
                  v-b-popover.hover.right="feelin.description"
                >
                  {{feelin.label}}
                </button>
              </div>
              <br>
            </div>
          </div>
          <div class="col-sm-9 summaryS">
            <div class="ledger-summary-container summaryS tabledSummary" id="symptomsScroll">
              <table class="table table-bordered table-responsive " v-if="data !== null">
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
          </div>
        </div>
      </div>
    </div>

    <div class="modal"
      id="confirmation"
      role="dialog" 
      aria-labelledby="myModalLabel"
      aria-hidden="true"
      data-keyboard="false"
      data-backdrop="static"
    > 
      <div class="modal-dialog"> 
        <div class="modal-content"> 
          <div class="modal-body data">
            <span class="error text-danger" v-if="errorMessage !== null">
            <b>Oops!</b> {{errorMessage}}
            </span>
            <button class="close" data-dismiss="modal" @click="cancelReport"> 
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
                <textarea v-model="remarks" class="form-control" rows="4" id="comment"></textarea>
              </div>
            </div>
          </div>
          <center>
            <button 
            type="button" 
            class="btn btn-primary symptomsSubmit" 
            :data-dismiss=" validReport ? 'modal' : ''"
            data-toggle="modal" 
            data-target="#confirm"
            :disabled="valid"
            >submit
            </button>
          </center>
        </div> 
      </div> 
    </div>

    <div class="modal fade" id="confirm" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="confirmationHeader">
                  <center><i class="fas fa-exclamation-circle confirmationIcon"></i></center>
                  <hr>
                </div>
                <div class="modal-body confirmationBody">
                  <center>Are you sure you want to proceed?</center>
                  <br>
                </div>
                <div class="modal-footer">
                  <button data-dismiss="modal" class="btn btn-outline-danger confirmNo" @click="cancelReport">No</button>
                  <button data-dismiss="modal" class="btn btn-outline-primary confirmYes" @click="symptomsSubmit">Yes</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.confirmationIcon{
  font-size: 70px;
  color:#bd3a47;
} 
.confirmationHeader{
  padding-top:15px;
  padding-bottom:15px;
  text-align: center;
  margin:0px;
}
.confirmationBody{
  margin:0px;
  padding-top:0px;
}
.confirmYes{
  width: 70px;
  outline: none;
}
.confirmNo{
  width: 70px;
  outline: none;
}
.popover {
  white-space: pre-wrap;    
}
.mx-datepicker,
.mx-input-wrapper {
  width: unset;
  position: unset;
  display: unset;
}
.btnfeeling{
  width:100%;
  border:1px solid #005b96;
  font-size:12px;
  height:45px;
  border-radius: 0px;
  font-weight:bold;
  background-color:white;
  white-space: normal; 
  word-wrap: break-word;
}
.btnfeeling:focus{
  box-shadow: none!important;
}
.feelings{
  padding: 1px;
}
.feelingStyler{
  width:100%;
  border:1px solid #005b96;
  font-size:12px;
  height:45px;
  border-radius: 0px;
  font-weight:bold;
  color: white;
  background-color:#005b96;
  outline: none !important;
  white-space: normal; 
  word-wrap: break-word;
}
.feelingStyler:focus{
  box-shadow: none!important;
}
.feelingsBTNgroup{
  padding:0px !important;
}
.reference{
  margin:0px;
}
.referenceSection{
  padding: 0px;
}
.tabledSummary{
  max-height: 500px;
  overflow-y: scroll;
}
.symptoms{
  padding-left: 0px;
}
#symptomsScroll::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: white;
}

#symptomsScroll::-webkit-scrollbar
{
	width: 5px;
	background-color: white;
}

#symptomsScroll::-webkit-scrollbar-thumb
{
	background-color: #b0b0b0;
}
@media (min-width:575px) {
  .btnfeeling {
    font-size: 13px;
  }
  .feelingStyler{
    width:100%;
    border:1px solid #005b96;
    font-size:12px;
    height:45px;
    border-radius: 0px;
    font-weight:bold;
    color: white;
    background-color:#005b96;
    outline: none !important;
    white-space: normal; 
    word-wrap: break-word;
  }
  .feelingStyler:focus{
    box-shadow: none!important;
  }
}
@media(max-width: 575px){
  .symptoms{
    padding-left: 15px;
  }
}

@media (min-width:576px) {
  .btnfeeling {
    font-size: 7px;
    padding:1px;
    white-space: normal; 
    word-wrap: break-word;
  }
  .feelingStyler{
    width:100%;
    border:1px solid #005b96;
    font-size: 7px;
    padding:1px;
    height:45px;
    border-radius: 0px;
    font-weight:bold;
    color: white;
    background-color:#005b96;
    outline: none !important;
    white-space: normal; 
    word-wrap: break-word;
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
    border:1px solid #005b96;
    font-size: 9px;
    padding:1px;
    height:45px;
    border-radius: 0px;
    font-weight:bold;
    color: white;
    background-color:#005b96;
    outline: none !important;
    white-space: normal; 
    word-wrap: break-word;
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
    border:1px solid #005b96;
    font-size: 10px;
    height:45px;
    border-radius: 0px;
    font-weight:bold;
    color: white;
    background-color:#005b96;
    outline: none !important;
    white-space: normal; 
    word-wrap: break-word;
  }
  .feelingStyler:focus{
    box-shadow: none!important;
  }
}
.modalData{
  padding:40px;
}

.symptomsSubmit{
  width: 200px;
  outline: none;
  margin-bottom: 20px;
}
.symptomsSubmit:focus{
  width: 200px;
  outline: none;
  margin-bottom: 20px;
  color: white;
}
.summaryS{
  padding:0px;
  width: 100% !important;
}
.symptomsReportingView{
  padding:0px;
}
.symptomsReportingViewContainer{
  padding: 0px !important;
}
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

.ledger-summary-container{
  width: 100% !important;
  float: left;
  height: auto;
  margin-bottom: 100px;
  padding: 0px;
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

.table{
  margin-top:0px;
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
    let initialData = []
    this.feelings = COMMON.symptomsHealthDec.map((element, index) => {
      element['clicked'] = false
      return element
    })
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      date: null,
      remarks: null,
      validReport: true,
      index: null,
      config: CONFIG,
      propertyModal: PropertyModal,
      modalShow: true,
      feelings: [],
      errorMessage: null
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
      let d = new Date()
      d = new Date(d.getTime() - 3000000)
      var date = d.getFullYear().toString() + '-' + ((d.getMonth() + 1).toString().length === 2 ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1).toString()) + '-' + (d.getDate().toString().length === 2 ? d.getDate().toString() : '0' + d.getDate().toString())
      let validator = false
      if(this.date === null){
        validator = this.validReport
      }else if(this.date > date){
        this.errorMessage = 'Date is Advance!'
        validator = this.validReport
      }else{
        validator = !this.validReport
        this.errorMessage = null
      }
      return validator
    },
    show(){
      return this.modalShow
    }
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    feelingsEvent(index){
      this.feelings = this.feelings.filter((el, i) => {
        if (index === i) {
          el.clicked = !el.clicked
          this.index = index
        }
        return el
      })
    },
    cancelReport(){
      this.date = null
      this.remarks = null
      this.feelings = this.feelings.filter((el, i) => {
        if (this.index === i) {
          el.clicked = !el.clicked
        }
        return el
      })
    },
    symptomsSubmit(){
      let parameters = {
        account_id: this.user.userID,
        date: this.date,
        remarks: this.remarks,
        type: this.feelings[this.index].value
      }
      if(this.feelings[this.index].clicked){
        if(this.date !== null){
          this.APIRequest('symptoms/create', parameters).then(response => {
            // let temp = JSON.parse(localStorage.getItem('symptoms'))
            // temp.date = 'Today'
            // temp.push(parameters)
            // localStorage.setItem('symptoms', JSON.stringify(temp))
            // console.log('date ', this.date)
            // this.data = JSON.parse(localStorage.getItem('symptoms'))
            this.date = null
            this.remarks = null
            this.retrieve()
            // console.log(' saving local ', JSON.parse(localStorage.getItem('symptoms')))
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
      // if(localStorage.getItem('symptoms') === null || localStorage.getItem('symptoms') === undefined){
      $('#loading').css({display: 'block'})
      this.APIRequest('symptoms/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          // localStorage.setItem('symptoms', JSON.stringify(response.data))
        }else{
          this.data = null
          // localStorage.setItem('symptoms', JSON.stringify([]))
        }
      })
      // }else{
      //   this.data = (JSON.parse(localStorage.getItem('symptoms')).length < 1) ? null : JSON.parse(localStorage.getItem('symptoms'))
      // }
    },
    testing(){
      this.modalShow = !this.modalShow
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
