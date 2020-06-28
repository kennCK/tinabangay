<template>
  <div v-if="data !== null" class="holder w-100">
    <div class="form-group">
      <button class="btn btn-primary pull-right" @click="retrieve()" style="height: 45px !important;">Add</button>
    </div>
    <div class="row w-100 m-0">
      <div class="card card-half" v-for="(item, index) in data" :key="index" style="margin-bottom: 10px;" >
        <div>
          <div class="qr-code" @click="setCode('location/' + item.code)">
            <QrcodeVue :value="'location/' + item.code" :size="100"></QrcodeVue>
          </div>
          <div class="details">
            <label class="card-title" style="margin-top:15px">
              {{item.route}}
            </label>
            <label class="card-title">
              {{item.locality + ', ' + item.country}}
            </label>
          </div> 
        </div>
      </div>
    </div>

    <showQrCode ref="imageView"></showQrCode>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.custom-header-color{
  color: $primary;
}
.badge{
  margin-left: 5px;
}
.card-title{
  width: 100%;
  float: left;
}

.holder{
  float: left;
  margin-top: 25px;
}

.qr-code, .details{
  float: left;
  padding: 5px;
}

.qr-code{
  width: 25%;
  text-align: center;
}

.qr-code:hover{
  cursor: pointer;
  background: $primary;
}

.details{
  width: 75%;
}

.form-control{
  height: 45px !important;
  margin-bottom: 25px;
}

.bg-black{
  background: #000000 !important;
  color: #ffffff !important;
  border: 0px;
}
input[type="number"] {
  -webkit-appearance: textfield;
    -moz-appearance: textfield;
          appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
}
.number-input {
    margin-bottom: 1rem;
    margin-left: 50rem;
    margin-right: 4rem;
    float: right;
}
.number-input button {
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0;
  position: relative;
}
.number-input button:before,
.number-input button:after {
  display: inline-block;
  position: absolute;
  content: '';
  height: 2px;
  transform: translate(-50%, -50%);
}
.number-input button.plus:after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.number-input input[type=number] {
  text-align: center;
}


.md-number-input.number-input {
  width: 11.8rem;
}
.md-number-input.number-input button {
  outline: none;
  width: 3rem;
  height: 2rem;
  padding-top: .8rem;
}
.md-number-input.number-input button.minus {
  padding-left: 8px;
}
.md-number-input.number-input button.plus {
  padding-left: 2px;
}
.md-number-input.number-input button:before,
.md-number-input.number-input button:after {
  width: 1rem;
  background-color: #212121;
}
.md-number-input.number-input input[type=number] {
  max-width: 5rem;
  padding: .5rem;
  border: solid #ddd;
  border-width: 0 2px;
  font-size: 2rem;
  height: 3rem;
  font-weight: bold;
  outline: none;
}

.card.card-half {
  width: 49%;
  margin: .5%;
}

@media (max-width: 767px) {
  .card.card-half {
    width: 100%;
    margin: 0;
  }
}

@media not all and (min-resolution:.001dpcm)
{ @supports (-webkit-appearance:none) and (stroke-color:transparent) {
  .number-input.md-number-input.safari_only button:before, 
  .number-input.md-number-input.safari_only button:after {
    margin-top: -.6rem;
  }
}}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import QrcodeVue from 'qrcode.vue'
import showQrCode from './ShowMore.vue'
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
    Pager,
    QrcodeVue,
    showQrCode
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    setCode(code){
      this.$refs.imageView.setCode(code)
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          clause: '=',
          column: 'account_id'
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('locations/retrieve', parameter).then(response => {
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
