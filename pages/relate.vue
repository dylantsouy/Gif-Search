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
      <div class="top-area">
        <!-- 圖片 -->
        <div class="avatar" id="avatar">
          <div class="img-area" :class="{ active: showLink }">
            <img
              v-lazy="
                first && first.images && first.images.downsized_medium.url
              "
            />
            <!-- 翻轉內容 -->
            <div class="bg-text" :class="{ active: showLink }">
              <div class="cancel" v-if="showLink" @click="showLink = false">
                <a-icon type="close" />
              </div>
              <div class="title">Links</div>
              <div class="label">Short Link</div>
              <div
                class="value"
                @click.prevent="copyByText(first && first.bitly_url)"
              >
                {{ first && first.bitly_url }}
              </div>
              <div class="text">A url with a minimal number of characters</div>
              <div class="label">GIF Link</div>
              <div
                class="value"
                @click.prevent="
                  copyByText(first && first.images && first.images.original.url)
                "
              >
                {{ first && first.images && first.images.original.url }}
              </div>
              <div class="text">A link to the GIF image itself HTML5 Video</div>
              <div class="label">MP4 Link</div>
              <div
                class="value"
                @click.prevent="
                  copyByText(first && first.images && first.images.original.url)
                "
              >
                {{ first && first.images && first.images.original.mp4 }}
              </div>
              <div class="text">
                Video file
              </div>
            </div>
          </div>
          <!-- 下方連結 -->
          <div class="detail" id="detail">
            <div class="title">
              {{ first && first.title ? first.title : "No Title" }}
            </div>
            <div class="link" v-if="!showLink" @click="openLink()">
              <a-icon type="link" /> Link
            </div>
            <div
              class="link"
              @click="
                copyByText(first && first.images && first.images.original.url)
              "
            >
              <a-icon type="picture" /> Copy Link
            </div>
          </div>
        </div>
      </div>
      <!-- 輸入框 -->
      <a-input-search
        v-show="!pass"
        id="input"
        placeholder="Search"
        enter-button
        @search="onSearch"
        :maxLength="30"
        v-model="keyword"
      >
        <a-icon slot="prefix" type="picture" />
      </a-input-search>
      <!-- 圖片牆 -->
      <div class="main-area" id="main-area">
        <div v-show="pass" class="loading-pass">
          <a-spin>
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size:50px"
              spin
            />
          </a-spin>
        </div>
        <!-- 熱門標籤 -->
        <div class="tags">
          <div v-swiper:mySwiper="swiperOption" class="swiper-container">
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
        <div v-show="!pass" class="title">
          {{ type === 1 ? "Related GIFs" : "Related Stickers" }}
        </div>
        <!-- 圖片區 -->
        <div v-show="!pass" class="row">
          <div
            class="gif-area"
            v-for="(item, index) in queryData"
            :key="index"
            @click.prevent="clickImg(item)"
          >
            <img v-lazy="item.images.downsized_medium.url" />
          </div>
        </div>
        <!-- 頁尾 pagination -->
        <div v-if="pagination && pagination.count">
          <a-pagination
            @change="clickPagination"
            v-model="current"
            :total="pagination.count"
            v-show="!pass"
            :defaultPageSize="25"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import 'swiper/css/swiper.css'

export default {
  components: {
    Header,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      /* loading */
      pass: false,
      loading: true,
      /* 頁尾頁碼 */
      current: 1,
      /* 翻轉圖片 */
      showLink: false,
      /* 1:gif 2:sticker */
      type: 1,
      /* 關鍵字 */
      keyword: "",
      /* api data */
      tagData: [],
      first: {},
      queryData: [],
      pagination: {},
      /* swiper 設定 */
      swiperOption: {
        grabCursor: true,
        slidesPerView: 2,
        spaceBetween: 30,
        breakpoints: {
          450: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          700: {
            slidesPerView: 4,
            spaceBetween: 20
          },
          800: {
            slidesPerView: 6,
            spaceBetween: 20
          },
          1380: {
            slidesPerView: 8,
            spaceBetween: 30
          },
          1600: {
            slidesPerView: 10,
            spaceBetween: 30
          }
        }
      }
    };
  },
  mounted() {
    const vm = this;
    /* 拿router資料 */
    if (vm.$route.query.type) {
      vm.type = vm.$route.query.type;
    }
    window.scrollTo({
      top: 0
    });
    /* call api */
    if (vm.$route.query.type === 2) {
      vm.getStickerData();
    } else {
      vm.getGifData();
    }
    if (vm.$route.query.item[0] !== "[") {
      vm.first = vm.$route.query.item;
    } else {
      vm.first = vm.queryData[0];
    }
    /* call api + 動畫 */
    vm.getTags();
  },
  methods: {
    /* 拿 gif api */
    async getGifData() {
      const vm = this;
      vm.loading = true;
      const result = await axios.get(
        `https://api.giphy.com/v1/gifs/related?gif_id=${vm.$route.query.relateId}&api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.queryData = result.data.data;
      vm.pagination = result.data.pagination;
      if (vm.pagination.count && vm.pagination.count > 500) {
        vm.pagination.count = 500;
      }
      vm.loading = false;
      document.querySelector("#avatar").classList.add("active");
      document.querySelector("#main-area").classList.add("active");
    },
    /* 拿 sticker api */
    async getStickerData() {
      const vm = this;
      vm.loading = true;
      const result = await axios.get(
        `https://api.giphy.com/v1/stickers/related?gif_id=${vm.$route.query.relateId}&offset=0&api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.queryData = result.data.data;
      vm.pagination = result.data.pagination;
      if (vm.pagination.count && vm.pagination.count > 500) {
        vm.pagination.count = 500;
      }
      vm.loading = false;
      document.querySelector("#avatar").classList.add("active");
      document.querySelector("#main-area").classList.add("active");
    },
    /* 點圖片 */
    clickImg(item) {
      const vm = this;
      vm.loading = true;
      window.scrollTo({
        top: 0
      });
      vm.first = item;
      setTimeout(() => {
        vm.loading = false;
      }, 500);
    },
    /* 點熱門Tag */
    searchTags(item) {
      const vm = this;
      vm.$router.push({ path: "search", query: { keyword: item } });
    },
    /* 點頁尾換頁 */
    async clickPagination() {
      const vm = this;
      const top = document.querySelector("#input").offsetTop;
      vm.pass = true;
      const result = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN&q=${
          vm.$route.query.keyword
        }&offset=${(vm.current - 1) * 25}`
      );
      window.scrollTo({
        top: top
      });
      vm.queryData = result.data.data;
      vm.pass = false;
    },
    /* 翻轉圖片 */
    openLink() {
      const vm = this;
      vm.showLink = true;
    },
    /* 複製內容 */
    copyByText(text) {
      const oInput = document.createElement("input");
      oInput.value = text;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.className = "oInput";
      oInput.parentNode.removeChild(oInput);
      this.$message.info("Successed Copy");
    },
    /* 拿熱門標籤 api */
    async getTags() {
      const vm = this;
      const result = await axios.get(
        `https://api.giphy.com/v1/trending/searches?api_key=Mrjdc0YDiu0GDGzkciE04Av5N2SJ1zSN`
      );
      vm.tagData = result.data.data;
    },
    /* 關鍵字搜尋 */
    onSearch() {
      const vm = this;
      vm.$router.push({
        path: "search",
        query: { keyword: vm.keyword, type: vm.type }
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
    .top-area {
      .avatar {
        border: 15px white solid;
        border-radius: 15px;
        transition: opacity 2s;
        opacity: 0;
        box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
        width: 730px;
        .img-area {
          width: 700px;
          height: 700px;
          position: relative;
          transition: 0.6s all;
          &.active {
            transform: rotateY(-180deg);
          }
          .bg-text {
            width: 100%;
            height: 100%;
            padding: 15px;
            position: absolute;
            background: #333;
            color: #fff;
            top: 0;
            transform: rotateY(0deg);
            transition: 0.6s transform;
            opacity: 0;
            &.active {
              opacity: 1;
              transform: rotateY(180deg);
            }
            .cancel {
              position: absolute;
              right: 10px;
              top: 10px;
              font-size: 26px;
              cursor: pointer;
            }
            .title {
              font-size: 30px;
              font-weight: 600;
            }
            .label {
              margin: 15px 0;
            }
            .value {
              background: #fff;
              padding: 0 10px;
              width: 95%;
              overflow-x: hidden;
              text-overflow: ellipsis;
              color: #333;
              cursor: pointer;
            }
            .text {
              color: #999;
              margin-top: 3px;
            }
          }
          img {
            width: 100%;
            height: 100%;
          }
        }

        .detail {
          width: 100%;
          padding-top: 20px;
          height: 125px;
          background: #fff;
          .title {
            font-weight: 600;
            font-size: 16px;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 90%;
            white-space: nowrap;
          }
          .link {
            color: #33f;
            font-size: 20px;
            margin: 10px 0;
            cursor: pointer;
          }
        }

        &.active {
          opacity: 1;
          animation: float 6s ease-in-out infinite;
        }
      }
    }

    .main-area {
      border-radius: 15px;
      background: #000;
      box-shadow: 0 0 5px #333;
      padding: 20px 30px;
      width: 95%;
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
          flex-basis: fill;
          max-width: 45%;
          margin: 8px;
          height: 350px;
          .bg-text {
            display: flex;
            position: absolute;
            height: 100%;
            width: 100%;
            z-index: 21;
            background: rgba(0, 0, 0, 0.3);
            top: 0;
            color: #fff;
            font-size: 24px;
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
            width: 100%;
            height: 100%;
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
.tags {
  width: 100%;
  margin: 10px 0;

  .swiper-slide {
    position: relative;
    display: flex;
    justify-content: center;
    height: 280px;
    cursor: pointer;

    &.tags-slide {
      height: 130%;
      font-weight: 100;
      padding: 20px 0;
      color: #fff;
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
        background: $linear;
        rect {
          stroke-width: 5;
          stroke-dasharray: 0, 310;
          stroke-dashoffset: 48;
          transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
        }
      }
    }
  }
  .trend-tags {
    display: flex;
    color: #fff;
  }
  .tags-img {
    display: flex;
    margin: 30px auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 50%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tags-title {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    font-size: 38px;
    color: #fff;
    margin: 30px 0;
  }
}
/deep/ .ant-pagination {
  width: 90%;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  .ant-pagination-prev {
    a {
      color: #fff;
      border-radius: 50% 0 0 50%;
    }
  }
  .ant-pagination-next {
    a {
      color: #fff;
      border-radius: 0 50% 50% 0;
    }
  }
  .ant-pagination-item-link {
    background: $linear;
    &:hover {
      background: #f33;
      border-color: #fff;
    }
  }
  .ant-pagination-item {
    margin: 0 5px;
    padding: 0;
    border-radius: 50%;
    background: $linear;
    a {
      color: #fff;
    }
    &:hover {
      background: #f33;
      border-color: #fff;
    }
  }
  .ant-pagination-item-active {
    background: #f33;
    border-color: #fff;
  }
}
@keyframes float {
  0% {
    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
    transform: translatey(0px);
  }
  50% {
    box-shadow: 0 25px 15px 0px rgba(0, 0, 0, 0.2);
    transform: translatey(-20px);
  }
  100% {
    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
    transform: translatey(0px);
  }
}

@media screen and (max-width: 780px) {
  .container-top {
    .container {
      .avatar {
        width: 360px !important;
        .img-area {
          width: 330px !important;
          height: 330px !important;
          .bg-text {
            .title {
              font-size: 20px !important;
            }
            .label {
              margin: 5px 0 !important;
            }
            .text {
              white-space: nowrap;
              overflow: hidden;
              width: 100%;
              text-overflow: ellipsis;
            }
          }
          img {
            width: 100%;
          }
        }
      }
      .main-area {
        padding: 2px;
        .row {
          display: flex;
          flex-wrap: wrap;
          .gif-area {
            flex-grow: 1;
            max-width: 45%;
            flex-basis: 45%;
            margin: 5px;
            height: 150px;
          }
        }
      }
    }
  }
  .tags {
    .tags-title {
      font-size: 20px;
    }
  }
}

@media screen and (max-width: 400px) {
  .container-top {
    .tags {
      .tags-title {
        font-size: 16px;
      }
    }
  }
}
</style>
