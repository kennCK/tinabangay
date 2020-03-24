<template>
  <div>
    <div class="row">
      <div class="col-lg-6">
        <trend></trend>
      </div>
    </div>
  </div>
</template>
<style scoped>
.half-rule {
  margin-left: 0;
  text-align: left;
  width: 50%;
}
</style>
<script>
  import Vue from 'vue'
  export default{
    name: '',
    create(){

    },
    mounted(){
    },
    data(){
      return {

      }
    },
    props: {
    },
    components: {
      'trend': require('modules/places/Trend.vue')
    },
    methods: {
    }
  }
</script>
