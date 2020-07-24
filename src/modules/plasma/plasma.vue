<template>
  <div class="container">
     <div v-if="data.length > 0" class="container"><br>
        <div class="row">

            <div class="col-sm-3 column" v-if="showField">
                <div class="card cards">
                    <div class="card-header d-flex justify-content-between">
                        <div>
                            <i class="far fa-user-circle profile-icon i-style"></i>
                        </div>
                        <div>
                            <button class="btn plasma-cancel-btn" @click="showTextField()"><i class="fas fa-times"></i></button>    
                        </div> 
                    </div>
                    <div class="card-body textarea-card">
                        <textarea 
                            class="form-control textarea" 
                            v-model="post" 
                            placeholder="Type your POST here... Please Include Your Address"  
                            id="comment"
                        >
                        </textarea>
                        <div class="d-flex justify-content-center">
                            <button v-bind:disabled="post===''" class="btn plasma-post-btn" @click="posts">POST</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="add-post-btn-card col-sm-3 column" v-if="showField===false" @click="showTextField()">
               <div class="card cards">
                    <i class="add-post fa fa-plus"></i>
                </div>
            </div>

            <div class="col-sm-3 column" v-for="(datus, index) in data" :key="index">
                <div class="card cards">
                    <div class="card-header d-flex justify-content-between">
                        <div>
                            <i class="far fa-user-circle profile-icon i-style"></i>
                        </div>
                        <div class="dropdown" v-if="user.type === 'ADMIN'">
                            <button class="btn plasma-option-btn" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>  
                            <div class="dropdown-menu float-left">
                                <a class="dropdown-item" @click="edit(datus.id)">Edit</a>
                                <a class="dropdown-item" @click="deletePost(datus.id)">Delete</a>
                            </div>
                        </div>   
                    </div>
                    <p class="date-posted">{{time}}</p>
                    <div class="card-body">
                        {{datus.content}}
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <empty v-if="data.length <=0" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style scoped>
    .add-post-btn-card :hover{
        cursor: pointer;
    }   
    .add-post{
        font-size:40px;
        color:#005b96;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%)
    }
    .container .container {
        margin-top:40px
    }
    .column {
        float: left;
        width: 25%;
        padding: 0 5px;
        margin-bottom:2vh
    }
    .cards {
        padding: 16px;
        padding-top:2px;
        height:200px
    }
    .card-header{
        padding:0px;
        background-color:white;
    }
    .card-body{
        padding:0px;
        padding-left:10px;
        padding-right:10px;
        font-size:12px;
    }
    .date-posted{
        font-size:8px;
        margin-left:10px;
    }
    .dropdown-menu{
        margin-top:-25px;
        margin-left:-131px;
    }
    .i-style {
        padding: 10px;
        transition: margin 300ms;
        font-size:30px;
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
    .plasma-option-btn{
        margin-top: 10px;
        background: white !important ;
        box-shadow:none !important;
        border: none !important;
    }
    .plasma-option-btn:focus{
        background: white !important ;
        box-shadow:none !important;
        border: none !important;
    }
    .plasma-post-btn{
        height:30px;
        width:40%;
        background-color:#005b96;
        color:white;
        padding:0px;
        position:relative;
        bottom:0px;
        margin-top:10px;
    }
    .plasma-post-btn:focus{
        box-shadow: none;
    }
    .plasma-cancel-btn{
        margin-top:8px;
        color:#e92424;
        background-color:white;
        border-radius:20px;
        border-color:#e92424;
    }
    .plasma-cancel-btn:focus{
        border-radius:20px !important;
        border-color:#e92424 !important;
        background-color:white !important;
        box-shadow:none !important;
    }
    .textarea{
        height:70%;
        border:none;
        border-bottom:1px solid #dfe1e6;
        resize: none;
        padding-left:10px;
        padding-right:10px;
    }
    .textarea-card{
        padding:0px;
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
      isEdit: false,
      disabled: true,
      post: '',
      editID: null,
      menushow: false,
      plasmaBtnColor: 'background-color:white;',
      data: [],
      time: '7/23/2020'
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  mounted(){
    if(this.user.type !== 'ADMIN'){
      ROUTER.push('/dashboard')
    }
    $('#loading').css({display: 'block'})
    this.retrieve()
  },
  methods: {
    addPost(){
      ROUTER.push('/plasma/add-post')
    },
    showMenu(index){
      this.menushow = true
    },
    showTextField(){
      this.showField = !this.showField
      console.log('testing')
    },
    retrieve(){
      $('#loading').css({display: 'none'})
      this.APIRequest('posts/retrieve').then(response => {
        console.log('resposes', response.data)
        this.data = response.data
        this.time = response.request_timestamp
      })
    },
    posts(){
      $('#loading').css({display: 'block'})
      if(this.isEdit === false){
        let params = {
          content: this.post
        }
        this.APIRequest('posts/create', params).then(response => {
          this.retrieve()
          this.post = ''
        })
      }else{
        let params = {
          id: this.editID,
          content: this.post
        }
        this.APIRequest('posts/update', params).then(response => {
          this.retrieve()
          this.post = ''
        })
      }
    },
    edit(id){
      this.isEdit = true
      this.data.forEach(element => {
        console.log(element.id)
        if(element.id === id){
          this.showTextField()
          this.post = element.content
          this.editID = element.id
        }
      })
    },
    deletePost(postID){
      console.log('data', postID)
      $('#loading').css({display: 'block'})
      let params = {
        id: postID
      }
      this.APIRequest('posts/delete', params).then(response => {
        this.retrieve()
      })
    }
  }
}
</script>
