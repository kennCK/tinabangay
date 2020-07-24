<template>
  <div>
   <p>
      Hi <b>{{user.username}}</b>! Below is your qr code. Show this to frontliners or DOH authorized personnel everytime they read your temperature.
   </p>
   <div class="row m-0">
    <div class="col-md-6 col-sm-12">
      <div v-if="user.code !== null" class="alert row justify-content-center align-items-center col-9 mt-5 mx-auto" :class="{'alert-danger': status.status === 'positive', 'alert-warning': status.status === 'pui' || status.status === 'pum', 'alert-success': status.status === 'negative' || status.status === 'recovered'}" role="alert">
         <label class="m-0" :class="{'text-black': status.status === 'death', 'text-danger': status.status === 'positive', 'text-warning': status.status === 'pum' || status.status === 'pui', 'text-success': status.status === 'negative' || status.status === 'recovered'}" v-if="status !== null">
           <h4>
             <i :class="{'fas fa-exclamation-triangle': status.status === 'pum' || status.status == 'positive' || status.status == 'pui' || status.status === 'symptoms', 'fas fa-check': status.status === 'negative' || status.status === 'recovered', 'fas fa-plus': status.status === 'death' }" style="margin-right: 5px;"></i>
             {{status.status_label}}
             <!-- Once API is updated change from {{status.status_label}} to {{label}} -->
           </h4>
         </label>
      </div>
      <div class="row m-0">
        <div v-if="user.code !== null" class="row justify-content-center pt-5 col-12">
             <QrcodeVue :value="`account/${user.code}`" :size="300" v-if="qrScannerState == false"></QrcodeVue>

          <div class="row justify-content-center pt-5 mb-5 col-12">
             <qr-code-scanner :state="qrScannerState" @toggleState="(newState) => qrScannerState = newState"
                              :location="qrLocation"></qr-code-scanner>
                              
          </div>
          <div class="text-left font-weight-bold">
            <b-list-group>
              <b-list-group-item class="text-center">How are you feeling today?</b-list-group-item>
              <b-list-group-item v-for="(item, index) in options" :key="index" :variant="selected.includes(item.text)? 'danger' : 'success'" v-b-popover.hover.left="item.description" :title="item.text">
                <input type="checkbox" :id="index" :value="item.text" v-model="selected">
                <label :for="index">{{item.text}}</label>
              </b-list-group-item>
              <!-- <b-list-group-item v-if="selected.length === 0" variant="success" class="text-center">
                <label v-b-popover.hover.left="'Always remember to practice social distancing, wash your hands, and stay at home!'" title="Looks like you're doing fine.">Looking good, stay safe!</label>
              </b-list-group-item> -->
              <b-popover placement="left" target="hatdog" triggers="hover" variant="danger" :title="selected.length < 3? warn[selected.length].title : warn[3].title" :content="selected.length < 3? warn[selected.length].text : warn[3].text" ></b-popover>
              <span id="hatdog">
                <b-list-group-item :variant="selected.length > 0 ? 'danger' : 'success'" class="text-center">
                <a href="symptoms_reporting" :class="{'text-danger': selected.length > 0, 'text-success': selected.length === 0}" >Visit Symptoms Reporting</a>
                </b-list-group-item>
              </span>
              {{selected}}
            
            </b-list-group>

    
          </div>
          
        </div>
      </div>
    </div>
    <div class="col-md-6 col-sm-12">
      <trending></trending>
    </div>
   </div>
  </div>
</template>

<style scoped lang="scss">
  @import "~assets/style/colors.scss";

</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
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
    'trending': require('modules/places/Trend_v2.vue')
  },
  methods: {
    retrieve(){
      let parameter = {
        id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tracings/status', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.status = response.data
        this.createLabel()
        console.log(this.status)
      })
      // parameter = {
      //   status: 'positive',
      //   limit: this.limit,
      //   offset: this.activePage,
      //   locality: this.searchValue + '%'
      // }
      // $('#loading').css({display: 'block'})
      // this.APIRequest('tracing_places/places', parameter).then(response => {
      //   $('#loading').css({display: 'none'})
      //   if(response.data.length > 0){
      //     this.data = response.data
      //   }else{
      //     this.data = null
      //   }
      //   this.result = this.lists(this.data)
      // })
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
