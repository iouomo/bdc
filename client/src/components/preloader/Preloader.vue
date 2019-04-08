<template>
  <svg
    ref="preloader"
    class="preloader"
    :width="width"
    :height="height"
    :viewBox="'0 0 ' + width + ' ' + height"
  >
    <text :x="margins" y="49%">Calculating...</text>
    <path stroke="#bcbcbc" :d="path"></path>
    <path stroke="#18bdf0" :d="path" :stroke-dasharray="dash * k + ', ' + length"></path>
    <text class="center" x="50%" y="53%">{{ Math.round(dash) + '%' }}</text>
  </svg>
</template>
<script>
export default {
  created() {},
  destroyed() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  destroyed() {},
  props: {
    width: {
      type: Number,
      required: false,
      default: 0,
    },
    height: {
      type: Number,
      required: false,
      default: 0,
    },
    percent: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    init() {
      this.path = this.getPath();
    },
    getPath() {
      const x0 = this.margins;
      const y0 = this.height * 0.5;
      const x1 = this.width - this.margins;
      const y1 = this.height * 0.5;

      return `M ${x0} ${y0}, ${x1} ${y1}`;
    },
    toggleVisibility() {
      this.$emit('complete');
    },
  },
  computed: {
    length() {
      return this.width - this.margins * 2;
    },
    k() {
      return this.length / 100;
    },
  },
  data() {
    return {
      master: new TimelineLite({ paused: true }),
      path: 'M 0 0',
      margins: 10,
      dash: 0,
    };
  },
  watch: {
    percent: {
      immediate: false,
      handler(value) {
        TweenLite.to(this.$data, 1, { dash: value, ease: Power3.easeOut });
        if (value === 100) {
          const { preloader } = this.$refs;
          TweenLite.to(preloader, 1, {
            opacity: 0,
            delay: 0.5,
            ease: Power3.easeOut,
            onComplete: this.toggleVisibility,
          });
        }
      },
    },
  },
};
</script>
<style scoped lang="scss">
text {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #18bdf0;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.preloader {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.center {
  text-anchor: middle;
}
</style>
