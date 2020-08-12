<template>
  <div id="header" class="header">
    <div v-if="!noback" class="go-back" @click="goPrevPage()">
      <i class="iconfont icon-arrow_left" />
      <span>返回</span>
    </div>
    <nuxt-link class="main" to="/">
      <div class="title">
        <div class="top-title">GIF</div>
        <div class="bottom-title">SEARCH</div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    noback: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    goPrevPage() {
      const vm = this;
      vm.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  padding-top: 10px;
  width: 100%;
  height: 7rem;
  mask: linear-gradient(black 7rem, transparent);
  backdrop-filter: blur(8px);
  font-size: 1rem;
  position: fixed;
  width: 100%;
  z-index: 105;
  top: 0;
  font-weight: 400;

  .go-back {
    position: absolute;
    top: 50%;
    left: 2rem;
    transform: translateY(-50%);
    color: #fff;

    > i {
      font-size: 1.2rem;
      vertical-align: middle;
    }

    > span {
      font-size: 12px;
      font-weight: 400;
      vertical-align: middle;
      margin-left: -6px;
    }
  }
  .main {
    display: flex;
    color: #fff;
    margin-left: 120px;
    .title {
      margin-left: 30px;
      .top-title {
        font-size: 30px;
      }
      .bottom-title {
        font-size: 34px;
        font-weight: 600;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .header {
    .main {
      margin-left: 0;
      .title {
        .top-title {
          font-size: 20px;
        }
        .bottom-title {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
