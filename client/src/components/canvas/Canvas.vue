<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>
<script>
export default {
  created() {
    window.addEventListener('resize', this.resized);
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resized);
  },
  props: {
    backgroundColor: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    init() {
      this.isMounted = true;
    },
    resize() {
      const width = this.getWith();
      const height = this.getHeight();
      this.app.renderer.resize(width, height);
    },
    resized() {
      this.isResized = true;
    },
    scale() {
      this.context.scale(this.resolution, this.resolution);
    },
    drawImage(image) {
      this.context.drawImage(
        image,
        0,
        0,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height,
      );
    },
    clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    },
    fill() {
      this.context.fillRect(0, 0, this.width, this.height);
    },
    check() {
      const blank = document.createElement('canvas');
      blank.width = this.canvas.width;
      blank.height = this.canvas.height;
    },
    getWith() {
      return this.canvas.clientWidth * this.resolution;
    },
    getHeight() {
      return this.canvas.clientHeight * this.resolution;
    },
  },
  computed: {
    canvas() {
      return this.$refs.canvas;
    },
    context() {
      return this.canvas.getContext('2d');
    },
    width() {
      return this.isMounted ? this.getWith() : 0;
    },
    height() {
      return this.isMounted ? this.getHeight() : 0;
    },
    container() {},
  },
  data() {
    return {
      resolution: window.devicePixelRatio || 1,
      isMounted: false,
      isResized: false,
    };
  },
};
</script>
<style scoped lang="scss">
.canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
