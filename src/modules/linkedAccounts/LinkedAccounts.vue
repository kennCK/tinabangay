<template>
  <div style="margin-top: 25px;">
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead class="bg-primary">
        <td>Owner's Username</td>
        <td>Linked Account's Username</td>
        <td>Date</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-uppercase">{{item.owner_account.username}}</td>
          <td class="text-uppercase">{{item.account.username}}</td>
          <td class="text-uppercase">{{item.created_at_human}}</td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No linked accounts.'" :action="' You can link your account with your family, friends and company!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
  color: $white !important;
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import Vue from 'vue'

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
        }, {
          clause: 'or',
          column: 'owner',
          value: this.user.userID
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('linked_accounts/retrieve', parameter).then(response => {
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

