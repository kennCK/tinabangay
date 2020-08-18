<template>
    <div class="container-fluid">
        <div class="col-sm-12 alert alert-info">&nbsp;&nbsp;<h3>PAGE UNDER CONSTRUCTION</h3></div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="col-sm-12">
                            User
                        </div>
                        <div class="col-sm-12">
                            <i class="fas fa-users"></i> 3287498
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="col-sm-12">
                            Business
                        </div>
                        <div class="col-sm-12">
                            <i class="fas fa-fax"></i> 989283791
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="col-sm-12">
                            Barangay
                        </div>
                        <div class="col-sm-12">
                            <i class="fas fa-users"></i> 3287498
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <div class="col-sm-12">
                            LGU
                        </div>
                        <div class="col-sm-12">
                            <i class="fas fa-building"></i> 934890
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="col-sm-12">
                            GOV
                        </div>
                        <div class="col-sm-12">
                            <i class="fas fa-building"></i> 23999
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="col-sm-12">
                            Total
                        </div>
                        <div class="col-sm-12">
                            <i class="fas fa-chart-pie"></i> 12123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
import QrcodeVue from 'qrcode.vue'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import CONFIG from 'src/config.js'
import ComplaintProperty from './Complaint.js'
import ROUTER from 'src/router'
export default {
  data(){
    return{
      user: AUTH.user,
      dashType: AUTH.user.type,
      backend: CONFIG.BACKEND_URL
    }
  }
}
</script>
