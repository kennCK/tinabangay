<template>
  <div class="mx-3">
    <button class="btn btn-primary pull-right" style="margin: .5% 0;" @click="showModal('create', null)">New Place</button>
    <div class="row w-100 m-0">
      <div class="alert alert-danger mt-2 p-3 col-12" role="alert">
        <b>Note:</b> COVID Positive rows <b><u>does not</u></b> automatically mean you have contracted the virus. It just means the location matches an reportedly affected location.
        <p class="mt-3">
          Have you been travelling the last 3 months? Add the places that you've been to! This will help with the accuracy of <b>BirdsEye</b>.
        </p>
      </div>
    </div>
    <div class="position-relative w-100 m-0 row justify-content-between mt-2 pt-0" v-if="data !== null">
      <div class="card card-half" v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;">
        <div class="card-block px-3">
          <button class="btn btn-primary pull-right mt-3" @click="showModal('update', item)">
            <i class="fas fa-edit"></i>
          </button>
          <h6 class="card-title" style="margin-top: 15px;">{{item.route == 'xx' ? `Custom Location` : `${item.route}, ${item.locality}, ${item.country}`}}</h6>
          <div class="card-title" style="font-size: 15px; margin: 15px 0;">{{item.date_human}}</div>
          <div class="m-0 pb-2">
            <b-button variant="success" class="not-btn" v-if="item.status === 'negative'">This area is clear.</b-button>
            <b-button variant="primary" class="not-btn" v-if="item.status === 'pui'">There was a PUI in this area.</b-button>
            <b-button variant="warning" class="not-btn" v-if="item.status === 'pum'">There was a PUM in this area.</b-button>
            <b-button variant="danger" style="max-width: 100%; white-space: normal; height: initial !important" class="not-btn" v-if="item.status === 'positive'">There was a COVID Positive person in this area.</b-button>
            <b-button variant="dark" class="not-btn" v-if="item.status === 'death'">There's been a death in this area.</b-button>
          </div>
        </div>
      </div>
    </div>
    <empty v-else :title="'You have not visited any places yet.'" :action="'Your data will show up here once you have added places you\'ve visited. Stay at Home!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <increment-modal :property="modalProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary {
  background-color: $primary !important;
}

.not-btn {
  pointer-events: none;
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

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import ModalProperty from './CreatePlaces.js'
import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MMM D, YYYY')
  }
})
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      modalProperty: ModalProperty,
      data: null,
      searchLocation: '',
      location: {
        route: null,
        locality: null,
        region: null,
        country: null,
        latitude: 0,
        longitude: 0,
        status: null,
        date: null,
        time: null
      }
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        condition: [{
          clause: '=',
          column: 'account_id',
          value: this.user.userID
        }],
        sort: {
          date: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('visited_places/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0) {
          this.data = response.data
        }
      })
    },
    showModal(action, item = null){
      switch(action){
        case 'create':
          this.modalProperty = {...ModalProperty}
          let inputs = this.modalProperty.inputs
          inputs.map(input => {
            input.value = null
            if(input.type === 'location') {
              $(`#${input.id} input`).val('')
            } else if (input.type === 'date') {
              input.placeholder = 'Enter Date'
            } else if (input.type === 'time') {
              input.placeholder = 'Enter Time'
            }
          })
          this.modalProperty.params[0].value = this.user.userID
          break
        case 'update':
          let modalData = {...this.modalProperty}
          let parameter = {
            title: 'Update Requests',
            route: 'visited_places/update',
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
            if(data.variable === 'location') {
              $(`#${data.id} input`).val(item.route + ', ' + item.locality + ', ' + item.country)
              let flag = false
              for (var i = 0; i < modalData.inputs.length; i++) {
                let check = modalData.inputs[i]
                if(check.variable === 'route'){
                  flag = true
                  break
                }
              }
              if(flag) {
                modalData.inputs.push({
                  row: 'full',
                  label: 'Route',
                  variable: 'route',
                  placeholder: 'Enter route',
                  value: item.route,
                  required: true,
                  id: 'route',
                  type: 'input',
                  inputType: 'hidden',
                  validation: {
                    size: 1,
                    type: 'text'
                  }})
                modalData.inputs.push({
                  row: 'full',
                  label: 'Locality',
                  variable: 'locality',
                  placeholder: 'Enter locality',
                  value: item.locality,
                  required: true,
                  id: 'locality',
                  type: 'input',
                  inputType: 'hidden',
                  validation: {
                    size: 1,
                    type: 'text'
                  }})
                modalData.inputs.push({
                  row: 'full',
                  label: 'Region',
                  variable: 'region',
                  placeholder: 'Enter region',
                  value: item.region,
                  required: true,
                  id: 'region',
                  type: 'input',
                  inputType: 'hidden',
                  validation: {
                    size: 1,
                    type: 'text'
                  }})
                modalData.inputs.push({
                  row: 'full',
                  label: 'Country',
                  variable: 'country',
                  placeholder: 'Enter country',
                  value: item.country,
                  required: true,
                  id: 'country',
                  type: 'input',
                  inputType: 'hidden',
                  validation: {
                    size: 1,
                    type: 'text'
                  }})
                modalData.inputs.push({
                  row: 'full',
                  label: 'Latitude',
                  variable: 'latitude',
                  placeholder: 'Enter latitude',
                  value: item.latitude,
                  required: true,
                  id: 'latitude',
                  type: 'input',
                  inputType: 'hidden',
                  validation: {
                    size: 1,
                    type: 'text'
                  }})
                modalData.inputs.push({
                  row: 'full',
                  label: 'Longitude',
                  variable: 'longitude',
                  placeholder: 'Enter longitude',
                  value: item.longitude,
                  required: true,
                  id: 'longitude',
                  type: 'input',
                  inputType: 'hidden',
                  validation: {
                    size: 1,
                    type: 'text'
                  }})
              } else {
                modalData.inputs.map(existingInput => {
                  existingInput.value = location[`${existingInput.variable}`]
                  return item
                })
              }
            } else if(data.type === 'date'){
              data.placeholder = moment(String(item[`${data.variable}`])).format('MMM D, YYYY')
              data.value = item.value
            } else if(data.type === 'time') {
              let stamp = moment(String(item[`${data.variable}`]), [moment.HTML5_FMT.TIME_SECONDS])
              data.placeholder = moment(String(stamp)).format('hh:mm A')
            } else {
              data.value === item[`${data.variable}`]
            }
          })
          this.modalProperty = {...modalData}
          break
      }
      $('#createPlacesModal').modal('show')
    }
  }
}
</script>
