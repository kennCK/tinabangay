<template>
  <div style="margin-top: 25px;">
    <table class="table table-responsive table-bordered" >
      <thead>
        <td>Read By</td>
        <td>Temperature</td>
        <td>Remarks</td>
        <td>Location</td>
      </thead>
      <tbody v-if="data !== null">
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.added_by}}</td>
          <td>{{item.value}} Degree Celsius</td>
          <td>{{item.remarks}}</td>
          <td>
            <label v-if="item.route !== null">
              {{item.route + ',' + item.locality + ', ' + item.country}}
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No temperature readings available.'" :action="' You will get data here once frontliners will read your temperature via thermal scanner. Stay at Home!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import ModalProperty from 'src/modules/places/CreatePlaces.js'
export default {
  mounted(){
    this.retrieveValue()
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
    retrieveLocations(){
      console.log('retrieving locations...')
      let parameter = {
        condition: [{
          clause: '=',
          column: 'account_id',
          value: this.user.userID
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('temperature_locations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          // this.retrieveValue()
        }else{
          this.data = null
          console.log('Nope. There\'s nothing here')
        }
      })
    },
    retrieveValue(){
      let parameter = {
        condition: [{
          clause: '=',
          column: 'id',
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
