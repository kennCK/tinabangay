<template>
    <div class="container-fluid" style="padding: 0px;">
        <!-- <div class="col-sm-12 alert alert-info">&nbsp;&nbsp;<h3>PAGE UNDER CONSTRUCTION</h3></div> -->
        <br>
        <br>
        <div class="row">
            <div class="col-sm-3 countCards" v-for="element in (returnUsers.length < 1) ? 4 : returnUsers" :key="element">
                <div v-if="displayLoader" class="card cardloader">
                    <div class="card-body text-center accountSizeCardBody">
                        <div class="row">
                            <div class="col-sm-2 card__image loading">
                            </div>
                            <div class="col-sm-10">
                                <center>
                                    <p class="count card__count loading"></p>
                                </center>
                                <hr class="loader_divider">
                                <center>
                                    <p class="userType card__description loading"></p>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="card accountSizeCard">
                    <div class="card-body text-center accountSizeCardBody">
                        <div class="row">
                            <div class="col-sm-2 logoSide">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="col-sm-10 countInfo">
                                <p class="count"> {{element.account_count}} </p>
                                <hr class="card-divider">
                                <p class="userType"> {{element.account_type}} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>
<style scoped>
.logoSide{
    font-size: 20px;
    padding: -2px !important;
    background-color: white;
    color: #005b96;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.accountSizeCard{
    border: 1px solid #005b96;
    border-radius: 0px;
    padding: 0px !important;
}
.accountSizeCardBody{
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}
.card-divider{
    margin: 0px;
    background: #005b96;
}
.countInfo{
    border-left: 1px solid #005b96;
}
.count{
    font-size: 20px;
    margin:0px;
    padding: 0px;
}
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
    color: #011f4b;
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
    margin-bottom: 5px !important;
    padding-top: 30px;
}

.countCards{
    margin-bottom: 10px;
}
.userType{
    color: #005b96;
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 0px;
    font-size: 11px;
}
.userCountTable{
    padding: 0px;
    border-radius: 0px;
    margin-top: 20px;
}
.userCountTableHeader{
    padding-bottom: 3px;
    padding-left: 3px;
    padding-top: 3px;
    padding-right: 3px;
    background-color: white !important;
    border-bottom: none;
}
.cardloader{
    border: 1px solid rgb(202, 198, 198);
    border-radius: 0px;
    padding: 0px !important;
}
.card__image.loading {
    font-size: 20px;
    background-color: rgb(202, 198, 198) !important;
    width: 20px;
} 
.card__count{
    height: 15px;
    padding: 0px;
    margin-bottom: 5px;
}
.loader_divider {
    margin: 0px;
}
.card__count.loading {
    margin-top: 5px;
    width: 120px;
}
.card_divider {
    width: 100%;
}
.card_divider.loading { 
    height: 2px;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
}
.card__description.loading { 
    height: 11px; 
    border-radius: 3px;
    width: 120px; 
    margin-bottom: 5px;
    margin-top: 10px;
} 
.loading { 
    position: relative; 
    background-color: #e2e2e2; 
}
.loading::after { 
    display: block; 
    content: ""; 
    position: absolute; 
    width: 100%; 
    height: 100%; 
    transform: translateX(-100%); 
    background: -webkit-gradient(linear, left top, 
                right top, from(transparent),  
                color-stop(rgba(255, 255, 255, 0.2)), 
                to(transparent));
    background: linear-gradient(90deg, transparent, 
            rgba(255, 255, 255, 0.2), transparent);
    animation: loading 0.8s infinite; 
}
@keyframes loading { 
    100% { 
        transform: translateX(100%); 
    } 
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
      users: [],
      loader: true
    }
  },
  mounted(){
    this.retrieve()
  },
  computed: {
    returnUsers(){
      return this.users
    },
    displayLoader(){
      return this.loader
    }
  },
  methods: {
    retrieve(){
      this.APIRequest('accounts/accounts_count', {}).then(response => {
        this.loader = false
        this.users = response.data
      })
    }
  }
}
</script>
