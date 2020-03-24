<template>
  <div>
    <button class="btn btn-primary pull-right" style="margin-bottom: 25px; margin-top: 25px;">New Place</button>
    <table class="table table-responsive table-bordered">
      <thead>
        <td>Location</td>
        <td>Date</td>
        <td>Time</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
export default {
  mounted(){
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        condition: [{
          clause: '=',
          column: 'acccount_id',
          value: this.user.value
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('visited_places', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    }
  }
}
</script>
