<template>
  <div class="container">
     <div v-if="data.length > 0" class="container">
         <div class="container">
            <textarea class="form-control textarea" v-model="post" placeholder="Type your POST here... Please Include Your Address" rows="15" id="comment"></textarea>
            <button class="btn btn-primary postBtn" v-if="goingToPost">Post</button>
        </div>
            <div class="row">
                <div class="column" v-for="(datus, index) in data" :key="index">
                    <div class="card">
                        <div style="align-items:center;display:flex">
                            <i class="fa fa-user-circle-o profile-icon i-style"></i>
                            <h4 class="h4Style">{{datus.username}}<br/>
                                <p class="p-date">{{datus.date}}</p>
                            </h4>               
                        </div><hr/>
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
        margin-bottom:9vh
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
        font-size:50px;
        color:#005b96;
    }
    .p-date {
        font-size: 12px;
        position: relative;
        color:#A9A9A9
    }
    .p-message {
        font-size: 15px;
        text-align:center;
        padding-bottom:5vh
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
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  background-color: #f1f1f1;
}
.textarea{
    height:10vh
}

</style>



<script>
import ROUTER from 'src/router'
// import AUTH from 'src/services/auth'
// import CONFIG from 'src/config.js'
// import COMMON from 'src/common.js'
// import PropertyModal from './CreateSymptom.js'
export default{
  data(){
    return {
      goingToPost: false,
      post: '',
      data: [
          { username: 'Annonymous', message: 'kinahanglan nako og plasma', date: '07/15/2020' },
          { username: 'Annonymous', message: 'kamatyunon na kaau ko. Tabang!!!', date: '07/15/2020' },
          { username: 'Annonymous', message: 'kinahanglan nako og plasma', date: '07/15/2020' },
          { username: 'Annonymous', message: 'kamatyunon na kaau ko. Tabang!!!', date: '07/15/2020' }
      ]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  },
  mounted(){
    if(this.post === ''){
      this.goingToPost = false
    }else{
      this.goingToPost = true
    }
  },
  methods: {
    addPost(){
      ROUTER.push('/plasma/add-post')
    }
  }
}
</script>
