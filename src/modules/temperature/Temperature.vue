<template>
  <div style="margin-top: 25px;">
    <div class="w-100 m-0 row justify-content-between mt-2 pt-0" v-if="data !== null">
      <div class="card card-half" v-for="(item, index) in data" :key="index.id" style="margin-bottom: 10px">
        <div class="card-block px-3">
          <h6 class="card-title" style="margin-top: 15px">Added By: {{item.added_by_account.username}}</h6>
          <table class="w-100">
            <tr>
              <td>
                <div class="card-title" style="font-size: 15px; margin: 15px 0;"><b>Reading:</b> {{item.value}} &#8451;</div>
              </td>
              <td>
                <div class="card-title" style="font-size: 15px; margin: 15px 0;"><b>Remarks:</b> {{item.remarks ? item.remarks : 'None'}}</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="card-title" style="font-size: 15px; margin: 15px 0;">
                  <span v-if="item.temperature_location !== null">{{item.temperature_location.route + ', ' + item.temperature_location.locality + ', ' + item.temperature_location.country}}</span>
                  <span v-else>Not Specified</span>
                </div>
              </td>
              <td>
                {{item.created_at_human}}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <empty v-if="data === null" :title="'No temperature readings available.'" :action="' You will get data here once frontliners will read your temperature via thermal scanner. Stay at Home!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
}

.card.card-half {
  width: 49%;
  margin: .5%;
}

@media (max-width: 767px) {
  .card.card-half {
    width: 100%;
    margin: 0;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import moment from 'moment'
import Vue from 'vue'

export default {
  mounted(){
    let data = JSON.parse(localStorage.getItem('temperatures/' + this.user.code))
    if(data){
      if(data.data.length > 0){
        this.data = data.data
      }else{
        this.data = null
      }
      this.retrieve(false)
    }else{
      this.data = null
      this.retrieve(true)
    }
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
    retrieve(flag){
      let parameter = {
        condition: [{
          clause: '=',
          column: 'account_id',
          value: this.user.userID
        }],
        sort: {
          created_at: 'desc'
        }
      }
      $('#loading').css({display: flag ? 'block' : 'none'})
      this.APIRequest('temperatures/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        localStorage.setItem('temperatures/' + this.user.code, JSON.stringify(response))
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

