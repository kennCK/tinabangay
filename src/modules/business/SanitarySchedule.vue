<template>
    <div class="container">
      <button class="roundedBtn float-botton-right"  @click="showModal()"><i class="addIcon fa fa-plus"></i></button>
         <div class="modal fade right" id="add_schedule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-side modal-notify modal-primary modal-md" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Schedule</h5>
                    <button type="button" class="close" aria-label="Close" @click="hideModal()">
                    <span aria-hidden="true" class="white-text">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-4">
                    <div class="form-group mb-5">
                        <label for="code">Dates</label>
                        <input type="text" name="code" id="code" class="form-control" placeholder="Enter ">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" @click="hideModal()">Cancel</button>
                    <button class="btn btn-primary" @click="addNew()">Submit</button>
                </div>
                </div>
            </div>
    </div>
       <empty v-if="data.length <= 0" :title="'No post available.'" :action="'Please be back soon!'" :icon="'far fa-smile'" :iconColor="'text-danger'"></empty>
    </div>
</template>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
.roundedBtn{
    height:70px;
    width:70px;
    border-radius:50px;
    position: fixed;
    bottom:40px;
    left:90%;
    border: 3px solid $primary;
    background-color:$primary;
}
.addIcon{
    font-size:40px;
    color:white
}

.roundedBtn:hover{
     box-shadow: 2px 2px 3px #888888;
}

.roundedBtn:focus{
     outline:0 !important;
}
</style>
<script>
export default{
  data(){
    return{
      data: []
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'google-map-modal': require('components/increment/generic/map/ModalGeneric.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue')
  },
  methods: {
    showModal(){
      $('#add_schedule').modal('show')
    },
    hideModal(){
      $('#add_schedule').modal('hide')
    }
  }
}
</script>

