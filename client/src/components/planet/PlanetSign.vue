<template>
  <g>
    <circle
      :fill="getColor(planet.color)"
      fill-opacity=".5"
      :stroke="getColor(planet.stroke)"
      stroke-width="1"
      :r="radius"
      cx="0"
      cy="0"
    ></circle>
    <path
      stroke="none"
      :fill="getColor(planet.signColor)"
      :d="planet.sign"
      :transform="'scale(3) translate(-' + shift + ', -' + shift + ')'"
    ></path>
  </g>
</template>
<script>
import { mapGetters } from 'vuex';
import colorMixin from '../../mixins/colorMixin.js';

export default {
  mixins: [colorMixin],
  created() {},
  destroyed() {},
  mounted() {
    this.init();
  },
  props: {
    planet: {
      type: Object,
      required: false,
      default: () => {},
    },
    radius: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  components: {},
  methods: {
    init() {},
  },
  computed: {
    shift() {
      return this.radius * 0.2;
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
</style>
