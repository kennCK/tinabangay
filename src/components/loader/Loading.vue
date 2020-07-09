<template>
  <div>
    <div class="customModal" id="loading">
      <!-- <span class="loading">
        <i class="fas fa-circle-o-notch fa-spin"></i>
      </span> -->
      <div class="loadingV2"><div></div><div></div><div></div></div>
    </div>
  </div>
</template>
<script>
</script>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.customModal{
  backdrop-filter: blur(1px);
  position: fixed;
  background: rgba(254, 254, 254, 0);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100000 !important;
  -webkit-transition: all 0.1s;
  -moz-transition: all 0.1s;
  transition: all 0.1s;
  text-align: center;
  display: none;
}
.customModal .loading{
  font-size: 75px;
  margin-top: 20vh;
  height: 35vh;
  float: left;
  width: 20%;
  margin-left: 40%;
  margin-right: 40%;
  text-align: center;
  color: $primary;
  line-height: 30vh;
  border-radius: 5px;
}
.fa-spin{
  animation-duration: 0.70s;
}

// lds-fb
.loadingV2 {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: calc(50vh - 80px) auto 0 auto;
}
.loadingV2 div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: $primary;
  animation: loadingV2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.loadingV2 div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.loadingV2 div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.loadingV2 div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes loadingV2 {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}

</style>
