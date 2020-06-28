<template>
  <div class="modal fade" id="qr-code-viewer" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">QR Code</h5>
          <button type="button" class="close" @click="close()" aria-label="Close">
            <span aria-hidden="true" class="text-primary">&times;</span>
          </button>
        </div>
        <div class="modal-body text-center">
          <QrcodeVue :value="code" :size="getHeightOnly()"></QrcodeVue>
        </div>
      </div>
    </div>
  </div>

</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.img-modal{
  display: none;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 100000;
  top: 0px;
  background: rgba(0, 0, 0, 0.7);
}

.img-holder{
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  position: absolute;
}

.gallery-image-viewer{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.close-icon{
  font-size: 42px;
  color: white;
  top: -15px;
  position: absolute;
  right: -21px;
  float: right;
  z-index: 100001;
}

.icon-prev, .icon-next{
  font-size: 42px;
  color: white;
  top: 45vh;
  position: absolute;
  z-index: 100001;
}

.icon-prev{
  left: -25px;
}

.icon-next{
  right: -25px;
}

.icon:hover{
  cursor: pointer;
  color: $warning;
}

.actions{
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .5);
  width: 100%;
  text-align: left;
}

.actions .text{
  color: white;
  display: table;
  width: 70%;
  float: left;
  min-height: 50px;
  height: 8vh;
}

.actions label{
  display: table-cell;
  vertical-align: middle;
  padding-left: 10px;
  margin: 0px;
}

.btn{
  width: 30% !important;
  float: left;
}

.loading{
  font-size: 75px;
  width: 100%;
  color: $warning;
  position: relative;
  text-align: 'center';
  top: 40vh;
  display: block;
}

.fa-spin{
  animation-duration: 0.50s;
}

@media (max-width: 992px) {
  .icon-prev, .icon-next{
    top: 50%;
  }

  .actions .text{
    width: 100%;
    text-align: center;
  }

  .actions label{
    padding-left: 0px;
  }

  .btn{
    width: 100% !important;
  }

  .loading{
    top: 25vh;
  }
}
</style>
<script>
import jquery from 'jquery'
import QrcodeVue from 'qrcode.vue'
export default {
  mounted(){
  },
  data(){
    return {
      code: ''
    }
  },
  components: {
    QrcodeVue
  },
  methods: {
    close(){
      jquery('#qr-code-viewer').modal('hide')
    },
    setCode(code){
      this.code = code
      setTimeout(() => {
        jquery('#qr-code-viewer').modal('show')
      }, 1000)
    },
    getHeightOnly(){
      let height = jquery(window).height()
      return parseInt(height - (height * 0.05))
    },
    getHeight(){
      let height = jquery(window).height()
      let width = jquery(window).width()
      if(width > height){
        let iHeight = parseInt(height - (height * 0.1))
        return {
          height: iHeight + 'px !important',
          width: iHeight + 'px !important',
          top: parseInt(height - (height * 0.975)) + 'px !important',
          left: parseInt((width - iHeight) / 2) + 'px'
        }
      }else{
        let iWidth = parseInt(width - (width * 0.1))
        return {
          height: iWidth + 'px !important',
          width: iWidth + 'px !important',
          left: parseInt(width * 0.05) + 'px !important',
          top: parseInt((height - iWidth) / 2) + 'px'
        }
      }
    }
  }
}
</script>
