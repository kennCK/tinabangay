<template>
  <div>
    <topAffectedPlaces v-if="data !== null" ref="realtimeChart" height="500" type="bar" :options="options" :series="series"></topAffectedPlaces>
    <empty v-else :title="'There\'s currently no hot spots logged.'" :action="'Stay Home!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
}
.badge{
  margin-left: 5px;
}
.card-title{
  width: 100%;
  float: left;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import topAffectedPlaces from 'vue-apexcharts'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null,
      chart: null,
      data_categories: [],
      options: {},
      series: [
        {
          name: 'positive',
          data: []
        },
        {
          name: 'recovered',
          data: []
        },
        {
          name: 'death',
          data: []
        }
      ]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    topAffectedPlaces
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        status: 'positive'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tracing_places/places', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          let series = [[], [], []]
          for(var i = 0; i < 5; ++i){
            // let routes = response.data[i].route.split(',')
            // routes.push(response.data[i].locality)
            // console.log(routes)
            this.data_categories.push([response.data[i].route + ', ', response.data[i].locality])
            series[0].push(response.data[i].positive_size)
            series[1].push(response.data[i].recovered_size)
            series[2].push(response.data[i].death_size)
          }
          this.options = {
            chart: {
              id: 'topAffected'
            },
            title: {
              text: 'TOP AFFECTED PLACES',
              align: 'center',
              margin: 10,
              offsetX: 0,
              offsetY: 0,
              floating: false,
              style: {
                fontSize: '25px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#007be0'
              }
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              type: 'category',
              categories: this.data_categories,
              maxHeight: 500,
              labels: {
                show: true,
                rotate: -45,
                rotateAlways: true,
                hideOverlappingLabels: false,
                showDuplicates: false,
                trim: true,
                minHeight: undefined,
                maxHeight: 120,
                style: {
                  colors: [],
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-xaxis-label'
                },
                offsetX: 0,
                offsetY: 0
              }
            },
            colors: ['#007be0', 'rgba(0, 227, 150, 0.85)', 'rgba(255, 69, 96, 0.85)']
          }

          this.series = [
            {
              name: 'positive',
              data: series[0]
            },
            {
              name: 'recovered',
              data: series[1]
            },
            {
              name: 'death',
              data: series[2]
            }
          ]
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>
