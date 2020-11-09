<template>
  <div class="container-top">
    <header :noback="true" />
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size:50px" spin />
      </a-spin>
    </div>
    <div v-show="!loading" class="container">
      <!-- 搜尋框 -->
      <a-input-search
        id="input"
        placeholder="Search"
        enter-button
        @search="onSearch"
        :maxLength="30"
        v-model="keyword"
      >
        <a-icon slot="prefix" type="picture" />
      </a-input-search>
      <div class="outer">
        <!-- 左方類型 -->
        <div class="left-area">
          <div class="title">Category</div>
          <div
            class="value"
            v-for="(item, index) in categoriesData"
            :key="index"
            @click="clickCate(item.name)"
          >
            {{ item.name }}
          </div>
        </div>
        <!-- 右方圖片牆 -->
        <div class="main-area" id="main-area">
          <div class="title">
            {{ name }}
          </div>
          <div class="row">
            <div
              class="gif-area"
              v-for="(item, index) in queryData"
              :key="index"
              @click="clickImg(item)"
            >
              <img v-lazy="item.gif.images.downsized_medium.url" />
              <div class="bg-text" @click="clickImg(item)">
                <div class="bg-title">
                  {{ item.name ? item.name : "No Title" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";

export default {
  components: {
    Header,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      loading: true,
      /* router 的關鍵字 */
      name: "",
      /* 輸入框關鍵字 */
      keyword: "",
      /* api data */
      queryData: [],
      categoriesData: []
    };
  },
  mounted() {
    const vm = this;
    /* 拿router 分類 */
    vm.loading = true;
    if (vm.$route.query.keyword) {
      vm.name = vm.$route.query.keyword;
    }
    window.scrollTo({
      top: 0
    });
    /* call api */
    vm.callApi().then(() => {
      vm.loading = false;
      document.querySelector("#main-area").classList.add("active");
    });
  },
  methods: {
    async callApi() {
      const vm = this;
      await vm.getData();
      await vm.getCategories();
      return new Promise(resolve => {
        resolve();
      });
    },
    /* 拿分類資料api */
    async getData() {
      const vm = this;
      vm.loading = true;
      const result = await axios.get(
        `https://api.giphy.com/v1/gifs/categories/${vm.name}?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.queryData = result.data.data;
      vm.loading = false;
    },
    /* 點圖片搜尋 */
    clickImg(item) {
      const vm = this;
      vm.$router.push({ path: "search", query: { keyword: item.name } });
    },
    /* 點分類 */
    async clickCate(name) {
      const vm = this;
      vm.queryData = [];
      vm.name = name;
      vm.$router.replace({ query: { keyword: name } });
      vm.getData();
    },
    /* 拿全部分類api */
    async getCategories() {
      const vm = this;
      const result = await axios.get(
        `https://api.giphy.com/v1/gifs/categories?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.categoriesData = result.data.data;
    },
    /* 輸入框搜尋 */
    async onSearch() {
      const vm = this;
      vm.$router.push({
        path: "search",
        query: { keyword: vm.keyword, type: 1 }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$linear: linear-gradient(
  135deg,
  rgba(26, 188, 156, 1) 0%,
  rgba(142, 68, 173, 1) 100%
);
.container-top {
  margin: 0 auto;
  height: 100%;
  width: 100%;
  background: #000;
  padding: 9rem 0 50px;
  min-height: calc(100vh - 8rem);
  font-family: "Luckiest Guy", cursive;
  font-family: "Rubik Mono One", sans-serif;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .outer {
      width: 95%;
      display: flex;
      .left-area {
        padding: 20px 30px;
        color: #fff;
        display: flex;
        flex-direction: column;
        width: 15%;
        .title {
          font-size: 30px;
          margin: 18px 0 50px;
        }
        .value {
          cursor: pointer;
          transition: 0.3s all;
          margin: 2.5px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 90%;
          &:hover {
            color: rgba(142, 68, 173, 1);
          }
        }
      }
      .main-area {
        border-radius: 15px;
        background: #000;
        box-shadow: 0 0 5px #333;
        padding: 20px 30px;
        width: 85%;
        .title {
          color: #fff;
          font-size: 50px;
          margin: 10px 0 20px;
        }
        .loading-pass {
          height: 800px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          .gif-area {
            position: relative;
            cursor: pointer;
            flex-grow: 1;
            flex-basis: 15%;
            max-width: 40%;
            margin: 8px;
            height: 350px;
            .bg-text {
              display: flex;
              position: absolute;
              height: 100%;
              width: 100%;
              z-index: 21;
              background: rgba(0, 0, 0, 0.2);
              top: 0;
              color: #fff;
              font-size: 24px;
              justify-content: center;
              text-align: center;
              align-items: center;
              flex-direction: column;
              transition: all 0.3s;

              .bg-title {
                white-space: nowrap;
                overflow: hidden;
                font-weight: 600;
                text-overflow: ellipsis;
                width: 80%;
                margin: 0 auto;
              }

              .type {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 10px;
                width: 80%;
                margin: 0 auto;
              }
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    /deep/ .ant-input-group-wrapper {
      width: 95%;
      margin: 30px auto 0;

      .ant-input-search {
        height: 60px;

        .ant-input {
          height: 60px;
        }
      }

      button {
        width: 70px;
        height: 60px;
        background: #aaa;
        border-color: #aaa;
      }
    }
  }
}
.loading {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  justify-content: center;
  z-index: 2000;
  align-items: center;
  width: 100%;
  background: #000;
  height: 100vh;
  color: #fff;
}
@media screen and (max-width: 1500px) {
  .container-top {
    .container {
      .outer {
        .left-area {
          width: 25%;
          .title {
            font-size: 26px;
          }
          .value {
            font-size: 16px;
          }
        }
        .main-area {
          width: 75%;
          .row {
            .gif-area {
              max-width: 35%;
              flex-basis: 30%;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 800px) {
  .container-top {
    .container {
      .outer {
        .left-area {
          width: 35%;
          padding: 0;
          .title {
            font-size: 14px;
            margin: 40px 0 10px;
          }
          .value {
            font-size: 12px;
          }
        }
        .main-area {
          width: 65%;
          padding: 2px;
          .title {
            font-size: 28px;
            margin-top: 30px;
          }
          .row {
            display: flex;
            flex-wrap: wrap;
            .gif-area {
              flex-grow: 1;
              max-width: 45%;
              flex-basis: 45%;
              margin: 5px;
              height: 150px;
              .bg-text {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
