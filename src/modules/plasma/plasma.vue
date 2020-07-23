<template>
  <div class="container">
   <button class="btn btn-primary addNewBtn" @click="showTextField()" v-if="data !== null">Add New Post</button><br>
     <div v-if="data !== null" class="container"><br>
            <div class="row">
                <div class="col-sm-3 column" v-if="showField">
                <div class="card cards">
                        <i class="far fa-user-circle profile-icon i-style"></i>
                        <textarea class="form-control textarea" v-model="post" placeholder="Type your POST here... Please Include Your Address"  id="comment"></textarea>
                        <button class="btn btn-primary postBtn" :hidden="!post.length > 0">Post</button>
                </div>    
                </div>
                <div class="col-sm-3 column" v-for="(datus, index) in data" :key="index">
                    <div class="card cards">
                        <i class='fas fa-ellipsis-v ellipsis' @click="showMenu(index)"></i>
                        <button class="btn" v-if="menushow">Delete</button>
                        <div style="align-items:center;display:flex"  @click="menushow = false">
                            <i class="far fa-user-circle profile-icon i-style"></i>
                            <p class="p-date">{{time}}</p>     
                        </div>
                     <p class="p-message">{{datus.content}}</p>
                    </div>
                </div>
            </div>
    </div>
    <empty v-if="data === null" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <google-map-modal ref="mapModal" :place_data="data" v-if="data !== null"></google-map-modal>
  </div>
</template>
<style scoped>
    .container .container {
        margin-top:40px
    }
    .column {
        float: left;
        width: 25%;
        padding: 0 5px;
        margin-bottom:2vh
    }
    .btn {
        margin-top: 10px;
    }
    .h4Style {
        margin-left: -15px;
        padding: 10px;
        transition: margin 300ms;
    }
    .i-style {
        padding: 10px;
        transition: margin 300ms;
        font-size:30px;
    }
    .ellipsis{
        position: absolute;
        right: 0;
        width: 20px;
    }
    .p-date {
        font-size: 12px;
        position: relative;
        color:#A9A9A9
    }
    .p-message {
        font-size: 15px;
        padding-bottom:5vh
    }
    .div-contain {
        padding: 5px;
    }
    .div-message {
        margin-top: 2%;
        width: 70%;
    }
   
    * {
        box-sizing: border-box;
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
    }

    /* Remove extra left and right margins, due to padding */
    .row {margin: 10px;}

    /* Clear floats after the columns */
    .row:after {
        content: "";
        display: table;
        clear: both;
    }

    /* Responsive columns */
    @media screen and (max-width: 600px) {
    .column {
        width: 100%;
        display: block;
        margin-bottom: 20px;
    }
    }
    .cards {
        padding: 16px;
        height:30vh
    
    }
    .textarea{
        height:10vh;
        border-color:white;
    }
    .textareas{
        width:80vh
    }

    .addNewBtn{
        float:right
    }

</style>



<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
// import COMMON from 'src/common.js'
// import PropertyModal from './CreateSymptom.js'
export default{
  data(){
    return {
      user: AUTH.user,
      showField: false,
      goingToPost: false,
      post: '',
      menushow: false,
      data: null,
      time: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  mounted(){
    this.retrieve()
    // if(this.user.type !== 'ADMIN'){
    //   ROUTER.push('/dashboard')
    // }
    //  $('#loading').css({display: 'block'})
  },
  methods: {
    addPost(){
      ROUTER.push('/plasma/add-post')
    },
    showMenu(index){
      this.menushow = true
    },
    showTextField(){
      this.showField = true
    },
    retrieve(){
      this.APIRequest('posts/retrieve').then(response => {
        console.log('resposes', response.data)
        this.data = response.data
        this.time = response.request_timestamp
      })
    }
  }
}
</script>
