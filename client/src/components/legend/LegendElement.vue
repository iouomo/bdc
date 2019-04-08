<template>
  <g :transform="transform" :style="{opacity: opacity}">
    <app-planet-sign :planet="planet" :radius="radius"></app-planet-sign>
    <text
      class="legendText"
      text-anchor="middle"
      fill="#bcbcbc"
      x="0"
      :y="height * .75"
    >{{formattedLongitude}}</text>
    <app-zodiac-sign
      v-if="planet.name !== 'Earth'"
      :zodiacName="zodiacName"
      :transform="'scale(' + 4 + ')' + 'translate(-' + shiftX + ', ' + shiftY + ')'"
      :fill-opacity="zodiacOpacity"
    ></app-zodiac-sign>
  </g>
</template>

<script>
import ZodiacSign from '../zodiac/ZodiacSign';
import PlanetSign from '../planet/PlanetSign';

export default {
  created() {},
  mounted() {},
  components: {
    appElement: Element,
    appZodiacSign: ZodiacSign,
    appPlanetSign: PlanetSign,
  },
  props: {
    planet: {
      type: Object,
      required: false,
      default: () => {},
    },
    index: {
      type: Number,
      required: false,
      default: 0,
    },
    width: {
      type: Number,
      required: false,
      default: 0,
    },
    height: {
      type: Number,
      required: false,
      default: 50,
    },
    longitude: {
      type: Number,
      required: false,
      default: 0,
    },
    zodiacName: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {},
  computed: {
    transform() {
      const x = this.width * this.index + this.width / 2;
      const y = 0;
      return `translate(${x}, ${y})`;
    },
    shiftX() {
      return this.radius * 0.2;
    },
    shiftY() {
      return this.height * 0.25;
    },
    formattedLongitude() {
      const arr = (`${this.localLongitude.toFixed(2)}`).split('.', 2);
      const deg = String.fromCharCode(176);
      const min = String.fromCharCode(8242);
      return `${arr[0]}${deg}${arr[1]}${min}`;
    },
  },
  data() {
    return {
      localLongitude: 0,
      isReady: false,
      radius: 12,
      opacity: 0,
      zodiacOpacity: 0,
    };
  },
  watch: {
    longitude: {
      immediate: true,
      handler(value) {
        if (this.isReady) {
          if (value === 0) {
            TweenLite.set(this.$data, { clearProps: 'all' });
          } else {
            TweenLite.to(this.$data, 1, {
              localLongitude: value,
              ease: Linear.easeNone,
            });
          }
        }
      },
    },
  },
};
</script>

<style scoped lang="scss">
.legendText {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 12px;
}
</style>
