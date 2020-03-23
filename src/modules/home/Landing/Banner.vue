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
        <span class="description">
          <h4>
            {{item.description}}
          </h4>
        </span>
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
  margin-top: 100px;
  display: block;
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
