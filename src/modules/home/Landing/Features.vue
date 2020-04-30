<template>
	<div class="cw-features" v-if="data !== null">
    <div class="header">
      <span class="title text-green text-center">
        <h1>Application Features</h1>
      </span>
      <span class="description">
        <h6></h6>
      </span>
    </div>
    <div class="holder d-flex flex-row justify-content-center flex-wrap">
      <div class="item shadow bg-white text-dark mx-5" v-for="(item, index) in data" v-bind:key="index">
        <span class="icon text-green text-center">
          <i :class="item.icon"></i>
        </span>
        <span class="title text-center text-green">
          <h5>{{item.title}}</h5>
        </span>
        <span class="description">
          {{item.description}}
        </span>
      </div>

      <!-- <a class="mx-auto w-100 d-flex flex-row justify-content-center mb-5" href='#'>
        <img class="img-fluid w-15" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a> -->
    </div>
	</div>
  
</template>
<style scoped>
.cw-features{
  width: 100%;
  float: left;
  min-height: 500px;
  background: #fff;
  overflow-y: hidden;
}
.header{
  width: 90%;
  float: left;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 50px;
}
.holder{
  width: 90%;
  float: left;
  margin: 50px 5% 0 5%;
}
.item{
  width: 21%;
  margin-right: 2%;
  min-height: 250px;
  margin-left: 2%;
}
.item span{
  width: 100%;
  float: left;
}
.item .icon{
  font-size: 50px;
}
.item .title{
  margin-top: 25px;
}

.item .description{
  text-align: justify;
  margin-top: 25px;
}

.w-15{
  width:15%!important
}

@media screen and (max-width: 992px){
  .holder, .item{
    width: 90%;
    margin: 25px 5% 0 5%;
  }
}
</style>
<script>
import ROUTER from '../../../router'
import AUTH from '../../../services/auth'
export default {
  mounted(){
  },
  data(){
    return {
      data: [
        {title: 'LOCATION MATCHING AND MAPPING', description: 'MATCH AND MAP SPECIFIC VISITED PLACES OF INDIVIDUAL TO THE VISITED PLACES OF AFFECTED ONES. EXAMPLES ARE VISITED MARKETS, MALLS, COFFEE SHOP AND MORE.', icon: 'fas fa-map-marker'},
        {title: 'TRANSPORTATION MATCHING AND MAPPING', description: 'MATCH AND MAP PREVIOUSLY USED TRANSPORTATION  BY INDIVIDUAL TO THE AFFECTED ONES. EXAMPLES ARE PLANE FIGHT #123, BUSES, SHIPPINGS, PRIVATE CARS, CARPOOLS, AND MORE.', icon: 'fas fa-bus'},
        {title: 'TEMPERATURE MANAGEMENT', description: 'MONITOR AND MANAGE THE TEMPERATURE OF INDIVIDUAL EVERY AFTER READING USING ANY THERMAL SCANNERS.', icon: 'fas fa-thermometer-half'},
        {title: 'PATIENTS RECORDING', description: 'RECORD PATIENTS CONSIDERED AS PUI, PUM, POSITIVE, OR NEGATIVE, AS WELL AS THE DECEASED. ONCE A PATIENT’S IS UPDATED, THEN ALL PLACES HE VISITED, AND TRANSPORTATION HE RODE WILL ALSO BE UPDATED.', icon: 'fas fa-sitemap'},
        {title: 'MASS TESTING RECORDING', description: 'ALLOW AUTHORIZED USERS TO MANAGE AND MONITOR THE IMPLEMENTATION OF THE MASS TESTING, RECORD AND UPDATE THE RESULTS OF THE TESTS. IF A USER’S RESULTS ARE STILL PENDING, THEY ARE TO SELF-QUARANTINE UNTIL THEIR RESULTS ARE AVAILABLE.', icon: 'fas fa-users'},
        {title: 'CONTACT TRACING', description: 'ALLOW DOH AND GOVERNMENT AGENCIES TO HAVE A BIRDSEYE VIEW OF ALL LOCATIONS, NUMBER OF INDIVIDUALS AND MODES OF TRANSPORTATION.', icon: 'fas fa-users'},
        {title: 'QR CODE', description: 'THIS IS AUTO GENERATED ONCE A USER IS REGISTERED. THIS WILL ALLOW THE EASIER SCANNING AND RECORDING OF USER  INFORMATION SUCH AS TRANSPORTATION USED,  VISITED PLACES, PATIENT DETAILS AND TEMPERATURE HISTORY.', icon: 'fas fa-qrcode'}
      ]
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
