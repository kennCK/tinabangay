<template>
  <div>
    <div class="input-group my-3">
      <div class="input-group-preppend">
        <label for="filter" class="input-group-text">Filter By:</label>
      </div>
      <select v-model="filter" @change="retrieve()" name="filter" id="filter" class="custom-select w-25">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>

    <table class="table table-bordered" v-if="data !== null">
      <thead class="thead-primary">
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Message</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{formatTime(item.created_at)}}</td>
          <td>{{item.message}}</td>
          <td>{{item.status}}</td>
          <td><button class="btn" :class="item.status === 'pending' ? 'btn-success' : 'btn-warning'" @click="changeStatus(item.id, item.status)">{{item.status === 'pending'? 'Resolve' : 'Revert to Pending' }}</button></td>
        </tr>
      </tbody>
    </table>

    <empty v-else :title="'No feedback found!'" :action="'Keep up the good work!'"></empty>
  </div>
</template>
<style lang="scss" scoped>
  @import "~assets/style/colors.scss";

  .table .thead-primary {
    background-color: $primary;
    color: $white;
    & th {
      border-top: 1px solid $darkPrimary;
      border-bottom: 2px solid $darkPrimary;
      border-color: $darkPrimary;
    }
  }

  .input-group .input-group-preppend {
    position: relative;
    height: 34px;
    line-height: 32px;
    border: 1px solid $gray;
    color: #676767;
    border-right: none;
    background-color: #ddd;
    padding: 0 10px;
    border-radius: 3px 0 0 3px;

    & + .custom-select {
      border-radius: 0 3px 3px 0;
    }
  }
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import moment from 'moment'
export default {
  mounted() {
    $('#loading').css({display: 'block'})
    this.retrieve()
  },
  data() {
    return {
      user: AUTH.user,
      data: null,
      filter: 'all'
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue')
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    retrieve(){
      if(this.user.location === null){
        $('#loading').css({display: 'none'})
        return
      }
      let param = {
        condition: [{
          value: this.user.location.code,
          column: 'code',
          clause: '='
        }]
      }
      if(this.filter === 'resolved') {
        param.condition.push({
          value: 'resolved',
          column: 'status',
          clause: '='
        })
      } else if (this.filter === 'pending') {
        param.condition.push({
          value: 'pending',
          column: 'status',
          clause: '='
        })
      }

      this.APIRequest('complaints/retrieve', param).then(response => {
        if(response.data.length > 0) {
          this.data = response.data
        } else {
          this.data = null
        }
        $('#loading').css({display: 'none'})
      })
    },
    formatTime(time) {
      return moment(String(time)).format('LLL')
    },
    changeStatus(id, current) {
      let newStat = current === 'pending' ? 'resolved' : 'pending'
      let param = {
        id: id,
        status: newStat
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('complaints/update', param).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve()
      })
    }
  }
}
</script>
