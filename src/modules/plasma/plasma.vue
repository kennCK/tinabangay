<template>
  <div class="container-fluid">
                <input 
                    class="form-control textarea" 
                    placeholder="What's on your mind?"  
                    id="comment"
                    style="width:50%; height:70px;"
                    data-toggle="modal" data-target="#myModal"
                    />
                    <div class="modal fade" id="myModal" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog">
                            <div class="modal-content">

                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div class="modal-body">
                                <textarea v-model="post"  class="form-control textarea" 
                                placeholder="Type your POST here... " style="border-bottom-style:none"></textarea>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-block btn-primary" :data-dismiss="modalHide ? 'modal' : ''" @click="posts">Post</button>
                            </div>

                            </div>
                        </div>
                    </div>
            <div class="row" style="margin-top:20px">
            <div  class="column" v-for="(datus, index) in data" :key="index">
                <div class="card" style="height:220px;">
                    <div class="card-header" style="padding-left:10px;padding-right:10px">
                        <div class="row">
                            <div class="col-sm-8">
                                <p style="padding-top:15px">{{datus.created_at}}</p>
                            </div>
                            <div class="col-sm-3">
                                <div class="dropdown" v-if="user.type === 'ADMIN'">
                                    <button class="btn plasma-option-btn" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>  
                                    <div class="dropdown-menu float-left">
                                        <a class="dropdown-item" data-toggle="modal" data-target="#myModal" @click="edit(datus.id)">Edit</a>
                                        <a class="dropdown-item" @click="deletePost(datus.id)">Delete</a>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div class="card-content" style="padding-left:10px; padding-right:10px">
                        <p>{{datus.content}}</p>
                    </div>
                    <div class="card-action">
                        <button @click="getId(datus.id)" v-if="datus.content.length>110" class="btn showSize" data-toggle="modal" data-target="#seeMoreModal" title="See more">See more</button>
                    </div>
                </div>
            </div>
             <div class="modal fade" id="seeMoreModal" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog">
                            <div class="modal-content">

                            <div class="modal-header">
                                <div>
                                    <i class="far fa-user-circle profile-icon i-style-modal"></i>
                                    <p class="date-posted-modal">{{plasmaData.created_at}}</p>
                                </div>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div class="modal-body" style="margin:0 auto;padding:12px;word-break:break-all;">
                                <p>{{plasmaData.content}}</p>
                            </div>

                            <div class="modal-footer">
                                 <button class="btn btn-content-Message"  data-dismiss='modal'>OK</button>
                            </div>
                            </div>
                        </div>
                    </div>
        </div>
    <empty v-if="data.length <=0" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style scoped>

    #comment:active{
        box-shadow: 5px 4px 8px 1px rgba(204, 204, 204, 0.4)
    }
    .btn-content-Message{
        margin-top: 10px;
        background-color: #005b96;
        width: 100px;
        color: white;
    }
    .blurred-background {
        position: fixed;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        z-index: 1!important;
        top: 0;
        left: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
        background: rgb(54, 54, 54, .7)!important;
    }
   
    .alert-box {
        width: 55%;
        background: white;
        display: inline-block;
        margin-top: 180px;
        /* font-weight: lighter; */
        border-radius: 3px;
        font-size: 15px;
        padding: 20px;
        transition: .2s;

    }
    .column {
        float: left;
        width: 25%;
        padding: 10px;
        height: 250px; 
    }

    .row:after {
        content: "";
        display: table;
        clear: both;
    }

     .contentMessage{
        text-align: left;
        height: 70%;

    }
    .container-fluid{
        margin-top:30px
    }
    .column {
        float: left;
        width: 25%;
        padding: 0 5px;
        margin-bottom:2vh
    }
    .col-sm-8{
        width: 85%;
    }
    .col-sm-3{
        width: 20%
    }
    .cards {
        padding: 16px;
        padding-top:2px;
        height:200px;
    }
    .card-header{
        padding:0px;
        background-color:white;
    }
    .card-body{
        padding:0px;
        padding-left:10px;
        padding-right:10px;
    }
    .date-posted{
        /* font-size:8px; */
        margin-left:10px;
    }
    .date-posted-modal{
        font-size:10px;
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
    .i-style-modal {
        padding: 5px;
        transition: margin 300ms;
        font-size:50px;
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
    
    .showSize{
        background-color: transparent;
        color: #005b96;;
    }
    .showSize:focus{
        box-shadow: none;
    }
    .textarea{
        height:70%;
        border:none;
        border-bottom:1px solid #dfe1e6;
        resize: none;
        padding-left:10px;
        padding-right:10px;
    }
    

     @media screen and (max-width: 600px) {
    .alert-box {
        width: 80%;
        background: white;
        display: inline-block;
        margin-top: 180px;
        border-radius: 3px;
        font-size: 15px;
        padding: 20px;
        transition: .2s;
        
    }

    .column {
        width: 100%;
    }
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
      modalShow: false,
      plasmaBtnColor: 'background-color:white;',
      data: [],
      plasmaData: [],
      time: '7/23/2020',
      showWholeMessage: '',
      modalHide: false
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  mounted(){
    $('#loading').css({display: 'block'})
    this.retrieve()
  },
  computed: {
    hideModal(){
      return this.modalHide
    }
  },
  methods: {
    getId(id){
      this.APIRequest('posts/retrieve').then(response => {
        for(let i = 0; i < response.data.length; i++){
          if(response.data[i].id === id){
            this.plasmaData = response.data[i]
            this.modalShow = true
          }
        }
      })
    },
    hide(){
      this.modalShow = false
    },
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
        this.data = response.data.reverse()
        for(let i = 0; i < this.data.length; i++){
          if(this.data[i].content.length > 100){
            this.data[i].content = this.data[i].content.slice(0, 110) + '....'
          }else{
            this.data[i].content = this.data[i].content
          }
        }
      })
    },
    posts(){
      $('#loading').css({display: 'block'})
      if(this.isEdit === false){
        let params = {
          content: this.post
        }
        this.modalHide = !this.modalHide
        this.APIRequest('posts/create', params).then(response => {
          this.retrieve()
          this.post = ''
          this.post = null
        })
      }else{
        let params = {
          id: this.editID,
          content: this.post
        }
        this.modalHide = !this.modalHide
        this.APIRequest('posts/update', params).then(response => {
          this.retrieve()
          this.post = ''
          this.isEdit = false
        })
      }
    },
    edit(id){
      this.isEdit = true
      this.APIRequest('posts/retrieve').then(response => {
        for(let i = 0; i < response.data.length; i++){
          if(response.data[i].id === id){
            this.showTextField()
            this.post = response.data[i].content
            this.editID = response.data[i].id
          }
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
