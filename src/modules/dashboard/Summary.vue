<template>
  <!-- <div v-if="data !== null">
    <label class="text-danger" v-if="data.positive > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.positive}} Positive
    </label>

    <label class="text-warning" v-if="data.pum > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.pum}} Person under monitoring(PUM)
    </label>

    <label class="text-warning" v-if="data.pui > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.pui}} Person under investigation(PUI)
    </label>

    <label class="text-primary" v-if="data.recovered > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.recovered}} Recoveries
    </label>

    <label v-if="data.death > 0">
      <i class="fas fa-square" style="margin-right: 5px;"></i>
      {{data.death}} Deaths
    </label>
  </div> -->
   <div class="row">
     <div class="col-sm-12 alert alert-info">&nbsp;&nbsp;This information is not updated as some users are not registered yet</div>
      <div class="col-sm-7">
        <div class="row">
          <div class="col-sm-4 positiveSection">
            <div class="card positive">
              <div class="card-header">
                POSITIVE
              </div>
              <div class="card-body">
                {{data.positive}}
              </div>
            </div>
          </div>
          <div class="col-sm-4 pumSection">
            <div class="card pum">
              <div class="card-header">
                PUM
              </div>
              <div class="card-body">
                {{data.pum}}
              </div>
            </div>
          </div>
          <div class="col-sm-4 puiSection">
            <div class="card pui">
              <div class="card-header">
                PUI
              </div>
              <div class="card-body">
                {{data.pui}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="row">
          <div class="col-sm-6 recoveredSection">
            <div class="card recovered">
              <div class="card-header">
                RECOVERED
              </div>
              <div class="card-body">
                {{data.recovered}}
              </div>
            </div>
          </div>
          <div class="col-sm-6 deathSection">
            <div class="card death">
              <div class="card-header">
                DEATH
              </div>
              <div class="card-body">
                {{data.death}}
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.card-body{
  font-size: 18px;
  font-weight: bold;
  padding-top:2px;
  padding-bottom:2px;
}
.text-primary{
  color: $primary !important;
}

.text-danger{
  color: $danger !important;
}

.text-warning{
  color: $warning !important;
}
label{
  font-size: 16px;
  width: 100%;
  float: left;
}
.positive{
  background-color: #dc3545!important;
  color: white;
}
.positiveSection{
  padding-right:5px;
  padding-bottom:10px;
}
.pum{
  background-color: $warning !important;
  color: white;
}
.pumSection{
  padding-right:5px;
  padding-left:5px;
  padding-bottom:10px;
}
.pui{
  background-color: #005b96;
  color: white;
}
.puiSection{
  padding-right:5px;
  padding-left:5px;
  padding-bottom:10px;
}
.recovered{
  background-color: #28a745!important;
  color: white;
}
.recoveredSection{
  padding-right:5px;
  padding-left:5px;
  padding-bottom:10px;
}
.death{
  background-color: #343a40!important;
  color: white;
}
.deathSection{
  padding-left:5px;
}
@media (min-width: 576px){
  .card-header{
    font-size: 10px;
  }
  .card-body{
    font-size: 12px;
  }
}
@media (min-width: 750px){
  .card-header{
    font-size: 12px;
  }
  .card-body{
    font-size: 18px;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import QrcodeVue from 'qrcode.vue'
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
    QrcodeVue
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      this.APIRequest('patients/summary', {}).then(response => {
        this.data = response.data
      })
    }
  }
}
</script>
