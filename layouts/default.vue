<template>
  <div style="overflow-x: hidden;">
    <Nuxt />
    <Header />
    <Footer />
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

#__nuxt,
#__layout {
  height: 100%;
}
</style>
<script>
import Footer from "@/components/Footer";

export default {
  components: {
    Footer
  }
};
</script>
