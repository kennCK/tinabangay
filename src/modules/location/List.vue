<template>
  <div class="holder w-100">
    <div class="form-group pr-5">
      <button class="btn btn-primary pull-right" data-toggle="modal" data-target="#add_location" style="height: 45px !important;">Add</button>
    </div>
    <div class="row w-100 m-0" v-if="data !== null">
      <div class="card card-half" v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;" >
        <div class="row p-2">
          <div class="qr-code" v-if="item.code !== null" @click="setCode('location/' + item.code)">
            <QrcodeVue :value="'location/' + item.code" :size="100"></QrcodeVue>
          </div>
          <div class="details col-5" :class="item.code === null ? 'ml-4' : ''">
            <label class="card-title" style="margin-top:15px">
              {{item.route}}
            </label>
            <label class="card-title">
              {{item.locality + ', ' + item.country}}
            </label>
          </div> 
          <button class="btn btn-secondary ml-auto mr-4 mt-2" @click="selectedBranch = item" type="button" data-toggle="modal" data-target="#delete"><i class="fa fa-trash"></i></button>
        </div>

      </div>
    </div>


    <showQrCode ref="imageView"></showQrCode>
    <empty v-if="data === null" :title="'No branches added!'" :action="'Add a branch location.'" :icon="'far fa-building'" :iconColor="'text-danger'"></empty>

    <!--MODAL FOR ADDING LOCATION-->
    <div class="modal fade right" id="add_location" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Branch</h5>
            <button type="button" class="close" aria-label="Close" @click="hideModal('add_location')">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <div class="form-group mb-5">
              <label for="code">Branch Name</label>
              <input type="text" name="branch" id="branch" class="form-control" placeholder="Enter Branch Name">
            </div>
            <div v-if="customLocation === false">
              <div class="row mb-3 justify-content-end mx-0">
                <button class="btn btn-primary" @click="customLocation = true">Use Custom Location</button>
              </div>
              <div class="form-group">
                <label for="location">Set Address</label>
                <google-autocomplete-location
                  :property="googleProperty"
                  :id="'location'"
                  ref="location"
                  @onFinish="getLocation($event)"
                >
                </google-autocomplete-location>
              </div>
            </div>
            <div v-if="customLocation === true">
              <div class="row mb-3 justify-content-end mx-0">
                <button class="btn btn-primary" @click="customLocation = false">Use Google Autocomplete</button>
              </div>
              <div class="row mb-3">
                <div class="col font-weight-bold">Please move the red pin first.</div>
                <div class="col">
                  <span class="text-danger font-weight-bold">Pin Location</span><br> Pins your current location.
                </div>
                <div class="col">
                  <span class="text-primary font-weight-bold">Use Location</span> <br>Selects the location of the pin to use.
                </div>
              </div>
              <pin-location @onSelect="getLocation($event)" :property="{
                height: '400px'
              }"></pin-location>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="hideModal('add_location')">Cancel</button>
            <button class="btn btn-primary" @click="addNew()">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- DELETE BRANCH MODAL -->
    <div class="modal fade right" id="delete" tabindex="-1" role="dialog" aria-labelledby="deleteHeader"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-white" id="deleteheader">Delete Branch</h5>
            <button type="button" class="close" aria-label="Close" data-dismiss="modal" @click="selectedBranch = null">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            Are you sure you want to delete this branch?
          </div>
          <div class="modal-footer">
            <button class="btn btn-dark" data-dismiss="modal" @click="selectedBranch = null">Cancel</button>
            <button class="btn btn-secondary" data-dismiss="modal" @click="deleteBranch()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
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

.qr-code, .details{
  float: left;
  padding: 5px;
}

.qr-code{
  width: 25%;
  text-align: center;
}

.qr-code:hover{
  cursor: pointer;
  background: $primary;
}

.details{
  width: 75%;
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

@media (max-width: 767px) {
  .card.card-half {
    width: 100%;
    margin: 0;
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
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import QrcodeVue from 'qrcode.vue'
import showQrCode from './ShowMore.vue'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      selectedBranch: null,
      customLocation: false,
      location: null,
      common: COMMON,
      user: AUTH.user,
      data: null,
      googleProperty: {
        style: {
          height: '45px !important'
        },
        GOOGLE_API_KEY: CONFIG.GOOGLE_API_KEY,
        results: {
          style: {
          }
        },
        placeholder: 'Type Location'
      }
    }
  },
  components: {
    'google-autocomplete-location': require('src/components/increment/generic/location/GooglePlacesAutoComplete.vue'),
    'pin-location': require('components/increment/generic/map/PinLocation.vue'),
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    Pager,
    QrcodeVue,
    showQrCode
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    setCode(code){
      this.$refs.imageView.setCode(code)
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
      this.APIRequest('locations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    getLocation(event) {
      console.log('getting location')

      let location = {
        locality: event.locality,
        region: event.region,
        country: event.country,
        latitude: event.latitude,
        longitude: event.longitude
      }
      this.location = location
    },
    hideModal(id) {
      $('#add_location #error').remove()
      $(`#${id}`).modal('hide')
      this.$refs.location.onCancel()
      this.location = null
      $('#branch').val('')
    },
    addNew() {
      console.log('Submit')
      let branchName = $('#branch').val()
      let error = false
      $('#add_location .error-msg').remove()
      console.log(this.location)
      console.log(branchName)
      if(this.location === null) {
        $('<div>', {
          class: 'form-group text-danger error-msg',
          html: '<b>Uh oh!</b> Location is required.'
        }).prependTo('#add_location .modal-body')

        error = true
      }

      if(branchName === null || branchName === '') {
        $('<div>', {
          class: 'form-group text-danger error-msg',
          html: '<b>Uh oh!</b> Branch name is required.'
        }).prependTo('#add_location .modal-body')

        error = true
      }

      if(!error) {
        this.location.route = branchName
        let par = this.location
        par.autogenerate = true
        par.account_id = this.user.userID

        $('#loading').css({display: 'block'})
        this.APIRequest('locations/create', par).then(response => {
          this.location = null
          $('#branch').val('')
          this.retrieve()
          this.hideModal('add_location')
        })
      }
    },
    deleteBranch() {
      if(this.selectedBranch !== null) {
        let par = {
          id: this.selectedBranch.id
        }

        $('#loading').css({display: 'block'})
        this.APIRequest('locations/delete', par).then(response => {
          $('#loading').css({display: 'none'})
          this.selectedBranch = null
          this.retrieve()
        })
      }
    }
  }
}
</script>
