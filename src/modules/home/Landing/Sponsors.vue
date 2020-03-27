<template>
	<div class="cw-features bg-light">
    <div class="header">
      <span class="title text-green text-center">
        <h1>Many Thanks to Our Sponsors!</h1>
      </span>
      <span class="description">
        <h6></h6>
      </span>
    </div>
    <div class="holder d-flex flex-row justify-content-center align-items-center my-4 row w-100 mx-0 p-0">
      <div class="border-0 m-3" style="max-width: 25rem;" v-for="(item, index) in data" :key="index">
        <div class="p-3 bg-dark text-light text-capitalize">
          <h6 v-if="!item.img">{{item.name}}</h6>
          <img v-else :src="item.img" :alt="item.name" class="img-fluid">
        </div>
      </div>
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
.shadow{
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.header{
  width: 90%;
  float: left;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 50px;
}
.text-capitalize {
  text-transform: uppercase !important;
}
.holder{
  width: 100%;
  float: left;
}
.item{
  float: left; 
  min-height: 150px;
}
.item span{
  width: 100%;
  float: left;
}
.item .icon div{
  height: 80px;
  width: 100%;
  background: currentColor;
}
.item .title{
  margin-top: 25px;
}

.item .description{
  text-align: justify;
  margin-top: 25px;
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
      data: [{name: 'Jet Mariscal'}, {name: 'Hiacynth Mariscal'}, {img: require('assets/img/contributors/usc.png'), name: 'University of San Carlos'}, {img: require('assets/img/contributors/increment-tech.png'), name: 'Increment Technologies'}]
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
