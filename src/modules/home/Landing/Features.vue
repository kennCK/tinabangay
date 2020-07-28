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
        {title: 'Location Matching and Mapping', description: 'Match and map specific visited places of individuals to the visited places of affected ones. Examples are visited markets, malls, coffee shops and more.', icon: 'fas fa-map-marker'},
        {title: 'Transportation Matching and Mapping', description: 'Match and map previously used transportation by individuals to the affected ones. Examples are plane flight #123, buses, ships, private cars, carpools, and more.', icon: 'fas fa-bus'},
        {title: 'Temperature Management', description: 'Monitor and manage the temperature of individuals every after reading using any thermal scanner.', icon: 'fas fa-thermometer-half'},
        {title: 'Patients Recording', description: 'Record patients considered as PUI, PUM, POSITIVE, or NEGATIVE, as well as the deceased. Once a patient\'s status is updated, then all places he visited, and transportation he used will also be updated.', icon: 'fas fa-sitemap'},
        {title: 'Mass Testing Recording', description: 'Allow authorized users to manage and monitor the implementation of the mass testing, record and update the test results. If a user\'s results are still pending, they are to self-quarantine until their results are available.', icon: 'fas fa-users'},
        {title: 'Contact Tracing', description: 'Allow DOH and Government Agencies to have a birdseye of all locations, number of individuals, and modes of transportation.', icon: 'fas fa-street-view'},
        {title: 'Symptoms Reporting', description: 'Encourage individual and allow barangay level to report symptoms', icon: 'fas fa-user-injured'},
        {title: 'QR Code', description: 'A unique auto generated QR code for each registered user will allow for easier scanning and recording of the user\'s information such as transportation used, visited places, patient details, and temperature history.', icon: 'fas fa-qrcode'},
        {title: 'Live Alerts', description: 'Send e-mails/notifications to administrator accounts when scanned results is not clear the past 14 days.', icon: 'fas fa-exclamation-triangle'},
        {title: 'Health Declaration Form', description: 'Request your customers to fill in the Health Declaration. This is required for hotels and restaurants as required by DOT and optional to other industries.', icon: 'fas fa-file-alt'},
        {title: 'Link Employee Accounts', description: 'Link the personal accounts of your employees to your main business account to track their health status and keep your business safe.', icon: 'fas fa-id-card'},
        {title: 'Multiple Branches and Locations', description: 'Add and assign building, branch, or office to your employee accounts. You can also print the generated QR code to the location entrance', icon: 'fas fa-building'}
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
