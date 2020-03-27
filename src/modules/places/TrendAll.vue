<template>
  <div v-if="data !== null" class="holder">
    <input type="text" class="form-control" v-model="searchValue" placeholder="Search location" @keyup="filterLocation()">
      <Pager
        :pages="numPages"
        :active="activePage"
        :limit="perPage"/>
      <p>Current Page: {{ activePage }}</p>
    <div class="card" v-for="(item, index) in lists" :key="index" style="margin-bottom: 10px;" >
      <div>
        <div class="card-block px-3">
          <h6 class="card-title" style="margin-top:15px">
            {{item.route}} , {{item.locality === 'testin' ? 'true' : item.locality}}
          </h6>
          <h6 class="card-title " style="font-size: 15px; margin-top:15px; ">{{item.country}}</h6>                            
          <span class="card-title">
            <b-button variant="danger" style="margin-bottom: 25px; margin-bottom: 5px; ">
              POSITIVE<b-badge class="badge" variant="light">{{item.positive_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
            <b-button variant="warning" style="margin-bottom: 25px; margin-bottom: 5px;">
              PUI<b-badge class="badge" variant="light">{{item.pui_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
            <b-button variant="primary" style="margin-bottom: 25px; margin-bottom: 5px;"> 
              PUM<b-badge class="badge" variant="light">{{item.pum_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
            <b-button variant="info" style="margin-bottom: 25px; margin-bottom: 5px;">
             NEGATIVE<b-badge class="badge" variant="light">{{item.negative_size}} <span class="sr-only">unread messages</span></b-badge>
            </b-button>
          </span>
        </div> 
      </div>
        </div>
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
  width: 60%;
  float: left;
  margin-top: 25px;
}

.form-control{
  height: 45px !important;
  margin-bottom: 25px;
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
export default {
  mounted(){
    this.retrieve()
    // this.rows()
  },
  data(){
    return {
      common: COMMON,
      user: AUTH.user,
      data: null,
      searchValue: null,
      result: null,
      perPage: 5,
      rows: null,
      activePage: 1
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        status: 'positive'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tracing_places/places', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          console.log('Performing API request: ')
          console.log(this.data)
        }else{
          this.data = null
        }
        this.result = this.data
      })
    },
    filterLocation(){
      this.result = this.data.filter(item => {
        return item.route.toLowerCase().indexOf(this.searchValue) > -1
      })
    },
    linkGen (pageNum){
      return '#page=' + pageNum
    }
  },
  computed: {
    rows(){
      return this.data.length
    },
    lists(){
      let item = this.data
      return item.slice(
        (this.activePage - 1) * this.perPage,
        this.activePage * this.perPage)
    },
    numPages(){
      let item = this.data
      let pages = this.data.length / this.perPage
      let remaining = this.data.length - (this.perPage * pages)
      if(remaining > 0){
        pages++
      }
      return pages
    }
  },
  components: {
    Pager
  }
}
</script>
