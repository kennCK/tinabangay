<template>
	<div class="incre-row">
    <div v-for="(item, index) in settings.page" :key="index" class="cw-banner" :style="{'background': item.background}">
      <div class="image" v-if="item.template === 'left'">
        <img :src="item.image" style="margin-bottom: 5px;" width="100%">
      </div>
      <div class="text" :class="item.textColor">
        <span class="title">
          <h1>{{item.title}}</h1>
        </span>
        <span class="subtitle">
          <h2>{{item.subtitle}}</h2>
        </span>
        <span class="description">
          <h4>
            {{item.description}}
          </h4>
        </span>
          <a class="" href='https://l.facebook.com/l.php?u=https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1JrfU5DYjTZrqglKuYpKMO_Lg17vYQvFw%2Fview%3Fusp%3Ddrivesdk%26fbclid%3DIwAR264s9mBWEoICV4w3s-PrOCQJ0CgDbGeB9kEhAKXQ3opsYxlJ7ByMEfApc&h=AT2UDYGqoTmRRSx1wgAuku7HE6-ke-k69Uzi3JgF2J6XIsdXtw0-CkhJBLvvpDVC-I6tQyXEw7xaUHAdP6Cjg4-n_Y0sErCV9OutLOaEerTlml7jMETYQsnMqc8JIP3CXTc'>
          <img class="button img-fluid float-left mt-3" alt='Get it on Google Play' :src="require('assets/img/playstore.png')"/></a>
      </div>
      <div class="image" v-if="item.template === 'right'">
        <img :src="item.image" style="margin-bottom: 5px;" width="100%">
      </div>
    </div>
	</div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.cw-banner{
  width: 100%;
  float: left;
  height: 600px;
}
.text{
  width: 45%;
  float: left;
  margin-left: 5%;
  margin-top: 150px;
}
.text .title{
  width: 100%;
  float: left;
}
.title h1{
  font-size: 50px;
}
.text .description{
  margin-top: 25px;
  width: 100%;
  float: left;
  text-align: justify;
}
.image{
  width: 40%;
  margin-right: 5%;
  float: left;
  margin-left: 5%;
  display: block;
}
.button{
  position:left;
  width:194px;
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

  .image{
    display: none;
  }
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import SETTINGS from 'src/modules/home/settings.js'
export default {
  mounted(){
  },
  data(){
    return {
      settings: SETTINGS
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
