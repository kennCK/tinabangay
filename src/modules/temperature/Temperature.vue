<template>
  <div style="margin-top: 25px;">
    <table class="table table-responsive table-bordered" v-if="data !== null">
      <thead class="bg-primary">
        <td>Read By</td>
        <td>Temperature</td>
        <td>Remarks</td>
        <td>Location</td>
        <td>Date</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index.id">
          <td>{{item.added_by_account.username}}</td>
          <td>{{item.value}} Degree Celsius</td>
          <td>{{item.remarks === null ? 'none' : item.remarks}}</td>
          <td>
            <label v-if="item.temperature_location !== null">
              {{item.temperature_location.route + ',' + item.temperature_location.locality + ', ' + item.temperature_location.country}}
            </label>
            <label v-else>
              Not Specified
            </label>
          </td>
          <td>{{item.created_at_human}}</td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No temperature readings available.'" :action="' You will get data here once frontliners will read your temperature via thermal scanner. Stay at Home!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
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
        condition: [{
          clause: '=',
          column: 'account_id',
          value: this.user.userID
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('temperatures/retrieve', parameter).then(response => {
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

