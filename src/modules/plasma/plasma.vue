<template>
  <div class="container">
    <button class="btn btn-primary" @click="showModal()">Add Post</button>
    <div v-if="data.length > 0" class="container">
        <div class="row" v-for="(datus, index) in data" :key="index">
            <div class="col-lg-2"></div>
            <div class="col-lg-8 container-size">
                <div class="div-contain">
                    <div>
                        <div class="row">
                            <div class="col-lg-1">
                                <i class="fa fa-user-circle-o profile-icon i-style"></i>
                            </div>
                            <div class="col-lg-11">
                                <h4 class="h4Style">{{datus.username}}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="p-date">
                        <p>{{datus.date}}</p>
                    </div>
                    <div class="row">
                        <div class="col-lg-1"></div>
                        <div class="div-message col-lg-10">
                            <p class="p-message">{{datus.message}}</p>
                        </div>
                        <div class="col-lg-1"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2"></div>
        </div>
    </div>
    <div class="modal fade right" id="addPlasma" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" aria-label="Close" @click="hideModal()">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <plasmaForm/>
          </div>
        </div>
      </div>
    </div>
    <empty v-if="data.length <= 0" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <google-map-modal ref="mapModal" :place_data="data" v-if="data.length > 0"></google-map-modal>
  </div>
</template>
<style scoped>
    .container-size{  
        /* width: 60%; */
        /* background-color: #005b96 !important; */
        /* border-color: red; */
        /* border-bottom: 3px solid; */
        height: 150px;
        box-shadow: 1px 1px #888888;
        border-width: 1px;
        border-radius: 10px;
        margin-bottom: 1%;
    }
    .container .container {
        margin-top:30px
    }
    .btn {
        margin-top: 10px;
    }
    .h4Style {
        padding: 2px;
        margin-top:20px;
        margin-left: -15px;
    }
    .i-style {
        margin-top:18px;
    }
    .p-date {
        font-size: 12px;
        float: right;
        position: relative;
        top: -20px;
    }
    .p-message {
        font-size: 15px;
    }
    .div-contain {
        padding: 5px;
    }
    .div-message {
        margin-top: 2%;
        width: 70%;
    }
    i {
        font-size: 30px;
    }
    /* .div-contain div {
        margin-top: 2%;
        margin-left: 2%;
    } */
</style>


<script>
// import ROUTER from 'src/router'
// import AUTH from 'src/services/auth'
// import CONFIG from 'src/config.js'
// import COMMON from 'src/common.js'
// import PropertyModal from './CreateSymptom.js'
import moment from 'moment'
import plasmaForm from './plasmaForm'
export default{
  data(){
    return {
      data: [
          { username: 'Annonymous', message: 'kinahanglan nako og plasma', date: moment(String(new Date())).format('MM/DD/YYYY') },
          { username: 'Annonymous', message: 'kamatyunon na kaau ko. Tabang!!!', date: moment(String(new Date())).format('MM/DD/YYYY') },
          { username: 'Annonymous', message: 'Unsaon d i ng plasma? Wla lagi ko na inform kung unsa na cya. Makaon na cya? hahaha Tagpila mn xd na?', date: moment(String(new Date())).format('MM/DD/YYYY') },
          { username: 'Annonymous', message: 'Kung mamatay ko tungod sa covid, naa pa bah kaha mohatod nako inig lubong nako? daghan pd vah kaha tao kung naay mohatod?', date: moment(String(new Date())).format('MM/DD/YYYY') }
      ]
    }
  },
  components: {
    plasmaForm,
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  methods: {
    showModal(){
      $('#addPlasma').modal('show')
    },
    hideModal(){
      $('#addPlasma').modal('hide')
    }
  }
}
</script>
