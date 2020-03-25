<template>
  <div v-if="data !== null" class="holder">
    <input type="text" class="form-control" v-model="searchValue" placeholder="Search location" @keyup="filterLocation()">
    <div class="card" v-for="(item, index) in result" :key="index" style="margin-bottom: 10px;" >
      <div>
        <div class="card-block px-3">
          <h6 class="card-title" style="margin-top:15px">
            {{item.route}} , {{item.locality === 'testin' ? 'true' : item.locality}}
          </h6>
          <h6 class="card-title " style="font-size: 15px; margin-top:15px; ">{{item.country}}</h6>                            
          <span class="card-title">
            <b-button variant="danger" style="margin-bottom: 25px; margin-bottom: 5px; ">
              POSITIVE<b-badge class="badge" variant="light">{{item.positive_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
            <b-button variant="warning" style="margin-bottom: 25px; margin-bottom: 5px;">
              PUI<b-badge class="badge" variant="light">{{item.pui_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
            <b-button variant="primary" style="margin-bottom: 25px; margin-bottom: 5px;"> 
              PUM<b-badge class="badge" variant="light">{{item.pum_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
            <b-button variant="info" style="margin-bottom: 25px; margin-bottom: 5px;">
             NEGATIVE<b-badge class="badge" variant="light">{{item.negative_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
          </span>
        </div> 
      </div> 
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}
.badge{
  margin-left: 5px;
}
.card-title{
  width: 100%;
  float: left;
}

.holder{
  width: 60%;
  float: left;
  margin-top: 25px;
}

.form-control{
  height: 45px !important;
  margin-bottom: 25px;
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
      data: null,
      searchValue: null,
      result: null
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
        this.result = this.data
      })
    },
    filterLocation(){
      this.result = this.data.filter(item => {
        return item.route.toLowerCase().indexOf(this.searchValue) > -1
      })
    }
  }
}
</script>
