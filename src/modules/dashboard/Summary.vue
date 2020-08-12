<template>
   <div class="row">
     <div class="col-sm-12 alert alert-info">&nbsp;&nbsp;This information is not updated as some users are not registered yet</div>
      <div class="col-sm-7">
        <div class="row">
          <div class="col-sm-4 positiveSection">
            <div class="card positive">
              <div class="card-header positive-header">
                <i class="fas fa-user-injured sumIcon"></i> POSITIVE
              </div>
              <div class="card-body positive-body d-flex align-items-center">
                {{data.positive}}
              </div>
            </div>
          </div>
          <div class="col-sm-4 pumSection">
            <div class="card pum">
              <div class="card-header pum-header">
                <i class="fas fa-address-book sumIcon"></i> PUM
              </div>
              <div class="card-body pum-body d-flex align-items-center">
                {{data.pum}}
              </div>
            </div>
          </div>
          <div class="col-sm-4 puiSection">
            <div class="card pui">
              <div class="card-header pui-header">
                <i class="fas fa-id-card-alt sumIcon"></i> PUI
              </div>
              <div class="card-body pui-body d-flex align-items-center">
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
              <div class="card-header recovered-header">
                <i class="fas fa-hand-holding-medical sumIcon"></i> RECOVERED
              </div>
              <div class="card-body recovered-body d-flex align-items-center">
                {{data.recovered}}
              </div>
            </div>
          </div>
          <div class="col-sm-6 deathSection">
            <div class="card death">
              <div class="card-header death-header">
                <i class="fas fa-book-dead sumIcon"></i> DEATH
              </div>
              <div class="card-body death-body d-flex align-items-center">
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
  // background-color: #dc3545!important;
  // color: white;
  color: #dc3545!important;
  border: 2px solid #dc3545!important;
}
.positiveSection{
  padding-right:5px;
  padding-bottom:10px;
}
.positive-header{
  border-bottom: 1px solid #dc3545!important;
  background-color: white;
  padding-top: 5px;
  padding-bottom: 5px;
}
.positive-body{
  height: 45px;
}
.pum{
  // background-color: $warning !important;
  // color: white;
  color: #e09304 !important;
  border: 2px solid #e09304 !important;
}
.pumSection{
  padding-right:5px;
  padding-left:5px;
  padding-bottom:10px;
}
.pum-header{
  border-bottom: 1px solid #e09304 !important;
  background-color: white;
  padding-top: 5px;
  padding-bottom: 5px;
}
.pum-body{
  height: 45px;
}
.pui{
  // background-color: #005b96;
  // color: white;
  color: #005b96;
  border: 2px solid #005b96;
}
.puiSection{
  padding-right:5px;
  padding-left:5px;
  padding-bottom:10px;
}
.pui-header{
  background-color: white;
  border-bottom: 1px solid #005b96;
  padding-top: 5px;
  padding-bottom: 5px;
}
.pui-body{
  height: 45px;
}
.recovered{
  // background-color: #28a745!important;
  // color: white;
  color: #28a745!important;
  border: 2px solid #28a745!important;
}
.recovered-header{
  background-color: white;
  border-bottom: 1px solid #28a745!important;
  padding-top: 5px;
  padding-bottom: 5px;
}
.recovered-body{
  height: 45px;
}
.recoveredSection{
  padding-right:5px;
  padding-left:5px;
  padding-bottom:10px;
}
.sumIcon{
  font-size: 20px;
  margin-right: 10px;
}
.death{
  // background-color: #343a40!important;
  // color: white;
  color: #343a40!important;
  border: 2px solid #343a40!important;
}
.death-header{
  background-color: white;
  border-bottom: 1px solid #343a40!important;
  padding-top: 5px;
  padding-bottom: 5px;
}
.death-body{
  height: 45px;
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
