<template>
  <div class="container-fluid">
    <div class="row" style="padding: 0px;">
      <data-summary></data-summary>
    </div>
    <br>
    <div class="row">
      <div class="col-sm-5" style="padding: 3px;">
        <div class="card symptomsCard">
          <div class="card-body">
            <div class="col-sm-12 feelingsGroup">
              <p class="col-sm-12 alert alert-info">
                Hi, <b>{{user.username}}!</b> How are you feeling today?
              </p>
              <symptoms></symptoms>
              <div class="col-sm-12 d-flex justify-content-sm-start symptomsStatus" v-if="status !== null">
                <div class="statusIcon">
                  <i :class="status.icon"></i>
                </div>
                <div>
                  STATUS : {{status.status_label}}
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
      <div class="col-sm-7" style="padding: 3px;">
        <div class="card qrCard">
          <div class="card-body">
            <p class="col-sm-12 alert alert-info">
              Hi <b>{{user.username}}</b>! Below is your QR code. Show this to frontliners everytime they read your temperature or show this to DOH authorized personnel.
            </p>
            <div v-if="user.code !== null" class="user_qrcode row justify-content-center pt-5">
              <QrcodeVue :value="`account/${user.code}`" :size="200"></QrcodeVue>
            </div>
            <br>
            <center>
              <qr-code-scanner 
              :state="qrScannerState" 
              @toggleState="(newState) => qrScannerState = newState"
              >
              </qr-code-scanner>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<style scoped lang="scss">
  @import "~assets/style/colors.scss";
  .feelingsGroup{
    padding: 0px;
  }
  .user_status_container{
    text-align: center;
    background:#facf32;
    padding-top:5px;
    padding-bottom:5px;
    margin-bottom:-10px;
    margin-top:30px;
  }
  .symptomsStatus{
  margin-top: 20px;
  border: 1px solid #f5f5f5;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.statusIcon{
  margin-right: 10px;
  padding-left: 10px;
}
.symptomsQuest{
  margin-bottom: 3px;
}
.noSymptoms{
  font-size: 50px;
  color: #0e44e6;
}
.symptoms12{
  font-size: 50px;
  color: #28a100;
}
.symptoms34{
  font-size: 50px;
  color: #f2db0f;
}
.symptoms56{
  font-size: 50px;
  color: #d6a40d;
}
.symptoms78{
  font-size: 50px;
  color: #d90202;
}
.trend{
  padding: 0px;
}
.viewMoreTestBtn{
  height:40px;
  width:100%;
  padding:0px;
  padding-bottom:2px;
}
.viewMoreTestBtn:focus{
  box-shadow:none !important;
  outline:none !important;
}
.user_qrcode{
  padding-top: 5px !important;
}
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import ROUTER from 'src/router'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      selected: [],
      warn: [
        {title: 'Looks like you\'re doing fine!', text: 'Always remember to practice social distancing, wash your hands, and stay at home!'},
        {title: 'Uh oh! Looks like you have a symptom.', text: 'Take it easy, get some rest. It might be a good idea to self-isolate until it subsides.'},
        {title: 'You have a couple symptoms.', text: 'Isolate yourself and get some rest. If your condition doesn\'t improve, consider seeing a doctor.'},
        {title: 'You have a lot of symptoms.', text: 'Consider seeing a doctor and getting tested. Wear a mask and isolate yourself from others.'}
      ],
      user: AUTH.user,
      symtomsFontSize: 0,
      common: COMMON,
      qrScannerState: false,
      status: null,
      label: null,
      result: null,
      limit: 5,
      qrLocation: 'top',
      options: [
        { text: 'Fever', value: 0, description: 'In most adults, an oral or axillary temperature above 37.6°C or a rectal or ear temperature above 38.1°C (100.6°F) is considered a fever. A child has a fever when his or her rectal temperature is 38°C or higher or armpit (axillary) temperature is 37.6°C or higher.' },
        { text: 'Colds', value: 0, description: 'Cold symptoms peak at 1 to 3 days. The main symptoms include sore throat, stuffy nose, runny nose, cough, discomfort, sneezing, fever (more common in children), headaches, clear, watery discharge from your nose (mucus), and body aches.' },
        { text: 'Diarrhea', value: 0, description: 'Diarrhea is characterized by loose, watery stools or a frequent need to have a bowel movement. It usually lasts a few days and often disappears without any treatment. Diarrhea can be acute or chronic.' },
        { text: 'Loss of sense of taste/smell', value: 0, description: 'Up to 80% of people who test positive for COVID-19 have subjective complaints of smell or taste loss. That percentage rises when these patients are tested using objective methods that measure smell function. Most patients first notice problems with their sense of smell, but because smell is necessary to taste flavor, the symptoms are often connected.' },
        { text: 'Sore Throat', value: 0, description: 'Sore throat is a very common and non-specific symptom (aka, a symptom that is self-reported and doesn\'t indicate a specific disease) and will feel the same whether you have a cold, the flu, coronavirus, or even strep throat. That means if you experience one, it can be difficult to determine whether it is COVID-related based solely on the symptom alone. However, due to the low percentage of individuals with confirmed cases of the virus listing it as a symptom, it is more likely that it\'s not COVID-related. ' }]
    }
  },
  components: {
    QrcodeVue,
    'qr-code-scanner': require('modules/scan/QrCodeScanner.vue'),
    'symptoms': require('modules/symptoms/List.vue'),
    'data-summary': require('modules/dashboard/Summary.vue')
  },
  methods: {
    feelingsEvent(index){
      this.feelings.filter((el, i) => {
        if (index === i) {
          el.clicked = !el.clicked
          return el
        }
      })
    },
    retrieve(){
      let parameter = {
        id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tracings/status', parameter).then(response => {
        $('#loading').css({display: 'none'})
        let status = response.data
        if(status.status === 'negative'){
          status.icon = 'fas fa-smile noSymptoms'
        }else if(status.status === 'recovered'){
          status.icon = 'far fa-smile symptoms12'
        }else if(status.status === 'lsi'){
          status.icon = 'fas fa-meh symptoms34'
        }else if(status.status === 'pum'){
          status.icon = 'fas fa-frown symptoms56'
        }else if(status.status === 'positive'){
          status.icon = 'fas fa-sad-tear symptoms78'
        }
        this.status = status
        this.createLabel()
      })
    },
    createLabel(){
      switch(this.status.status){
        case 'positive':
          this.label = 'User is COVID-Positive'
          break
        case 'pui':
          this.label = 'User is a PUI'
          break
        case 'pum':
          this.label = 'User is a PUM'
          break
        case 'negative':
          this.label = 'You\'re All Clear!'
          break
        case 'recovered':
          this.label = 'You\'re now COVID-free!'
          break
        case 'death':
          this.label = 'Patay sa ka brad RIP'
      }
    }
  }
}
</script>
