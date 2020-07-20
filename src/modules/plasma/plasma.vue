<template>
  <div class="container">
     <div v-if="data.length > 0" class="container"><br>
         <div class="card" style="width:96%;margin-left:3vh">
            <div class="row">
                <div class="col-0">
                    <i class="fa fa-user-circle-o profile-icon i-style"></i>
                </div>
                 <div class="col-lg-10">
                    <textarea class="form-control textarea" v-model="post" placeholder="Type your POST here... Please Include Your Address" rows="15" id="comment" ref="textarea"></textarea>
                </div>
                 <div class="col-1">
                    <button class="btn btn-primary postBtn" :hidden="!post.length > 0">Post</button>
                </div>
            </div>
        </div><br>
            <div class="row">
                <div class="column" v-for="(datus, index) in data" :key="index">
                    <div class="card cards">
                        <i class='fas fa-ellipsis-v ellipsis' @click="showMenu(index)" v-if="user.type === 'ADMIN'"></i>
                        <button class="btn" v-if="menushow">Delete</button>
                        <div style="align-items:center;display:flex"  @click="menushow = false">
                            <i class="fa fa-user-circle-o profile-icon i-style"></i>
                            <h4 class="h4Style">{{datus.username}}<br/>
                                <p class="p-date">{{datus.date}}</p>
                            </h4>         
                        </div>
                     <p class="p-message">{{datus.message}}</p>
                    </div><br/>
                </div><br/>
            </div>
    </div>
    <empty v-if="data.length <= 0" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <google-map-modal ref="mapModal" :place_data="data" v-if="data.length > 0"></google-map-modal>
  </div>
</template>
<style scoped>
    .container .container {
        margin-top:40px
    }
    .column {
        float: left;
        width: 50%;
        padding: 0 10px;
        height: 150px;
        position: relative;
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
    
    }
    .textarea{
        height:10vh;
        border-color:white;
    }
    .textareas{
        width:80vh
    }

</style>



<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
// import CONFIG from 'src/config.js'
// import COMMON from 'src/common.js'
// import PropertyModal from './CreateSymptom.js'
export default{
  data(){
    return {
      user: AUTH.user,
      goingToPost: false,
      post: '',
      menushow: false,
      data: [
          { username: 'Annonymous', message: 'kinahanglan nako og plasma', date: '07/15/2020', id: 0 },
          { username: 'Annonymous', message: 'kamatyunon na kaau ko. Tabang!!!', date: '07/15/2020', id: 1 },
          { username: 'Annonymous', message: 'kinahanglan nako og plasma', date: '07/15/2020', id: 2 },
          { username: 'Annonymous', message: 'kamatyunon na kaau ko. Tabang!!!', date: '07/15/2020', id: 3 }
      ]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  mounted(){
  },
  methods: {
    addPost(){
      ROUTER.push('/plasma/add-post')
    },
    showMenu(index){
      this.data.forEach(el => {
        if(el.id === index){
          this.menushow = true
        }
      })
    }
  }
}
</script>
