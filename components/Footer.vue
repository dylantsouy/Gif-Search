<template>
  <div id="footer" class="footer">
    <nuxt-link class="main" to="/">
      <div class="title">
        <div>GIF</div>
        <div class="bottom">SEARCH</div>
      </div>
    </nuxt-link>

    <div class="label">
      <div class="icon">
        <a
          href="https://github.com/dylantsouy?tab=repositories"
          target="_blank"
        >
          <a-icon type="github" />
        </a>
        <a href="https://www.facebook.com/fu.y.zou" target="_blank">
          <a-icon type="facebook" />
        </a>
        <a href="https://developers.giphy.com/branch/master/docs/sdk/" target="_blank">
          <a-icon type="api" />
        </a>
      </div>

      <div>Copyright© 2020 Code by Dylan</div>
    </div>
  </div>
</template>

<script>
export default {
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
.footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  background: #000;
  font-size: 1rem;
  position: relative;
  height: 150px;
  width: 100%;
  z-index: 105;
  bottom: 0;
  .title {
    font-size: 30px;
    .bottom {
      font-weight: 600;
    }
  }

  .label {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    color: #aaa;
    margin-left: 50px;
    margin-top: 60px;
    .icon {
      display: flex;
      top: -35px;
      right: 0px;
      position: absolute;
      .logo-area {
        width: 100px;
        height: 50px;
        margin-right: 5px;
        transform: translateY(-12px);
      }
      i {
        cursor: pointer;
        margin-left: 15px;
        background: #b0b0b0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        color: #333;
        transition: all 0.3s;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .main {
    display: flex;
    color: #aaa;
  }
}
@media screen and (max-width: 490px) {
  .footer {
    padding: 0 30px;
    .title {
      font-size: 20px;
    }

    .label {
      font-size: 12px;
      margin-bottom: 15px;
      .icon {
        top: -25px;
        i {
          width: 20px;
          height: 20px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
