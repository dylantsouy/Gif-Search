<template>
  <div class="container-top">
    <header :noback="true" />
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size:50px" spin />
      </a-spin>
    </div>
    <div class="container">
      <!-- 上方圖片 -->
      <div class="avatar" id="avatar">
        <!-- 漂浮icon -->
        <img class="img-icon" src="../assets/photo.svg" />
        <img class="search-icon" src="../assets/search.svg" />
        <!-- 主圖 -->
        <img src="https://media.giphy.com/media/J2apf28BHZS9u7nVaI/giphy.gif" />
      </div>
      <!-- 搜尋框 -->
      <a-input-search
        placeholder="Gif Search"
        enter-button
        @search="onSearch"
        :maxLength="30"
        v-model="keyword"
      >
        <a-icon slot="prefix" type="picture" />
      </a-input-search>
      <!-- 主區塊 -->
      <div class="main-area">
        <div class="area">
          <!-- 類型swiper -->
          <div class="row-title">Categories</div>
          <div class="trend-tags" id="categories">
            <div v-swiper:mySwiper4="swiperOption" class="swiper-container">
              <div class="swiper-wrapper">
                <swiper-slide
                  v-for="(item, index) in categoriesData"
                  :key="index"
                  class="tags-slide"
                >
                  <div>{{ item.name }}</div>
                  <svg @click="searchCate(item.name)">
                    <rect x="0" y="0" fill="none" width="100%" height="100%" />
                  </svg>
                </swiper-slide>
              </div>
            </div>
          </div>
          <!-- 趨勢tag swiper -->
          <div class="row-title">Trending Tags</div>
          <div class="trend-tags" id="tags">
            <div v-swiper:mySwiper3="swiperOption" class="swiper-container">
              <div class="swiper-wrapper">
                <swiper-slide
                  v-for="(item, index) in tagData"
                  :key="index"
                  class="tags-slide"
                >
                  <div>{{ item }}</div>
                  <svg @click="searchTags(item)">
                    <rect x="0" y="0" fill="none" width="100%" height="100%" />
                  </svg>
                </swiper-slide>
              </div>
            </div>
          </div>
          <!-- 趨勢gifs swiper -->
          <div class="row-title">Trending GIFs</div>
          <div class="row-trend" id="trend">
            <div v-swiper:mySwiper1="swiperOption" class="swiper-container">
              <div class="swiper-wrapper">
                <swiper-slide v-for="(item, index) in trendData" :key="index">
                  <img v-lazy="item.images.original.url" />
                  <div class="bg-text" @click="goGifDetail(item)">
                    <div class="bg-title">
                      {{ item.title }}
                    </div>
                  </div>
                </swiper-slide>
              </div>
            </div>
          </div>
          <!-- 趨勢stickers swiper -->
          <div class="row-title">Trending Stickers</div>
          <div class="row-sticker" id="sticker">
            <div
              v-swiper:mySwiper2="swiperOption"
              class="swiper-container sticker-container"
            >
              <div class="swiper-wrapper">
                <swiper-slide v-for="(item, index) in stickerData" :key="index">
                  <img v-lazy="item.images.original.url" />
                  <div class="bg-text" @click="goStickerDetail(item)">
                    <div class="bg-title">
                      {{ item.title }}
                    </div>
                  </div>
                </swiper-slide>
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
      /* 搜尋框關鍵字 */
      keyword: "",
      /* 資料存放 */
      queryData: [],
      trendData: [],
      stickerData: [],
      tagData: [],
      categoriesData: [],
      data: {},
      /* swiper 設定 */
      swiperOption: {
        grabCursor: true,
        slidesPerView: 2,
        spaceBetween: 10,
        breakpoints: {
          450: {
            slidesPerView: 2
          },
          600: {
            slidesPerView: 3
          },
          700: {
            slidesPerView: 4
          },
          800: {
            slidesPerView: 5
          },
          1380: {
            slidesPerView: 6
          },
          1600: {
            slidesPerView: 8
          }
        }
      }
    };
  },
  mounted() {
    const vm = this;
    vm.loading = true;
    window.scrollTo({
      top: 0
    });
    /* call api + 動畫 */
    vm.callApi().then(() => {
      vm.loading = false;
      document.querySelector("#avatar").classList.add("active");
      document.querySelector("#trend").classList.add("active");
      document.querySelector("#tags").classList.add("active");
      document.querySelector("#categories").classList.add("active");
      window.addEventListener("scroll", vm.scrollhandle);
    });
  },
  /* 移除scroll動畫 */
  beforeDestroy() {
    const vm = this;
    window.removeEventListener("scroll", vm.scrollhandle);
  },
  methods: {
    async callApi() {
      const vm = this;
      await vm.getTrendGif();
      await vm.getTrendSticker();
      await vm.getTags();
      await vm.getCategories();
      return new Promise(resolve => {
        resolve();
      });
    },
    /* 搜尋框輸入 */
    async onSearch() {
      const vm = this;
      vm.$router.push({ path: "search", query: { keyword: vm.keyword } });
    },
    /* 點擊Tags */
    async searchTags(item) {
      const vm = this;
      vm.$router.push({ path: "search", query: { keyword: item } });
    },
    /* 點擊分類 */
    async searchCate(item) {
      const vm = this;
      vm.$router.push({ path: "category", query: { keyword: item } });
    },
    /* 拿gif趨勢 api */
    async getTrendGif() {
      const vm = this;
      const result = await axios.get(
        `https://api.giphy.com/v1/gifs/trending?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.trendData = result.data.data;
    },
    /* 拿sticker趨勢 api */
    async getTrendSticker() {
      const vm = this;
      const result = await axios.get(
        `https://api.giphy.com/v1/stickers/trending?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.stickerData = result.data.data;
    },
    /* 拿熱門標籤 */
    async getTags() {
      const vm = this;
      const result = await axios.get(
        `https://api.giphy.com/v1/trending/searches?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.tagData = result.data.data;
    },
    /* 拿分類標籤 */
    async getCategories() {
      const vm = this;
      const result = await axios.get(
        `https://api.giphy.com/v1/gifs/categories?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.categoriesData = result.data.data;
    },
    /* 點擊圖片 type: 1 為 GIf*/
    goGifDetail(item) {
      const vm = this;
      vm.$router.push({
        path: "relate",
        query: { relateId: item.id, item: item, type: 1 }
      });
    },
    /* 點擊貼圖 type: 2 為 Sticker*/
    goStickerDetail(item) {
      const vm = this;
      vm.data = item;
      vm.$router.push({
        path: "relate",
        query: { relateId: item.id, item: item, type: 2 }
      });
    },
    /* Promise call */
    withPromise() {
      return new Promise(resolve => {
        resolve();
      });
    },
    /* eventlistiner */
    scrollhandle(event) {
      const top1 = document.documentElement.scrollTop;
      const top2 = document.querySelector("#sticker").offsetTop;
      const h = window.screen.height;
      // --- sticker是否顯示 ---
      if (top1 + h > top2) {
        setTimeout(() => {
          document.querySelector("#sticker").classList.add("active");
        }, 50);
      }
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
  background: $linear;
  padding: 9rem 0 50px;
  min-height: calc(100vh - 8rem);
  font-family: "Fredoka One", cursive;
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /deep/ .ant-input-group-wrapper {
      width: 92.5%;
      margin: 50px auto 30px;
      .ant-input-prefix {
        font-size: 30px;
        i {
          color: #aaa;
        }
      }

      .ant-input-search {
        height: 60px;

        .ant-input {
          height: 60px;
          padding-left: 50px;
        }
      }

      button {
        width: 70px;
        height: 60px;
        background: #aaa;
        border-color: #aaa;
      }
    }

    .avatar {
      width: 500px;
      height: 500px;
      box-sizing: border-box;
      border: 15px white solid;
      border-radius: 15px;
      position: relative;
      transition: opacity 2s;
      opacity: 0;
      box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);

      .img-icon {
        position: absolute;
        width: 150px;
        right: -100px;
        top: 30px;
        height: 150px;
        animation: float 6s ease-in-out infinite;
      }

      .search-icon {
        position: absolute;
        width: 150px;
        left: -100px;
        bottom: 30px;
        height: 150px;
        animation: float 6s ease-in-out infinite;
      }

      &.active {
        opacity: 1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .main-area {
      border-radius: 15px;
      padding: 20px 30px;
      width: 95%;
      overflow-x: hidden;
      .loading-pass {
        height: 800px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .trend-tags {
        display: flex;
        color: #fff;
        margin: 20px 0 50px;
        align-items: center;
        div {
          font-size: 20px;
          height: 65px;
        }
      }
      .row {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .img-area {
          flex-basis: fill;
          max-width: 30%;
          flex-grow: 1;
          height: 280px;
          margin: 8px;

          img {
            width: 100%;
            height: 100%;
          }
        }
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

.swiper-slide {
  position: relative;
  display: flex;
  justify-content: center;
  height: 280px;
  width: 100%;
  cursor: pointer;

  &.tags-slide {
    height: 130%;
    font-weight: 100;
    padding: 20px 0;
    div {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    svg {
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }

    rect {
      fill: none;
      stroke: #fff;
      stroke-width: 10;
      stroke-dasharray: 422, 0;
      transition: all 0.35s linear;
    }
    &:hover {
      font-weight: 900;
      letter-spacing: 1px;
      background: $linear rect {
        stroke-width: 5;
        stroke-dasharray: 0, 310;
        stroke-dashoffset: 48;
        transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }
  }

  &.sticker-slide {
    display: block;
    width: 100%;
    height: 280px;
    background-size: cover;
    transform-style: preserve-3d;
    transform: rotateX(70deg);
    transition: all 0.8s;
    border: 1px solid #fff;
    border-radius: 15px 15px 0 0;
    margin-bottom: 50px;

    &:hover {
      transform: rotateX(20deg);
    }
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #fff;
      transform: rotateX(90deg);
      transform-origin: bottom;
    }
  }
  .bg-text {
    display: flex;
    position: absolute;
    height: 95%;
    width: 95%;
    z-index: 21;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    color: #fff;
    font-size: 18px;
    justify-content: center;
    text-align: center;
    align-items: center;
    flex-direction: column;
    opacity: 0;
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
    &:hover {
      opacity: 1;
      &::before {
        transform: scale(1.05, 1);
      }
      &::after {
        transform: scale(1, 1.05);
      }
      .content {
        opacity: 1;
      }
    }
  }

  img {
    width: 95%;
    height: 95%;
  }
}
.row-title {
  font-weight: 600;
  font-size: 24px;
  margin: 10px 0;
  color: #fff;
}
.swiper-container {
  height: 100%;
  perspective: 1000px;
}
.trend-tags {
  opacity: 0;
  transition: all 2s;
  transform: translateX(-2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}
.row-trend {
  opacity: 0;
  transition: all 2s;
  transform: translateX(2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}
.row-sticker {
  opacity: 0;
  transition: all 2s;
  transform: translateX(-2500px);

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes float {
  0% {
    transform: translatey(10px);
  }
  50% {
    transform: translatey(-30px);
  }
  100% {
    transform: translatey(10px);
  }
}

@media screen and (max-width: 750px) {
  .container-top {
    .container {
      .avatar {
        width: 300px;
        height: 300px;
        .search-icon {
          width: 90px;
          height: 90px;
          left: -40px;
          bottom: 0px;
        }
        .img-icon {
          width: 90px;
          height: 90px;
          right: -40px;
          top: 15px;
        }
      }
    }
  }
  .swiper-slide {
    height: 180px;
  }

  .main-area {
    .row {
      .img-area {
        max-width: 100%;
        flex-basis: 40%;
        height: 180px;
      }
    }
  }
}
</style>
