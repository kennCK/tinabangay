<template>
  <div style="margin-top: 25px;">
      <div class="row m-0 justify-content-end">
         <Pager
          :pages="numPages"
          :active="activePage"
          :limit="limit"
          />
      </div>
      <div v-if="data !== null">
        <table class="table table-responsive table-bordered" id="myTable" v-if="data !== null">
            <tr class="bg-primary" >
                <th scope="col">Business Name</th>
                <th scope="col">Sent</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>
            </tr>
            <tbody>
                <tr v-for="(item, index) in data" :key="index">
                <td>{{item.merchant.name}}</td>
                <td>{{item.created_at}}</td>
                <td>{{item.merchant.address}}</td>
                <td>
                    <button class="btn btn-primary" @click="viewHDF(item.code)">View</button>
                </td>
                </tr>
            </tbody>
        </table>
      </div>
    <empty v-if="data === null" :title="'No HDF sent!'" :icon="'far fa-building'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

.bg-black{
  color: $white !important;
  background: #000000 !important;
}

.bg-warning, .bg-danger{
  color: $white !important;
}

</style>
<script>

import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      numPages: null,
      activePage: 1,
      limit: 5,
      common: COMMON,
      user: AUTH.user,
      auth: AUTH,
      data: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    Pager
  },
  methods: {
    viewHDF(code){
      ROUTER.push('/form/' + code)
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }],
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('health_declarations/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          this.numPagesExport = parseInt(response.size / 100) + (response.size % 100 ? 1 : 0)
          this.totalSize = response.size
        }else{
          this.numPages = null
          this.totalSize = null
          this.numPagesExport = null
        }
      })
    }
  }
}
</script>
