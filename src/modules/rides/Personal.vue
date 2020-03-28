<template>
  <div class="mx-3">
    <button class="btn btn-primary pull-right" style="margin: .5% 0;" @click="showModal('create', null)">New Ride</button>
    <div class="row w-100 m-0">
      <div class="alert alert-danger mt-2 p-3 col-12" role="alert">
        <b>Note:</b> COVID Positive rows <b><u>do not</u></b> automatically mean you have contracted the virus. It just means that the vehicle matches a reportedly affected passenger.
      </div>
    </div>
    <div class="position-relative w-100 m-0 row justify-content-between mt-2 pt-0" v-if="data !== null">
      <div class="card card-half" v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;">
        <div class="card-block px-3">
          <button class="btn btn-primary pull-right mt-3" @click="showModal('update', item)">
            <i class="fas fa-edit"></i>
          </button>
          <h6 class="card-title text-uppercase text-primary" style="margin-top: 15px;">{{item.type + (item.code !== null ? ' : ' + item.code : '')}}</h6>

          <div class="card-title" style="font-size: 15px; margin: 15px 0;"><i class="fa fa-map-marker" style="margin-right: 10px"></i>{{item.from + ' - ' + item.to}}</div>
          <div class="card-title" style="font-size: 15px; margin: 15px 0;"><i class="fa fa-calendar" style="margin-right: 10px"></i>{{item.from_date_human + ' - ' + item.to_date_human}}</div>
          <div class="m-0 pb-2">
            <b-button variant="success" class="not-btn" v-if="item.status === 'negative'">This route is clear.</b-button>
            <b-button variant="primary" class="not-btn" v-if="item.status === 'pui'">There was a PUI on this route.</b-button>
            <b-button variant="warning" class="not-btn" v-if="item.status === 'pum'">There was a PUM on this route.</b-button>
            <b-button variant="danger" class="not-btn" v-if="item.status === 'positive'">There was a COVID Positive person on this route.</b-button>
          </div>
        </div>
      </div>
    </div>
    <empty v-else :title="'You have no ride history yet.'" :action="'Your data will show up here once you have added rides you\'ve been on.'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
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
import CONFIG from 'src/config.js'
import ModalProperty from './CreateRides.js'
import moment from 'moment'
import Vue from 'vue'
Vue.filter('formatDateTime', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY h:m A')
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
          created_at: 'asc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('rides/retrieve', parameter).then(response => {
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
          })
          this.modalProperty.params[0].value = this.user.userID
          break
        case 'update':
          let modalData = {...this.modalProperty}
          let parameter = {
            title: 'Update Rides',
            route: 'rides/update',
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
            if(data.variable === 'from' || data.variable === 'to') {
              $(`#${data.id} input`).val(data.value)
            }
            data.value = item[`${data.variable}`]
            if(data.variable === 'number') {
              data.value = item.number
            }
          })
          this.modalProperty = {...modalData}
          break
      }
      $('#createRidesModal').modal('show')
    }
  }
}
</script>
