<template>
  <article class="container">
    <svg class="legend" :width="width" :height="height" :viewBox="'0 0 ' + width + ' ' + height">
      <app-element
        v-for="(planet, index) in planets"
        :ref="planet.name"
        :key="planet.name"
        :index="index"
        :planet="planet"
        :longitude="planetLongitude(index)"
        :zodiacName="planetInZodiac(index)"
        :width="elementWidth"
        :height="height"
      ></app-element>
    </svg>
  </article>
</template>
<script>
import { mapGetters } from 'vuex';
import Element from './LegendElement';

export default {
  created() {},
  mounted() {},
  components: {
    appElement: Element,
  },
  props: {
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
    coords: {
      type: Object,
      required: false,
      default: () => {},
    },
    isReady: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    init() {
      const tl = new TimelineLite({ paused: true });
      this.planets.forEach((elem, index) => {
        const planet = this.$refs[elem.name];
        const longitude = this.planetLongitude(index);
        tl.add(
          TweenLite.to(planet, 0.3, {
            opacity: 1,
            localLongitude: longitude,
            zodiacOpacity: 1,
            ease: Linear.easeNone,
          }),
        );
        tl.add(
          TweenLite.to(planet, 0.1, { isReady: true, ease: Linear.easeNone }),
        );
        tl.play();
      });
    },
    planetLongitude(index) {
      let longitude = 0;
      if (this.coords !== undefined) {
        longitude = this.coords.polar[index].longitude;
      }
      return longitude;
    },
    planetInZodiac(index) {
      if (this.coords !== undefined) {
        return this.coords.zodiac[index];
      }
      return '';
    },
  },
  computed: {
    ...mapGetters({
      planets: 'universe/planets',
    }),
    elementWidth() {
      return this.width / (this.planets.length + 0);
    },
  },
  data() {
    return {
      radius: 10,
      opacity: 0,
    };
  },
  watch: {
    isReady: {
      immediate: false,
      handler(value) {
        if (value) {
          this.init();
        }
      },
    },
  },
};
</script>
<style scoped lang="scss">
  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .legend {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
