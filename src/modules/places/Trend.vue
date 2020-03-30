<template>
  <div class="col-lg-6" style="margin-bottom: 25px;">
    <div v-if="data !== null">
      <div class="row m-0 bg-primary py-2 px-3 text-light font-weight-bold mb-3 justify-content-between align-items-center">
        <span>Top Affected Places</span>
        <button class="btn btn-light" @click="redirect('places/trend')">View more</button>
      </div>
      <div class="card" v-for="(item, index) in (data.length > 5 ? 5 : data.length)" :key="index" style="margin-bottom: 10px;">  
        <div>
          <div class="card-block px-3">
            <h6 class="card-title" style="margin-top:15px">
              {{data[index].route}} , {{data[index].locality === 'testin' ? 'true' : data[index].locality}}
            </h6>
            <h6 class="card-title " style="font-size: 15px; margin-top:15px; ">{{data[index].country}}</h6>                            
            <span class="card-title">
              <b-button variant="dark" style="margin-bottom: 25px; margin-bottom: 5px; ">
                DEATH<b-badge class="badge" variant="light">{{data[index].death_size}} <span class="sr-only">unread messages</span></b-badge>
              </b-button>
              <b-button variant="danger" style="margin-bottom: 25px; margin-bottom: 5px; ">
                POSITIVE<b-badge class="badge" variant="light">{{data[index].positive_size}} <span class="sr-only">unread messages</span></b-badge>
              </b-button>
              <b-button variant="warning" style="margin-bottom: 25px; margin-bottom: 5px;">
                PUI<b-badge class="badge" variant="light">{{data[index].pui_size}} <span class="sr-only">unread messages</span></b-badge>
              </b-button>
              <b-button variant="primary" style="margin-bottom: 25px; margin-bottom: 5px;"> 
                PUM<b-badge class="badge" variant="light">{{data[index].pum_size}} <span class="sr-only">unread messages</span></b-badge>
              </b-button>
              <b-button variant="success" style="margin-bottom: 25px; margin-bottom: 5px;">
              NEGATIVE<b-badge class="badge" variant="light">{{data[index].negative_size}} <span class="sr-only">unread messages</span></b-badge>
              </b-button>
            </span>
          </div> 
        </div> 
      </div>
    </div>
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
