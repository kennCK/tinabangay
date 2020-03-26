<template>
  <div style="margin-top: 25px;" v-if="data !== null">
    <table class="table table-responsive table-bordered" style="margin-top: 25px;">
      <thead>
        <th class="text-center">Patient's Username</th>
        <th class="text-center">Contact Number</th>
        <th class="text-center">Status</th>
        <th class="text-center">Date Recorded</th>
        <th class="text-center">Action</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-center">{{item.account.username}}</td>
          <td class="text-center">{{item.account.information.contact_number}}</td>
          <td v-if="(item.status === 'positive')" class="text-danger text-center text-uppercase"><strong>{{item.status}}</strong></td>
          <td v-if="(item.status === 'negative')" class="text-success text-center text-uppercase"><strong>{{item.status}}</strong></td>
          <td v-else-if="((item.status === 'pui' || item.status === 'pum'))" class="text-warning text-center text-uppercase"><strong>{{item.status}}</strong></td>
          <td class="text-center">{{item.created_at_human}}</td>
          <td class = "text-center">
            <button type="button" class="btn btn-danger" @click="selectedItem = item" data-toggle="modal" data-target="#visited_places">
              <i class="fas fa-map-marker-alt pl-2"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!--MODAL FOR VISITED PATIENTS-->
    <div class="modal fade right" id="visited_places" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content text-center">
          <div class="modal-header">
            <p class="heading">Visited Places of the Patient</p>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body" v-if="selectedItem !== null">
            <table class="table table-responsive table-bordered">
              <thead>
                <th class="text-center">Date</th>
                <th class="text-center">Time</th>
                <th class="text-center">Establishment</th>
                <th class="text-center">Locality</th>
                <th class="text-center">Region</th>
              </thead>
             <tbody>
              <tr v-for="(item, index) in selectedItem.places" :key="index">
                <td class="text-center">{{item.date_human}}</td>
                <td class="text-center">{{item.time}}</td>
                <td>{{item.route}}</td>
                <td>{{item.locality}}</td>
                <td>{{item.region}}</td>
              </tr>
             </tbody>
            </table>
        </div>
      </div>
  </div>
</div>
    <increment-modal :property="modalProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import ModalProperty from 'src/modules/places/CreatePlaces.js'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      modalProperty: ModalProperty,
      selectedItem: null,
      data: null
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        sort: {
          created_at: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
        console.log(response)
      })
    }
  }
}
</script>
