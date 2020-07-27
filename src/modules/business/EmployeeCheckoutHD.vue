<template>
  <div v-if="data !== null" class="mt-5 form-wrapper">
    <div class="mt-3 text-center">
      <img v-if="data.merchant.logo" :src="config.BACKEND_URL+data.merchant.logo" width="80" height="80" :alt="data.merchant.name" class="img-fluid">
      <span v-else class="fa fa-user-circle-o" style="font-size: 80px"></span>
    </div>
    <div class="mx-auto text-center mb-4">
      <h3 class="font-weight-bold text-primary">{{data.merchant.name}}</h3>
      <span class="text-secondary">{{data.merchant.address}}</span>
      <br>
      <span class="text-secondary">
        {{`
            ${formParameters.location ? formParameters.location.route ? `${formParameters.location.route},` : '' : ''}
            ${formParameters.location ? formParameters.location.locality ? `${formParameters.location.locality},` : '' : ''}
            ${formParameters.location ? formParameters.location.region ? `${formParameters.location.region},` : '' : ''}
        `}}
      </span>
    </div>
    <h3 class="text-primary text-center font-weight-bold">Employee Checkout Health Declaration Form</h3>
    <h5
      v-if="!form" 
      :class="['text-center', 'font-weight-bold', {'text-danger': formParameters.status === 'danger', 'text-success': formParameters.status === 'clear'}]">
      Status: {{formParameters.status}}{{formParameters.statusLabel !== 'clear' ? ` [${formParameters.statusLabel}]` : ''}}
    </h5>
    <h5 class="text-center font-weight-bold" v-if="!form">Completed on: {{ getRelativeTime(data.updated_at) }}</h5>
    <div class="border border-2 my-4 mx-auto p-3 rounded" v-if="form">
      <b>IMPORTANT REMINDER:</b> Kindly complete this health declaration form honestly. Failure to answer or giving of false information is punishable in accordance with Philippine laws.
    </div>
    <hr>
    
    <!-- VIEW TYPE -->
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
                <th scope="row">Department</th>
                <td>{{healthDec.personalInformation.department}}</td>
              </tr>
              <tr>
                <th scope="row">Section</th>
                <td>{{healthDec.personalInformation.section}}</td>
              </tr>
              <tr>
                <th scope="row">Sex</th>
                <td>{{healthDec.personalInformation.gender}}</td>
              </tr>
              <tr>
                <th scope="row">Date of Birth</th>
                <td>{{healthDec.personalInformation.birth_date}}</td>
              </tr>
              <tr>
                <th scope="row">Tel./Mobile No.</th>
                <td>{{healthDec.personalInformation.contact_number}}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{{healthDec.personalInformation.email}}</td>
              </tr>
              <tr>
                <th scope="row">Address in the Philippines</th>
                <td>{{healthDec.personalInformation.address}}</td>
              </tr>
            </tbody>
          </table>
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

        <!-- healthDec.company.related_questions -->
        <div class="company_question_container" v-for="(question, idx) in healthDec.company.related_questions" :key="idx">
          <span>{{question.question}}</span>
          <span v-if="question.answer.length > 0" class="d-inline">
            <span class="related_questions_answer" v-for="(answer, index) in question.answer" :key="index">
              <b>{{`${answer}${index + 1 === question.answer.length ? '' : ', '}`}}</b>
            </span>
          </span>
          <span v-else class="d-inline related_questions_answer">
            <b>None</b>
          </span>
        </div>

        <div class="person_in_contact_container">
          <div class="person_in_contact_question">Co-workers transacted:</div>
          <div class="person_in_contact"> 
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Names</th>
                  <th scope="col">Department</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in healthDec.company.person_in_contact" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.department }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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


    <!-- FORM TYPE -->
    <form v-if="form" @submit.prevent>
      <div class="border border-2 my-5 mx-auto p-3 rounded">
        <h5 class="health-group-header">Personal Information</h5>
        <div>
          <div class="row">
            <div class="form-group col-md-4">
              <label for="department" class="required">Department:</label>
              <input class="form-control" type="text" name="department" id="department" placeholder="Enter Department" v-model="healthDec.personalInformation.department" required>
            </div>

            <div class="form-group col-md-4">
              <label for="section" class="required">Section:</label>
              <input class="form-control" type="text" name="section" id="section" placeholder="Enter Section" v-model="healthDec.personalInformation.section" required>
            </div>

            <div class="form-group col-md-4">
              <label for="dutyHours" class="required">Duty Hours:</label>
              <input class="form-control" type="number" step="0.01" name="duty_hours" id="dutyHours" placeholder="Enter Duty Hours" v-model="healthDec.personalInformation.duty_hours" required>
            </div>
          </div>

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
            <div class="form-group col-12">
              <label for="address" class="required">Address in the Philippines</label>
              <input  v-model="healthDec.personalInformation.address" type="text" name="address" id="address" class="form-control" placeholder="Enter Address" required>
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

        <!-- PERSONS IN CONTACT WITHIN 12 HOURS -->
        <section id="person-in-contact-12h">
          <div class="mt-4">
            <h6 class="font-weight-bold required">
              Kindly list down at least 5 names of co-workers you had transact with today.
            </h6>
            <p style="font-size: 12px">(Ilista ang mga taw nga imong close in contact/ka trabaho karong adlawa)</p>
          </div>

          <div class="row my-2 ml-2">
            <form class="w-100 row" @submit.prevent>
              <div class="form-group col-md-4">
                <input class="form-control" type="text" name="person_in_contact_name" id="person_in_contact_name" placeholder="Enter Name" value="">
              </div>
              <div class="form-group col-md-4">
                <input class="form-control" type="text" name="person_in_contact_department" id="person_in_contact_department" placeholder="Enter Department" value="">
              </div>
              <div class="form-group col-md-1">
                <div class="mw-100 col-1 pl-0 px-0">
                  <button class="btn btn-success add-button" type="submit" @click="addPerson()">
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div v-if="healthDec.company.person_in_contact.length > 0">
            <table class="table col-md-8">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Department</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(info, index) in healthDec.company.person_in_contact" :key="index">
                  <td class="w-50">{{ info.name }}</td>
                  <td class="w-50">{{ info.department }}</td>
                  <td class="w-25">
                    <button
                      class="btn btn-danger" @click="healthDec.company.person_in_contact.splice(index, 1)"
                      type="button"
                      style="float: right"
                    >
                      <i class="fa fa-trash px-0" style="pointer-events:none"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>


        <!-- COMPANY RELATED_QUESTIONS -->
        <section :id="`company-related-question-${index}`" v-for="(item, index) in healthDec.company.related_questions" :key="index">
          <div class="mt-4">
            <h6 :class="['font-weight-bold', { 'required': item.required }]">
              {{ item.question }}
            </h6>
            <p style="font-size: 12px">
              {{ item.translate }}
            </p>
          </div>

          <div class="row my-2 ml-2">
            <form class="w-100 row" @submit.prevent>
              <div class="form-group col-md-4">
                <input class="form-control" type="text" name="inputVal" :id="`company_related_question_${index}`" placeholder="Input here" value="">
              </div>
              <div class="form-group col-md-1">
                <div class="mw-100 col-1 pl-0 px-0">
                  <button class="btn btn-success add-button" type="submit" @click="addAns(`company_related_question_${index}`, index)">
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div v-if="item.answer.length > 0">
            <table class="table col-md-4">
              <tbody>
                <tr v-for="(ans, idx) in item.answer" :key="idx">
                  <td class="w-75">{{ ans }}</td>
                  <td class="w-25">
                    <button
                      class="btn btn-danger" @click="healthDec.company.related_questions[index].answer.splice(idx, 1)"
                      type="button"
                      style="float: right;"
                    >
                      <i class="fa fa-trash px-0" style="pointer-events:none"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
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

  h6.required:after {
    content:"*";
    color:red;
  }

  .symptoms label {
    display: inline;
  }

  .related_questions_answer, .mode_of_transportation {
    color: $primary
  }

  #company-related-question-0 table td,
  #company-related-question-1 table td,
  #company-related-question-2 table td,
  #person-in-contact-12h table td {
    padding: 3px 10px !important;
    vertical-align: middle;
  }

  .person_in_contact {
    overflow: auto;
  }
  .company_question_container {
    min-height: 35px !important;
    padding: .50rem !important;
    border-top: 1px solid #e9ecef;
  }
  .person_in_contact_question {
    padding: .50rem;
    padding-bottom: 0px !important;
  }
  .person_in_contact .table thead tr th {
    border-top: 0px !important;
  }
  .person_in_contact .table tbody tr td {
    padding: .50rem .75rem !important;
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

    if (this.form) {
      this.healthDec.personalInformation.first_name = this.userInfoParam.first_name
      this.healthDec.personalInformation.middle_name = this.userInfoParam.middle_name
      this.healthDec.personalInformation.last_name = this.userInfoParam.last_name
      this.healthDec.personalInformation.gender = this.userInfoParam.sex
      this.healthDec.personalInformation.address = this.userInfoParam.address
      this.healthDec.personalInformation.email = this.user.email
      this.healthDec.personalInformation.birth_date = this.userInfoParam.birth_date
      this.healthDec.personalInformation.contact_number = this.userInfoParam.cellular_number

      this.healthDec.personalInformation.department = null
      this.healthDec.personalInformation.section = null
      this.healthDec.personalInformation.duty_hours = null

      this.healthDec.company.related_questions = [
        {
          question: 'What Offices/Section you have been to today: (Official or non Official)',
          translate: '(Asa nga opisina/section imong giadto karon (opisyal or personal nga katuyuan))',
          required: true,
          answer: []
        },
        {
          question: 'Where do you intend to go after here?',
          translate: '(Asa imong plano moadto moadto gikan diri?)',
          required: true,
          answer: []
        },
        {
          question: 'Did you notice something irregular/unusual in your work or coworkers in terms of health/safety condition today? Please specify.',
          translate: '(Naa ka ba`y naobserbahan nga kalahian sa normal nga health and safety condisyon sa trabaho o sa imong mga kauban? I-detalye)',
          required: true,
          answer: []
        }
      ]
    }
  },
  data() {
    return{
      user: AUTH.user,
      symptomsOption: [...COMMON.symptomsHealthDec],
      healthDec: JSON.parse(JSON.stringify(COMMON.healthDec)),
      formParameters: {
        format: null,
        status: null,
        statusLabel: null,
        location: null
      },
      form: false,
      data: null,
      config: CONFIG,
      otherSymptoms: 0
    }
  },
  props: ['healthDecParam', 'formParam', 'isForm', 'dataParam', 'userInfoParam', 'isUserCreate'],
  methods: {
    getRelativeTime(time) {
      return moment(time).fromNow()
    },
    addPerson() {
      const name = $('#person_in_contact_name').val().trim()
      const department = $('#person_in_contact_department').val().trim()

      if (name === '' || department === '') return
      this.healthDec.company.person_in_contact.push({ name, department })
      $('#person_in_contact_name').val('')
      $('#person_in_contact_department').val('')
      $(`#person-in-contact-12h h6`).css({ 'color': 'black' })
    },
    addAns(id, index) {
      const inputVal = $(`#${id}`).val().trim()
      if (inputVal === '') return
      this.healthDec.company.related_questions[index].answer.push(inputVal)
      $(`#${id}`).val('')
      $(`#company-related-question-${index} h6`).css({ 'color': 'black' })
    },
    submitForm(){
      $('#error').remove()
      let valid = this.checkRequired()
      if (valid) {
        this.formParameters.status = 'clear'
        this.formParameters.statusLabel = 'clear'

        // CHECK SYMPTOMS SECTION
        let symptoms = $(`input[name=symptoms]`)
        this.healthDec.symptoms = []
        symptoms.map((i, elem) => {
          let obj = {
            question: $(elem).val(),
            answer: $(elem).is(':checked') ? 'yes' : 'no'
          }
          if (obj.answer === 'yes' && this.formParameters.status === 'clear') {
            this.formParameters.status = 'danger'
            this.formParameters.statusLabel = 'With symptoms'
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

        this.healthDec.format = 'employee_checkout'
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

          console.log({ param })
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
      $('section h6').css({ 'color': 'black' })
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
        }
      })

      if (valid) {
        if (this.healthDec.company.person_in_contact.length < 5) {
          valid = false
          setTimeout(() => $('body,html').animate({ scrollTop: $('#person-in-contact-12h').offset().top - 350 }, 500), 500)
          setTimeout(() => $(`#person-in-contact-12h h6`).css({ 'color': 'red' }), 1200)
          return valid
        }
        this.healthDec.company.related_questions.map((question, index) => {
          if (question.answer.length === 0) {
            valid = false
            setTimeout(() => $('body,html').animate({ scrollTop: $(`#company-related-question-${index}`).offset().top - 350 }, 500), 500)
            setTimeout(() => $(`#company-related-question-${index} h6`).css({ 'color': 'red' }),
              index === 0 ? 1000 : index === 1 ? 1400 : 1800
            )
            return valid
          }
        })
      }

      return valid
    }
  }
}
</script>
