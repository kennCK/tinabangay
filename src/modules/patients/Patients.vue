<template>
  <div style="margin-top: 25px;">
    <basic-filter 
      v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']"></basic-filter>

    <table class="table table-responsive table-bordered" id="myTable">
      <tr class="bg-primary">
        <td>Status</td>
        <td>Patient's Username <i class="fa fa-caret-down float-right" @click="sortTable(1)"></i></td>
        <td>Contact Number</td>
        <td>Date Recorded</td>
      </tr>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td class="text-uppercase" :class="{'bg-black': item.status === 'death', 'bg-danger': item.status === 'positive', 'bg-warning': item.status === 'pum', 'bg-primary': item.status === 'pui', 'bg-success': item.status === 'negative'}">{{item.status}}</td>
          <td><i class="fa fa-map-marker text-primary" @click="selectedItem = item" data-toggle="modal" data-target="#visited_places" title="Visited Places" alt="Visited Places" ></i> {{item.account.username}}</td>
          <td>{{item.account.information.contact_number ? item.account.information.contact_number : 'Not Specified'}}</td>
          <td>{{item.created_at_human}}</td>
        </tr>
      </tbody>
    </table>
    
    <!--MODAL FOR VISITED PATIENTS-->
    <div class="modal fade right" id="visited_places" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Visited Places</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4" v-if="selectedItem !== null">
            <table class="table table-responsive table-bordered"  id="myTable2">
              <thead class="bg-primary">
                <td>Date</td>
                <td> <i class=" fa fa-caret-down float-right" @click="sortTable2(1)"></i>Time</td>
                <td>Establishment</td>
                <td>City</td>
                <td>Country</td>
              </thead>
             <tbody>
              <tr v-for="(item, index) in selectedItem.places" :key="index">
                <td>{{item.date_human}}</td>
                <td>{{item.time}}</td>
                <td>{{item.route}}</td>
                <td>{{item.locality}}</td>
                <td>{{item.country}}</td>
              </tr>
             </tbody>
            </table>
        </div>
      </div>
    </div>
</div>
    <increment-modal :property="modalProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
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
import ModalProperty from 'src/modules/places/CreatePlaces.js'
export default {
  mounted(){
   // this.retrieve()
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      auth: AUTH,
      modalProperty: ModalProperty,
      selectedItem: null,
      data: null,
      config: CONFIG,
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Status ascending',
          payload: 'status',
          payload_value: 'asc'
        }, {
          title: 'Status descending',
          payload: 'status',
          payload_value: 'desc'
        }]
      }],
      filter: null,
      sort: null
    }
  },
  components: {
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort, filter){
      if(sort !== null){
        this.sort = sort
      }
      if(filter !== null){
        this.filter = filter
      }
      if(sort === null && this.sort !== null){
        sort = this.sort
      }
      if(filter === null && this.filter !== null){
        filter = this.filter
      }
      let parameter = {
        condition: [{
          value: filter.value + '%',
          column: filter.column,
          clause: 'like'
        }],
        sort: sort
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('patients/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data = response.data
      })
    },
    sortTable(n) {
      var table, rows, switching, i, x, y, shouldSwitch, dir
      var switchcount = 0
      table = document.getElementById('myTable')
      switching = true
      dir = 'asc'
      while (switching) {
        switching = false
        rows = table.rows
        for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false
          x = rows[i].getElementsByTagName('TD')[n]
          y = rows[i + 1].getElementsByTagName('TD')[n]
          if (dir === 'asc') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          } else if (dir === 'desc') {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          switchcount++
        } else {
          if (switchcount === 0 && dir === 'asc') {
            dir = 'desc'
            switching = true
          }
        }
      }
    },
    sortTable2(n) {
      var table, rows, switching, i, x, y, shouldSwitch, dir
      var switchcount = 0
      table = document.getElementById('myTable2')
      switching = true
      dir = 'asc'
      while (switching) {
        switching = false
        rows = table.rows
        for (i = 0; i < (rows.length - 1); i++) {
          shouldSwitch = false
          x = rows[i].getElementsByTagName('TD')[n]
          y = rows[i + 1].getElementsByTagName('TD')[n]
          if (dir === 'asc') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          } else if (dir === 'desc') {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true
              break
            }
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          switchcount++
        } else {
          if (switchcount === 0 && dir === 'asc') {
            dir = 'desc'
            switching = true
          }
        }
      }
    }
  }
}
</script>
