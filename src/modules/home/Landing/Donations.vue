<template>
	<div class="cw-features">
    <div class="header">
      <span class="title text-green text-center">
        <h1>Bayanihan ; Spirit of Communal Unity and Cooperation</h1>
      </span>
      <span class="description">
        <h6></h6>
      </span>
    </div>
    <div class="holder d-flex flex-row justify-content-center my-4">

      <a href="#" class="item text-light d-flex flex-column justify-content-center align-items-center py-5" :style="{'background': 'linear-gradient(to left, ' + item.backgroundColor+'50, '+item.backgroundColor+'c0), url('+item.backgroundImg+') center/cover no-repeat'}" v-for="item, index in data" v-if="data !== null">
        <span class="icon text-center mb-1 mt-3">
          <div class="position-relative mx-auto" :style="{'-webkit-mask': 'url('+item.img+') center/50% no-repeat'}"></div>
        </span>
        <div class="description mx-5 px-3 text-center mt-5">
          <button type="button" class="btn btn-dark btn-lg font-weight-bold">Donate</button>
        </div>
      </a>
      
    </div>
        <span class="description text-center">
            <h2>Time is not on our side but you can be</h2>
            <p>
              As more municipalities and people use <b>Bird's Eye</b> the cost for our domain and utilities also increase. We need help 
            </p>
         </span>
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
  width: 100%;
  float: left;
}
.item{
  width: 33%;
  float: left; 
  min-height: 150px;
}
.item span{
  width: 100%;
  float: left;
}
.item .icon div{
  height: 55px;
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
    color: #26afff50;
  }
}
</style>
<script>
import ROUTER from '../../../router'
import AUTH from '../../../services/auth'
import SETTINGS from 'src/modules/home/settings.js'
export default {
  mounted(){
  },
  data(){
    return {
      data: [
        {img: SETTINGS.page[0].paypal, backgroundColor: '#26b0ff', backgroundImg: require('assets/img/paypal-background.jpg')},
        {img: SETTINGS.page[0].gcash, backgroundColor: '#297dfa', backgroundImg: require('assets/img/gcash-background.jpeg')},
        {img: SETTINGS.page[0].paymaya, backgroundColor: '#1760ff', backgroundImg: require('assets/img/paymaya-background.png')}
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
