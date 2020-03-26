<template>
  <div class="cw-snetwork bg-light">
    <div class="text text-green text-center">
      <h1>Contributors</h1>
    </div>
    <div class="card-holder">
      <div class="card img-full" v-for="(item, index) in data" :key="index" :style="{'background-image': 'url('+item.img+')'}">
        <div class="card-body pt-4 text-light">
          <h5 class="card-title text-green">{{item.name}}</h5>
          <p class="card-text">{{item.org}} <br> {{item.position}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cw-snetwork{
  width: 100%;
  float: left;
  min-height: 650px;
  overflow-y: hidden;
}

.card.img-full {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 250px;
  border-radius: 10px;
}

.card.img-full.shadow {
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.card.img-full .card-body {
  position: absolute;
  width: 100%;
  bottom: 0;
  min-height: 40%;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 50%);
  border-radius: 0 0 10px 10px;
}

.text{
  width: 90%;
  float: left;
  margin-right: 10%;
  margin-top: 50px;
  height: 50px;
  margin-left: 5%;
  margin-right: 5%;
}

.text .title{
  width: 100%;
  float: left;
}

.title h1{
  font-size: 40px;
}

.text .description{
  margin-top: 25px;
  width: 100%;
  float: left;
  text-align: justify;
}

.image{
  width: 40%;
  margin-left: 10%;
  float: left;
  margin-top: 150px;
  display: block;
}
.card-holder{
  width: 90%;
  float: left;
  margin-left: 5%;
  margin-right: 5%;
}
.card{
  width: 24%;
  float: left;
  margin-right: 1%;
  margin-top: 10px;
  margin-top: 10px;
}
.card-body{
  text-align: justify;
}

@media screen and (max-width: 992px){
  .text{
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 50px;
  }

  .title{
    text-align: center;
  }

  .card{
    width: 100%;
    margin-left: 0%;
    margin-right: 0%;
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
        {name: 'Kennette Canales', org: 'Increment Technologies | University of San Carlos', position: 'Owner | Faculty', img: require('assets/img/contributors/kennette.jpg')},
        {name: 'Patrick Elalto', org: 'University of San Carlos', position: 'Faculty', img: require('assets/img/contributors/patrick.jpg')},
        {name: 'Yol Torres', org: 'University of San Carlos | Passerelles Numeriques Philippines', position: 'Student', img: require('assets/img/contributors/yol.jpg')},
        {name: 'Elsie Kathryn Tagupa', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/elle.jpg')},
        {name: 'Kent Yohann Bacatan', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/kent.png')},
        {name: 'Ismael Francisco', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/ismael.jpg')},
        {name: 'Jeanille Abayon', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/jeanille.jpg')},
        {name: 'Nicole Amber Mariscal', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/nicole.jpg')},
        {name: 'Brant Francis Uy', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/brant.jpg')},
        {name: 'Monica Claire Apor', org: 'University of San Carlos', position: 'Student', img: require('assets/img/contributors/monica.png')}
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
