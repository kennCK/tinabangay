<template>
    <div class="container-fluid">
        <button class="btn btn-primary addNewBtn" @click="showTextField()" >Add New Post</button><br>
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
                        <i class='fas fa-ellipsis-v ellipsis' @click="showMenu(index)" v-if="user.type === 'ADMIN'"></i>
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
    </div>
</template>

<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  data(){
    return {
      user: AUTH.user,
      showField: false,
      goingToPost: false,
      post: '',
      menushow: false,
      data: [
        {
          content: 'testing data only'
        },
        {
          content: 'testing data only'
        },
        {
          content: 'testing data only'
        },
        {
          content: 'testing data only'
        },
        {
          content: 'testing data only'
        }
      ],
      time: '7/23/2020'
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  }
}
</script>

<style>

</style>
