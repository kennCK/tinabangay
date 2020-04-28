<template>
  <div class="holder">
    <div class="form-group">
      <select class="form-control" v-model="selectedOption">
        <option v-for="(item, index) in options" :key="index" :value="item.value">{{item.title}}</option>
      </select>
      <select class="form-control" v-model="selectedCountry">
        <option v-for="(item, index) in country" :key="index">{{item.title}}</option>
      </select>
      <input type="text" v-model="selectedRegion" class="form-control" placeholder="Region">
      <input type="text" v-model="selectedLocality" class="form-control" placeholder="Town or City">
      <select class="form-control" v-if="selectedOption === 'visited_places'">
        <option v-for="(item, index) in 10" :key="index">{{100 * item}} Meters radius</option>
      </select>
      <button class="btn btn-primary" @click="retrieve()">Search</button>
    </div>
    <div class="form-group">
      <button class="btn btn-primary">VIEW ON MAP</button>
    </div>
    <table v-if="data.length > 0" class="table table-bordered table-responsive">
      <thead class="bg-primary">
        <td>Location <i class="fa fa-chevron-down pull-right"></i><i class="fa fa-chevron-up pull-right"></i></td>
        <td>Status <i class="fa fa-chevron-down pull-right"></i><i class="fa fa-chevron-up pull-right"></i></td>
        <td>Actions</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td><i class="fa fa-user"></i> 
            {{item.route + ', ' + item.locality + ', ' + item.country}}
          </td>
          <td>
            <span class="badge badge-primary text-uppercase">IN CONTACT WITH POSITIVE</span>
          </td>
          <td>
            <i class="fa fa-envelope text-danger action-link"></i>
            <i class="fa fa-map-marker text-primary action-link"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-else :title="'No data available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.holder{
  margin-top: 25px;
}

.form-control{
  float: left !important;
  width: 15% !important;
  margin-right: 5px;
  height: 45px !important;
}

.btn{
  height: 45px !important;
}
.bg-primary{
  background: $primary !important;
  color: $white !important;
}
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
      user: AUTH.user,
      country: [{
        title: 'Philippines',
        code: 'Philippines'
      }],
      locality: null,
      region: null,
      options: [{
        title: 'Visited Places',
        value: 'visited_places'
      }, {
        title: 'Transporation Used',
        value: 'transportation_used'
      }],
      selectedOption: 'visited_places',
      data: [],
      selectedCountry: 'Philippines',
      selectedRegion: '',
      selectedLocality: ''
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
      if(this.selectedRegion === '' && this.selectedLocality === ''){
        return
      }
      let parameter = {
        condition: [{
          clause: '=',
          column: 'country',
          value: this.selectedCountry
        }, {
          clause: 'like',
          column: 'region',
          value: this.selectedRegion + '%'
        }, {
          clause: 'like',
          column: 'locality',
          value: this.selectedLocality + '%'
        }],
        sort: {
          route: 'asc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('visited_places/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    }
  }
}
</script>
