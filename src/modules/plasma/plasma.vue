<template>
    <div>
    <div class="container" v-if="data.length > 0">
        <h1>Hello World</h1>
        <button class="btn btn-primary">Add Post</button>
    </div>
    <empty v-if="data.length <= 0" :title="'No Plasma Post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    <google-map-modal ref="mapModal"  v-if="data.length > 0"></google-map-modal>
    </div>
</template>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
.container{
  margin-top:20px;
}
</style>

<script>
export default {
  data() {
    return {
      data: [
        {
          name: 'Anonymous',
          message: 'fsdafrewrtrtr'
        }
      ]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue')
  }
}
</script>
