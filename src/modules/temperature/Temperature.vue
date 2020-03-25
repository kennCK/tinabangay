<template>
  <div style="margin-top: 25px;">
    <table class="table table-responsive table-bordered" v-if="data !== null">
      <thead>
        <td>Read By</td>
        <td>Temperature</td>
        <td>Remarks</td>
        <td>Location</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.added_by}}</td>
          <td>{{item.value}} Degree Celsius</td>
          <td>{{item.remarks}}</td>
          <td>
            <!-- <label v-if="item.location !== null">
              {{item.location.route + ',' + item.location.locality + ', ' + item.location.country}}
            </label> -->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <empty v-if="data === null" :title="'No temperature readings available.'" :action="' You will get data here once frontliners will read your temperature via thermal scanner. Stay at Home!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty> -->
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
    this.retrieveLocations()
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
          this.retrieveValue()
          console.log('I found something')
        }else{
          this.data = null
          console.log('Nope. There\'s nothing here')
          // this.data = [{added_by: 'Hatdog', value: 37.8, remarks: 'kamatyunon'}, {added_by: 'Hatdog', value: 37.8, remarks: 'kamatyunon'}]
        }
      })
    },
    retrieveValue(){
      this.data.forEach((tempLoc, index) => {
        let parameter = {
          condition: [{
            clause: '=',
            column: 'id',
            value: tempLoc.temperature_id
          }]
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('temperatures/retrieve', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data.length > 0){
            this.data[index].value = response.data[0].value
            // this.data[index].value = 12
          }else{
            this.data = null
          }
        })
      })
    }
  }
}
</script>
