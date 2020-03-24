<template>
	<div class="cw-features">
    <div class="header">
      <span class="title text-green text-center">
        <h1>Application Features</h1>
      </span>
      <span class="description">
        <h6></h6>
      </span>
    </div>
    <div class="holder">

      <span class="item" v-for="item, index in data" v-if="data !== null">
        <span class="icon text-green text-center">
          <i :class="item.icon"></i>
        </span>
        <span class="title text-center text-green">
          <h5>{{item.title}}</h5>
        </span>
        <span class="description">
          {{item.description}}
        </span>
      </span>
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
  float: left; 
  margin-right: 2%;
  min-height: 350px;
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
        {title: 'Visited Places', description: 'List visited places for affected indviduals. You can view also if your visited places matches with affected visited places for COVID19.', icon: 'fas fa-map-marker'},
        {title: 'Temperature Reading', description: 'Anaylise temperature within the area. Government Agencies can check the history of temperature of indviduals living within its area.', icon: 'fas fa-chart-line'},
        {title: 'Tracings', description: 'Government Agencies can trace indviduals based on the visited places listed and visited places listed from affected indviduals', icon: 'fas fa-sitemap'},
        {title: 'Patient Monitoring', description: 'Government Agencies can manage patients information and trace indviduals that might have contact with.', icon: 'fas fa-sitemap'}
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
