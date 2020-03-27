<template>
  <div style="margin-top: 25px;">
    <table class="table table-responsive table-bordered" >
      <thead>
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
          <td>{{item.remarks==null?'none':item.remarks}}</td>
          <td>{{item.temperature_location != null?item.temperature_location.route + ',' + item.temperature_location.locality + ', ' + item.temperature_location.country:''}}</td>
          <td>{{item.created_at}}</td>
            <label v-if="item.temperature_location !== null">
              {{item.temperature_location.route + ',' + item.temperature_location.locality + ', ' + item.temperature_location.country}}
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
    this.retrieveLocations()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: [
        {'id': 1, 'account_id': 1, 'added_by_account': {'username': 'test'}, 'value': 30, 'remarks': null, 'created_at': '2020-03-25 00:00:00', 'updated_at': null, 'deleted_at': null, 'temperature_location': {'route': 'route', 'locality': 'locality', 'country': 'country'}}]
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
      console.log('connecting...')
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
        }else{
          this.data = null
        }
      }).catch(err => {
        alert(err.ToString())
        console.log(err)
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
            console.log(this.data)
          }else{
            this.data = null
            // these are just test values this.data = [{route: 'asdf', locality: 'hatdog', country: 'Germany', added_by: 'Ice cream', value: '35', remarks: 'bugnaw keyo'}, {route: 'fdsa', locality: 'cornedbeef', country: 'Japan', added_by: 'Sisig', value: '39', remarks: 'init keyo'}]
          }
        })
      })
    }
  }
}
</script>

