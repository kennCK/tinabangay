<template>
  <div class="container">
    <button class="btn btn-primary">Add Post</button>
    <div v-if="data.length > 0" class="container">
        <div class="row" v-for="(datus, index) in data" :key="index">
            <div class="col-lg-2"></div>
            <div class="col-lg-8 container-size">
                <div class="div-contain">
                    <div>
                        <h4>{{datus.username}}</h4>
                    </div>
                    <div class="div-message">
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;{{datus.message}}</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-2"></div>
        </div>
    </div>
    <empty v-if="data.length <= 0" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <google-map-modal ref="mapModal" :place_data="data" v-if="data.length > 0"></google-map-modal>
  </div>
</template>
<style>
    .container-size{  
        /* width: 60%; */
        /* background-color: #005b96 !important; */
        /* border-color: red; */
        border-style: inset;
        border-width: 3px;
        border-radius: 10px;
        margin-bottom: 1%;
    }
    .container .container {
        margin-top:30px
    }
    .btn {
        margin-top: 10px;
    }
    h3 {
        padding: 2px;
    }
    p {
        font-size: 15px;
    }
    .div-contain {
        padding: 5px;
    }
    .div-message {
        margin-top: 2%;
    }
</style>


<script>
// import ROUTER from 'src/router'
// import AUTH from 'src/services/auth'
// import CONFIG from 'src/config.js'
// import COMMON from 'src/common.js'
// import PropertyModal from './CreateSymptom.js'
export default{
  data(){
    return {
      data: [
          { username: 'Annonymous', message: 'kinahanglan nako og plasma' },
          { username: 'Annonymous', message: 'kamatyunon na kaau ko. Tabang!!!' }
      ]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  }
}
</script>
