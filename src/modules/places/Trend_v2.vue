<template>
  <div class="col-lg-7" style="margin-bottom: 25px;">
    <div v-if="data !== null">
      <div class="row m-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3 justify-content-between align-items-center">
        <span>Top Affected Places</span>
        <button class="btn btn-light" @click="redirect('places/trend')">View more</button>
      </div>
      <div class="card" v-for="(item, index) in (data.length > 5 ? 5 : data.length)" :key="index" style="margin-bottom: 10px;">  
        <div>
          <div class="card-block px-2">
            <h6 class="card-title" style="margin-top:15px">
              {{data[index].route}} , {{data[index].locality === 'testin' ? 'true' : data[index].locality}}
            </h6>
            <h6 class="card-title " style="font-size: 15px; margin-top:15px; ">{{data[index].country}}</h6>
            <div class="col-12">
            <!-- Card for positive -->
            <span class="card-title col-4 p-1">
              <span class="card text-white bg-danger" style="max-width: 9rem;">
                <span class="card-header"><h5 class="card-title text-center" v-if="data[index].positive_size > 0">{{data[index].positive_size}}</h5></span>
                <span class="card-body p-0 mx-auto">Positive</span>
              </span>
            </span>               
            <!-- Card for recovered -->
            <span class="card-title col-4 p-1">
              <span class="card text-white bg-success" style="max-width: 9rem;">
                <span class="card-header"><h5 class="card-title text-center" v-if="data[index].recovered_size > 0">{{data[index].recovered_size}}</h5></span>
                <span class="card-body p-0 mx-auto">Recovered</span>
              </span>
            </span>
            <!-- Card for deaths -->
            <span class="card-title col-4 p-1">
              <span class="card text-white bg-dark" style="max-width: 9rem;">
                <span class="card-header"><h5 class="card-title text-center" v-if="data[index].death_size > 0">{{data[index].death_size}}</h5></span>
                <span class="card-body p-0 mx-auto" v-if="data[index].death_size > 1">Deaths</span>
                <span class="card-body p-0 mx-auto" v-if="data[index].death_size == 1">Death</span>
              </span>
            </span>
            </div>          
          </div> 
        </div> 
      </div>
    </div>
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
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
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
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>
