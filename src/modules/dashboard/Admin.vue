<template>
    <div class="container-fluid" style="padding: 0px;">
        <div class="col-sm-12 alert alert-info">&nbsp;&nbsp;<h3>PAGE UNDER CONSTRUCTION</h3></div>
        <div class="row">
            <div class="col-sm-3 countCards" v-for="(element, index) in users" :key="index">
                <div class="card">
                    <div class="card-header countHeader text-center">
                        <i :class="element.icon"></i>
                    </div>
                    <div class="card-body text-center">
                        <p class="userSUm">{{element.count}}</p>
                        <p class="userType">{{element.user_type}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.countSummary{
    height: 400px;
}
.countBody{
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}
.countSection{
    height: 130px;
}
.countIcon{
    font-size: 45px;
}
.countIconContainer{
    display: flex;
    align-items: center;
    justify-content: left;
    margin-top: 10px;
}
.countHeader{
    background-color: white;
    border: none;
    margin-bottom: 70px;
    padding-top: 30px;
}
.userSUm{
    font-size: 30px;
    font-weight: bold;
    border-bottom: 2px solid #005b96;
    color: #005b96;
}
.countCards{
    margin-bottom: 10px;
}
.userType{
    color: #005b96;
}
</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import ROUTER from 'src/router'
export default {
  data(){
    return{
      user: AUTH.user,
      dashType: AUTH.user.type,
      backend: CONFIG.BACKEND_URL,
      users: [
        {
          icon: 'fas fa-users countIcon',
          user_type: 'USER',
          count: 0
        },
        {
          icon: 'fas fa-fax countIcon',
          user_type: 'BUSINESS',
          count: 0
        },
        {
          icon: 'fas fa-building countIcon',
          user_type: 'GOV',
          count: 0
        },
        {
          icon: 'fas fa-building countIcon',
          user_type: 'BRGY',
          count: 0
        }
      ]
    }
  }
}
</script>
