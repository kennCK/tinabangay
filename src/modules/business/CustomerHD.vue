<template>
  <div v-if="data !== null" class="mt-5 form-wrapper">
    <div v-if="!form">
      <button class="btn btn-primary" @click="dashboard()">Back to dashboard</button>
      Form successfully sent!
    </div>
    <div class="mt-3 text-center">
      <img v-if="data.merchant.logo" :src="config.BACKEND_URL+data.merchant.logo" width="80" height="80" :alt="data.merchant.name" class="img-fluid">
      <span v-else class="fa fa-user-circle-o" style="font-size: 80px"></span>
    </div>
    <div class="mx-auto text-center mb-4">
      <h3 class="font-weight-bold text-primary">{{contains ? 'Vehicle' : data.merchant.name}}</h3>
      <div v-if="contains">
        <h7 class="font-weight-bold text-primary">TYPE: {{this.list[1].type}},</h7>
        <h7 class="font-weight-bold text-primary">MODEL: {{this.list[2].model}},</h7>
        <h7 class="font-weight-bold text-primary">NUMBER: {{this.list[0].number}}</h7>
      </div>
      <span class="text-secondary">
        {{`
            ${formParameters.location ? formParameters.location.route ? `${formParameters.location.route},` : '' : ''}
            ${formParameters.location ? formParameters.location.locality ? `${formParameters.location.locality},` : '' : ''}
            ${formParameters.location ? formParameters.location.region ? `${formParameters.location.region},` : '' : ''}
        `}}
      </span>
    </div>
    <h3 class="text-primary text-center font-weight-bold">Customer Health Declaration Form</h3>
    <h5
      v-if="!form" 
      :class="['text-center', 'font-weight-bold', {'text-danger': formParameters.status === 'danger', 'text-success': formParameters.status === 'clear'}]">
      Status: {{formParameters.status}}{{formParameters.statusLabel !== 'clear' ? ` [${formParameters.statusLabel}]` : ''}}
    </h5>
    <h5 class="text-center font-weight-bold" v-if="!form">Completed on: {{ data.updated_at_human }}</h5>
    <div class="border border-2 my-4 mx-auto p-3 rounded" v-if="form">
      <b>IMPORTANT REMINDER:</b> Kindly complete this health declaration form honestly. Failure to answer or giving of false information is punishable in accordance with Philippine laws.
    </div>
    <hr>

    <div v-if="!form" class="mb-5">
      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Personal Information</h5>
        <table class="table table-striped">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{{healthDec.personalInformation.last_name}}, {{healthDec.personalInformation.first_name}} {{healthDec.personalInformation.middle_name || ''}}</td>
              </tr>
              <tr>
                <th scope="row">Sex</th>
                <td>{{healthDec.personalInformation.gender || 'Not specified'}}</td>
              </tr>
              <tr>
                <th scope="row">Date of Birth</th>
                <td>{{healthDec.personalInformation.birth_date || 'Not specified'}}</td>
              </tr>
              <tr>
                <th scope="row">Civil Status</th>
                <td>{{healthDec.personalInformation.civil_status || 'Not specified'}}</td>
              </tr>
              <tr>
                <th scope="row">Occupation</th>
                <td>{{healthDec.personalInformation.occupation || 'Not specified'}}</td>
              </tr>
              <tr>
                <th scope="row">Tel./Mobile No.</th>
                <td>{{healthDec.personalInformation.contact_number || 'Not specified'}}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{{healthDec.personalInformation.email}}</td>
              </tr>
              <tr>
                <th scope="row">Address in the Philippines</th>
                <td>{{healthDec.personalInformation.address || 'Not specified'}}</td>
              </tr>
            </tbody>
          </table>
      </div>
      
      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Travel History</h5>
        <h6 :class="['font-weight-bold', 'mt-4', { 'd-inline-flex': healthDec.travelHistory.transportation.length <= 0 }]">Transporations:</h6>
        <ul v-if="healthDec.travelHistory.transportation.length > 0" class="mb-3 list-group mx-3">
          <li class="row list-group-item m-0" v-for="(item, index) in healthDec.travelHistory.transportation" :key="index">
            <span class="col-sm-6 col-md-3 py-2"><b>Arrival Date:</b> {{item.date}}</span>
            <span class="col-sm-6 col-md-3 py-2"><b>Port of Origin:</b> {{item.origin}}</span>
            <span class="col-sm-6 col-md-3 py-2"><b>Flight No.:</b> {{item.flight}}</span>
            <span class="col-sm-6 col-md-3 py-2"><b>Seat No.:</b> {{item.seat}}</span>
          </li>
        </ul>
        <span v-if="healthDec.travelHistory.transportation.length <= 0" class="d-inline">
          <b>None</b>  
        </span>
        <hr>
        <div class="row">
          <div class="col-md-6 border border-top-0 border-left-0 border-bottom-0">
            <h6 :class="['font-weight-bold', 'mt-4', { 'd-inline-flex': healthDec.travelHistory.countries.length <= 0 }]">Countries visited for the past fourteen (14) days:</h6>
            <ul v-if="healthDec.travelHistory.countries.length > 0" id="countries" class="mb-3 list-group mx-3">
              <li class="list-group-item" v-for="(item, index) in healthDec.travelHistory.countries" :key="index">
                {{item.title}}
              </li>
            </ul>
            <span v-if="healthDec.travelHistory.countries.length <= 0" class="d-inline">
              <b>None</b>
            </span>
          </div>
          <div class="col-md-6">
            <h6 :class="['font-weight-bold', 'mt-4', { 'd-inline-flex': healthDec.travelHistory.localities.length <= 0 }]">Cities / municipalities in the Philippines visited for the past fourteen (14) days:</h6>
            <ul v-if="healthDec.travelHistory.localities.length > 0" id="localities" class="mb-3 list-group mx-3">
              <li class="list-group-item" v-for="(item, index) in healthDec.travelHistory.localities" :key="index">
                {{item.title}}
              </li>
            </ul>
            <span v-if="healthDec.travelHistory.localities.length <= 0" class="d-inline">
              <b>None</b>
            </span>
          </div>
        </div>
      </div>

      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Symptoms</h5>
        <h6 class="font-weight-bold mt-3">Symptoms felt during the completion of this form or within fourteen (14) days prior to completion</h6>

        <ul class="list-group">
          <li class="list-group-item" v-for="(item, index) in healthDec.symptoms" :key="index">
            <span :class="item.answer === 'yes' ? 'text-danger' : 'text-success'">{{item.question}} <b>[{{item.answer}}]</b></span>
          </li>
        </ul>
      </div>

      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Health and Safety-Related Questions</h5>
        <table class="table striped">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col" class="text-center">Yes</th>
              <th scope="col" class="text-center">No</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in healthDec.safety_questions" :key="index">
              <td>{{item.question}}</td>
              <td class="text-center text-danger"><span class="font-weight-bold" v-if="item.answer === 'yes'">X</span></td>
              <td class="text-center text-success"><span class="font-weight-bold" v-if="item.answer === 'no'">X</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <small>
          <i><b>Data Privacy Notice:</b> {{data.merchant.name}}, in line with Republic Act 10173 or the Data Privacy Act os 2012, is committed to protect and secure personal information obtained in the performances of its duties. The establishment collects the following personal information relevant in the advancement of protocols and precautionary measures against COVID-19 Acute Respiratory Disease. The collected personal information will be kept/stores and accessed only by authorized personnel and will not be shared with any outside parties unless the disclosure is required by, or in compliane with applicable laws and regulations.</i>
        </small>
      </p>

      <p>
        <small>
          <i><b>Declaration and Data Privacy Consent Form:</b>
          <br>
          I knowingly and voluntarily agree to the terms of this binding Declaration, and in doing so represent the truthfulness and veracity of the above answers. I understand that the failure to answer any questions or giving false answer can be penalized in the accordance with the law. Relative thereto, I voluntarily and freely consent to the processing and collection of personal data only in relation to COVID-19 internal protocols.</i>
        </small>
      </p>
    </div>

    <form v-if="form" @submit.prevent>
      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Personal Information</h5>
        <div>
          <div class="row">
            <div class="form-group col-md-4">
              <label for="lastName" class="required">Last Name</label>
              <input class="form-control" type="text" name="last_name" id="lastName" placeholder="Enter Last Name" v-model="healthDec.personalInformation.last_name" required>
            </div>

            <div class="form-group col-md-4">
              <label for="firstName" class="required">First Name</label>
              <input class="form-control" type="text" name="first_name" id="firstName" placeholder="Enter First Name" v-model="healthDec.personalInformation.first_name" required>
            </div>

            <div class="form-group col-md-4">
              <label for="middleName">Middle Name</label>
              <input class="form-control" type="text" name="middle_name" id="middleName" placeholder="Enter Middle Initial" v-model="healthDec.personalInformation.middle_name">
            </div>
          </div>

         <div class="row">
            <div class="form-group col-md-4">
              <label for="gender" class="required">Sex</label>
              <div>
                <div class="custom-control custom-radio custom-control-inline" @change="genderOthers()">
                  <input type="radio" id="male" name="gender" class="custom-control-input" value="male" v-model="gender" required>
                  <label class="custom-control-label" for="male">Male</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline" @change="genderOthers()">
                  <input type="radio" id="female" name="gender" class="custom-control-input" value="female" v-model="gender">
                  <label class="custom-control-label" for="female">Female</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline" @change="genderOthers()">
                  <input type="radio" id="othersGender" name="gender" class="custom-control-input" value="others" v-model="gender">
                  <label for="othersGender" class="custom-control-label">Others</label>
                </div>
                <input type="text" name="gender-others" id="gender" class="form-control" placeholder="Please specify" v-if="gender === 'others'" required>
              </div>
            </div>

            <div class="form-group col-md-4">
              <label for="birthday">Date of Birth</label>
              <input type="date" name="birth_date" id="birthday" class="form-control" :max="getMaxDate()" v-model="healthDec.personalInformation.birth_date">
            </div>

            <div class="form-group col-md-4">
              <label for="civilStatus">Civil Status</label>
              <div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="single" name="civilStatus" class="custom-control-input" value="single" v-model="civil">
                  <label class="custom-control-label" for="single">Single</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="married" name="civilStatus" class="custom-control-input" value="married" v-model="civil">
                  <label class="custom-control-label" for="married">Married</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" name="civilStatus" id="otherStatus" class="custom-control-input" value="others" v-model="civil">
                  <label for="otherStatus" class="custom-control-label">Others</label>
                </div>
                <input type="text" name="civilStatus-others" id="civilStatus" class="form-control" placeholder="Please specify" v-if="civil === 'others'" required>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="form-group col-md-4">
              <label for="occupation">Occupation</label>
              <input v-model="healthDec.personalInformation.occupation" type="text" name="occupation" id="occupation" class="form-control" placeholder="Enter Occupation">
            </div>

            <div class="form-group col-md-4">
              <label for="contactNum">Tel./Mobile No.</label>
              <input v-model="healthDec.personalInformation.contact_number" type="text" name="contact_number" id="contactNum" class="form-control" placeholder="Enter Contact Information">
            </div>

            <div class="form-group col-md-4">
              <label for="email" class="required">Email</label>
              <input v-model="healthDec.personalInformation.email" type="email" name="email" id="email" class="form-control" placeholder="Enter Email" required>
            </div>
          </div>

          <div class="row">
            <div class="form-group col-12">
              <label for="address">Address in the Philippines</label>
              <input  v-model="healthDec.personalInformation.address" type="text" name="address" id="address" class="form-control" placeholder="Enter Address">
            </div>
          </div>
        </div>

      </div>

      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Travel History</h5>
        <h6 :class="['font-weight-bold', 'mt-4', { 'd-inline-flex': healthDec.travelHistory.transportation.length <= 0 }]">Transporations:</h6>
        <div id="transportations" class="row">
          <div class="form-group col-md-3">
            <label for="arrivalDate">Arrival Date</label>
            <input type="date" name="arrivalDate" id="arrivalDate" class="form-control" :max="getMaxDate()">
          </div>
          
          <div class="form-group col-md-3">
            <label for="origin">Port of Origin:</label>
            <input type="text" name="origin" id="origin" class="form-control" placeholder="Enter Origin">
          </div>

          <div class="form-group col-md-3">
            <label for="flight">Flight No.</label>
            <input type="text" name="flight" id="flight" class="form-control" placeholder="Enter Flight No.">
          </div>

          <div class="form-group col-md-2">
            <label for="seat">Seat No.</label>
            <input type="text" name="seat" id="seat" class="form-control" placeholder="Enter Seat No.">
          </div>

          <div class="form-group col-sm-12 col-md-1">
            <label class="text-white d-none d-md-block">Empty</label>
            <button class="btn btn-success add-button" type="button" @click="addTranspo()">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-md-6 border border-top-0 border-left-0 border-bottom-0">
            <h6 :class="['font-weight-bold', 'mt-4', { 'd-inline-flex': healthDec.travelHistory.countries.length <= 0 }]">Countries visited for the past fourteen (14) days:</h6>
            <div id="countries" class="row">
              <div class="form-group col-10">
                <label for="country">Country</label>
                <input type="text" name="country" id="country" class="form-control" placeholder="Enter Country">
              </div>
              <div class="form-group col-1 pl-0">
                <label class="text-white">Empty</label>
                <button class="btn btn-success" type="button" @click="addPlace('country')">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <h6 :class="['font-weight-bold', 'mt-4', { 'd-inline-flex': healthDec.travelHistory.localities.length <= 0 }]">Cities / municipalities in the Philippines visited for the past fourteen (14) days:</h6>
            <div id="localities" class="row">
              <div class="form-group col-10">
                <label for="locality">City / Municipality</label>
                <input type="text" name="locality" id="locality" class="form-control" placeholder="Enter City / Municipality">
              </div>
              <div class="form-group col-1 pl-0">
                <label class="text-white">Empty</label>
                <button class="btn btn-success" type="button" @click="addPlace('locality')">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Symptoms</h5>
        <h6 class="font-weight-bold mt-3">PLEASE CHECK IF YOU HAVE ANY OF THE FOLLOWING SYMPTOMS AT PRESENT OR DURING THE PAST FOURTEEN (14) DAYS:</h6>

        <div class="symptoms">
          <div class="row px-3 pt-3">
            <div v-for="(item, index) in symptomsOption" :key="index" class="form-group col-md-4 col-sm-6">
              <input type="checkbox" name="symptoms" :id="item.value" class="form-control form-control-inline" :value="item.label">
              <label :for="item.value">{{item.label}} <small>({{item.translate}})</small></label>
            </div>

            <div class="form-group col-md-4 col-sm-6">
              <input type="checkbox" name="otherSymptoms" id="otherSymptoms" class="form-control form-control-inline" value="1" v-model="otherSymptoms">
              <label for="otherSymptoms">Others</label>
            </div>
          </div>

          <div class="row" v-if="otherSymptoms">
            <div class="form-group col-12">
              <input type="text" name="symptoms-others" id="symptoms-others" class="form-control" placeholder="Enter Symptoms" required>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Health and Safety-Related Questions</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col" class="text-center">Yes</th>
              <th scope="col" class="text-center">No</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Did you visit any hospital, clinic, or nursing home in the past fourteen (14) days?</td>
              <td><input class="col-12" type="radio" name="hospital" id="hospital-yes" value="Yes" required></td>
              <td><input type="radio" name="hospital" id="hospital-no" class="col-12" value="No"></td>
            </tr>
            
            <tr>
              <td>Have you been in contact with a suspected or confirmed SARS - COV (COVID-19) patient for the past courteen (14) days?</td>
              <td><input class="col-12" type="radio" name="contact" id="contact-yes" value="Yes" required></td>
              <td><input type="radio" name="contact" id="contact-no" class="col-12" value="No"></td>
            </tr>

            <tr>
              <td>Do you have any household member/s, or close friend/s who have met a person currently having a fever, cough and/or respiratory problems?</td>
              <td><input class="col-12" type="radio" name="household" id="household-yes" value="Yes" required></td>
              <td><input type="radio" name="household" id="household-no" class="col-12" value="No"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <small>
          <i><b>Data Privacy Notice:</b> {{data.merchant.name}}, in line with Republic Act 10173 or the Data Privacy Act os 2012, is committed to protect and secure personal information obtained in the performances of its duties. The establishment collects the following personal information relevant in the advancement of protocols and precautionary measures against COVID-19 Acute Respiratory Disease. The collected personal information will be kept/stores and accessed only by authorized personnel and will not be shared with any outside parties unless the disclosure is required by, or in compliane with applicable laws and regulations.</i>
        </small>
      </p>

      <p>
        <small>
          <i><b>Declaration and Data Privacy Consent Form:</b>
          <br>
          I knowingly and voluntarily agree to the terms of this binding Declaration, and in doing so represent the truthfulness and veracity of the above answers. I understand that the failure to answer any questions or giving false answer can be penalized in the accordance with the law. Relative thereto, I voluntarily and freely consent to the processing and collection of personal data only in relation to COVID-19 internal protocols.</i>
        </small>
      </p>

      <div class="row" id="submit">
        <div class="col d-flex justify-content-end">
          <button class="btn btn-success btn-lg mb-5 add-button" type="submit" @click="submitForm()">Submit</button> 
        </div>
      </div>
    </form>
  </div>  
</template>
<style lang="scss">
  @import "~assets/style/colors.scss";

  @media (min-width: 992px) {
    .form-wrapper {
      margin-left: 3rem;
      margin-right: 3rem;
    }
  }

  @media (max-width: 767px) {
    .add-button {
      width: 100% !important;
    }
  }

  .border-2 {
    border-width: 2px !important;
    border-color: #ccc !important;
  }
  
  .form-control-inline {
    display: inline-block;
    width: fit-content;
  }

  .health-group-header {
    position: relative;
    font-weight: bold;
    margin-top: -2rem !important;
    background: white;
    width: fit-content !important;
    padding: 2px 5px;
  }

  .form-group > label {
    font-weight: bold;
    color: #444;
  }

  .form-group label.required::after {
    content: '*';
    color: $danger;
    margin-left: 5px;
  }

  .custom-control-input:checked~.custom-control-label::before {
    color: #fff;
    border-color: #007bff;
    background-color: #007bff;
  }

  .custom-radio .custom-control-label::before {
    border-radius: 50%;
  }

  .custom-control-label::before, 
  .custom-file-label, 
  .custom-select {
    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }

  .custom-control-input.is-invalid~.custom-control-label::before {
    border-color: $danger;
  }

  input.is-invalid[type=radio] {
    filter: drop-shadow(0 0 2px $danger)
  }

  .custom-control-label::before {
    position: absolute;
    top: .25rem;
    left: 0rem;
    display: block;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    content: "";
    background-color: #fff;
    border: #adb5bd solid 1px;
  }

  .custom-radio .custom-control-input:checked~.custom-control-label::after {
    opacity: 1;
  }

  .custom-control-input[type=radio]~.custom-control-label::after {
    position: absolute;
    top: 0.47rem;
    left: 0.23rem;
    display: block;
    width: .55rem;
    height: .55rem;
    border-radius: 50%;
    content: "";
    background-color: white;
  }

  .symptoms label {
    display: inline;
  }
</style>
<script>
import moment from 'moment'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'

export default {
  mounted() {
    this.healthDec = this.healthDecParam
    this.formParameters = this.formParam
    this.form = this.isForm
    this.data = this.dataParam
    const path = this.$route.params.code.split(',')
    path.forEach(item => {
      if(item.includes('type') || item.includes('number') || item.includes('model')) {
        const obj = JSON.parse('{' + item + '}')
        this.list.push(obj)
      }
    })
    console.log(this.list)
    if(this.$route.params.code.includes('vehicle')){
      this.contains = true
    }
    if (this.form) {
      this.healthDec.personalInformation.first_name = this.userInfoParam.first_name
      this.healthDec.personalInformation.middle_name = this.userInfoParam.middle_name
      this.healthDec.personalInformation.last_name = this.userInfoParam.last_name
      this.healthDec.personalInformation.gender = this.userInfoParam.sex
      this.healthDec.personalInformation.address = this.userInfoParam.address
      this.healthDec.personalInformation.email = this.user.email
      this.healthDec.personalInformation.birth_date = this.userInfoParam.birth_date
      this.healthDec.personalInformation.contact_number = this.userInfoParam.cellular_number
    }
  },
  data() {
    return{
      dateLimit: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
      user: AUTH.user,
      symptomsOption: [...COMMON.symptomsHealthDec],
      healthDec: JSON.parse(JSON.stringify(COMMON.healthDec)),
      formParameters: {
        format: null,
        status: null,
        statusLabel: null,
        location: null
      },
      list: [],
      contains: false,
      form: false,
      code: null,
      data: null,
      config: CONFIG,
      civil: null,
      gender: null,
      transpo: [],
      country: [],
      locality: [],
      otherSymptoms: 0
    }
  },
  props: ['healthDecParam', 'formParam', 'isForm', 'dataParam', 'userInfoParam', 'isUserCreate'],
  methods: {
    genderOthers(){
      console.log(this.gender)
    },
    dashboard() {
      ROUTER.push('/dashboard')
    },
    getMaxDate() {
      return moment().format('YYYY-MM-DD')
    },
    isNotValidDate(date) {
      const today = moment().format('YYYY-MM-DD')
      return moment(date).isAfter(today)
    },
    addTranspo() {
      let flag = this.checkTranspo()
      let inputs = $('#transportations .form-group input')
      inputs.map((index, input) => {
        $(input).removeClass('is-invalid')
      })
      if(!flag.empty) {
        let info = {
          date: $('#arrivalDate').val(),
          origin: $('#origin').val(),
          flight: $('#flight').val(),
          seat: $('#seat').val()
        }

        if (this.isNotValidDate(info.date)) {
          $(`#arrivalDate`).addClass('is-invalid')
          return
        }

        $('<div>', {
          id: 'transpo-list',
          class: 'row list-group-item w-100 my-0 mx-4',
          html: `<span class="col-sm-3 py-2"><b>Arrival Date:</b> <span class="arrival">${info.date}</span></span>
          <span class="col-sm-3 py-2"><b>Port of Origin:</b> <span class="origin">${info.origin}</span></span>
          <span class="col-sm-3 py-2"><b>Flight No.:</b> <span class="flight">${info.flight}</span></span>
          <span class="col-sm-2 py-2"><b>Seat No.:</b> <span class="seat">${info.seat}</span></span>
          <span id="transpo-list-delete" class="col-sm-1"></span>`
        }).appendTo('#transportations')

        $('<button>', {
          class: 'btn btn-danger',
          html: '<i class="fa fa-trash" style="pointer-events:none"></i>',
          type: 'button',
          click: (e) => {
            this.deleteTranspo($(event.target))
          }
        }).appendTo('#transpo-list:last-child #transpo-list-delete')

        this.transpo.push(info)

        inputs.map((index, input) => {
          $(input).val('')
        })
      } else {
        $(`#${flag.info}`).addClass('is-invalid')
      }
    },
    checkTranspo() {
      let flag = {empty: false}
      let inputs = $('#transportations .form-group input')
      inputs.map((index, input) => {
        if(!flag.empty && ($(input).val() === '' || $(input).val() === undefined || $(input).val() === null)) {
          flag = {empty: true, info: $(input).attr('id')}
        }
      })

      return flag
    },
    deleteTranspo(elem) {
      let parent = $(elem).parent().parent()
      let info = {
        date: parent.find('.arrival').html(),
        origin: parent.find('.origin').html(),
        flight: parent.find('.flight').html(),
        seat: parent.find('.seat').html()
      }
      const updatedList = this.transpo.filter(item => JSON.stringify(item) !== JSON.stringify(info))
      this.transpo = [...updatedList]
      parent.remove()
    },
    addPlace(type) {
      $('#country, #locality').removeClass('is-invalid')
      if($(`#${type}`).val() === '' || $(`#${type}`).val() === null || $(`#${type}`).val() === undefined) {
        $(`#${type}`).addClass('is-invalid')
      } else {
        let info = {title: $(`#${type}`).val()}
        $('<div>', {
          class: 'row list-group-item w-100 my-0 mx-4 d-flex justify-content-between align-items-center',
          html: `<span>${info.title}</span>
                 <span></span>`
        }).appendTo(type === 'country' ? '#countries' : '#localities')

        $('<button>', {
          class: 'btn btn-danger',
          html: '<i class="fa fa-trash" style="pointer-events:none"></i>',
          type: 'button',
          click: (e) => {
            this.deletePlace(type, $(event.target))
          }
        }).appendTo(`#${type === 'country' ? 'countries' : 'localities'} .row:last-child span:last-child`)

        this[type].push(info)
        $(`#${type}`).val('')
      }
    },
    deletePlace(type, elem) {
      let parent = $(elem).parent().parent()
      let selectedTitle = parent.find('span:first-child').html()
      this[type] = this[type].filter(item => item.title !== selectedTitle)
      parent.remove()
    },
    setCode(code){
      this.$refs.imageView.setCode(code)
    },
    submitForm(){
      $('#error').remove()
      let valid = this.checkRequired()
      if (valid) {
        if (this.civil === 'others') {
          this.healthDec.personalInformation.civil_status = $('#civilStatus').val()
        } else {
          this.healthDec.personalInformation.civil_status = this.civil
        }
        if (this.gender === 'others') {
          this.healthDec.personalInformation.gender = $('#gender').val()
        } else {
          this.healthDec.personalInformation.gender = this.gender
        }
        this.healthDec.travelHistory.countries = this.country
        this.healthDec.travelHistory.transportation = this.transpo
        this.healthDec.travelHistory.localities = this.locality

        const safetyQuestionsStatus = {
          status: null,
          statusLabel: ''
        }
        const symptomsStatus = {
          status: null,
          statusLabel: ''
        }

        // CHECK SYMPTOMS SECTION
        let symptoms = $(`input[name=symptoms]`)
        this.healthDec.symptoms = []
        symptoms.map((i, elem) => {
          let obj = {
            question: $(elem).val(),
            answer: $(elem).is(':checked') ? 'yes' : 'no'
          }
          if (obj.answer === 'yes' && symptomsStatus.status === null) {
            symptomsStatus.status = 'danger'
            symptomsStatus.statusLabel = 'With symptoms'
          }
          this.healthDec.symptoms.push(obj)
        })

        if ($('input[name=otherSymptoms]').is(':checked')) {
          let obj = {
            question: 'Other Symptoms',
            answer: $('input[name="symptoms-others"]').val()
          }
          this.healthDec.symptoms.push(obj)
        }

        // CHECK SAFETY QUESTIONS
        let rows = $('tbody tr')
        this.healthDec.safety_questions = []
        rows.map((i, elem) => {
          let obj = {
            question: $(elem).find('td:first-child').html(),
            answer: $(elem).find('td:last-child input').is(':checked') ? 'no' : 'yes'
          }
          if (obj.answer === 'yes' && safetyQuestionsStatus.status === null) {
            safetyQuestionsStatus.status = 'danger'
            safetyQuestionsStatus.statusLabel = 'Exposed in safety related questions'
          }
          this.healthDec.safety_questions.push(obj)
        })

        this.formParameters.status = safetyQuestionsStatus.status || symptomsStatus.status ? 'danger' : 'clear'
        this.formParameters.statusLabel = 'clear'

        if (this.formParameters.status === 'danger') {
          this.formParameters.statusLabel = (
            `${safetyQuestionsStatus.statusLabel !== '' ? `${safetyQuestionsStatus.statusLabel}` : ''}` +
            `${safetyQuestionsStatus.statusLabel !== '' ? ', ' : ''}` +
            `${symptomsStatus.statusLabel !== '' ? `${symptomsStatus.statusLabel}` : ''}`
          )
        }

        this.healthDec.format = 'customer'
        this.healthDec.status = this.formParameters.status
        this.healthDec.statusLabel = this.formParameters.statusLabel
        this.healthDec.location = this.formParameters.location

        $('#loading').css({display: 'block'})

        if (this.isUserCreate) {
          let userId = this.user.userID
          if (this.formParameters.hasOwnProperty('scannedUserAnswerForm')) {
            userId = this.userInfoParam.account_id
          }
          let param = {
            owner: this.data.owner,
            account_id: userId,
            from: userId,
            to: this.data.owner,
            content: JSON.stringify(this.healthDec),
            payload: `form_submitted/${this.healthDec.format}`
          }
          this.APIRequest('health_declarations/create', param).then(response => {
            ROUTER.push(`/form/${response.generated_code}`)
          }).fail(() => {
            $('<div>', {
              id: 'error',
              class: 'row justify-content-end mb-3',
              html: '<small class="col-5 text-danger font-weight-bold">There is an error in submitting the form. Please contact support@birdseye.org</small>'
            }).insertBefore('#submit')
          })
        } else {
          let param = {
            id: this.data.id,
            content: JSON.stringify(this.healthDec),
            account_id: this.data.account_id,
            code: this.data.code,
            owner: this.data.owner,
            from: this.user.userID,
            to: this.data.owner,
            payload: `form_submitted/${this.healthDec.format}`
          }
          this.APIRequest('health_declarations/update', param).then(response => {
            this.$emit('triggerRetrieve', true)
          }).fail(() => {
            $('<div>', {
              id: 'error',
              class: 'row justify-content-end mb-3',
              html: '<small class="col-5 text-danger font-weight-bold">There is an error in submitting the form. Please contact support@birdseye.org</small>'
            }).insertBefore('#submit')
          })
        }
      } else {
        if($('#error').length === 0) {
          $('<div>', {
            id: 'error',
            class: 'row justify-content-end mb-3',
            html: '<small class="col-5 text-danger font-weight-bold">Oops! You have some missing information. Please review.</small>'
          }).insertBefore('#submit')
        }
      }
    },
    checkRequired() {
      $('.is-invalid').removeClass('is-invalid')
      let inputs = $('input[required]')
      let valid = true
      inputs.map((index, input) => {
        if($(input).attr('type') === 'radio') {
          let name = $(input).attr('name')
          if($(`input[name=${name}]:checked`).length === 0) {
            $(`input[name=${name}]`).eq(0).addClass('is-invalid')
            valid = false
          }
        } else {
          if($(input).val() === null || $(input).val() === undefined || $(input).val().trim() === '') {
            $(input).addClass('is-invalid')
            valid = false
          }
          if($(input).attr('id') === 'birthday') {
            if (this.isNotValidDate($(input).val())) {
              $(input).addClass('is-invalid')
              valid = false
            }
          }
        }
      })
      return valid
    }
  }
}
</script>
