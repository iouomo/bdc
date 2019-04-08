<template>
  <svg
    class="zodiac"
    :width="diameter"
    :height="diameter"
    :viewBox="'0 0 ' + diameter + ' ' + diameter"
  >
    <circle fill="none" stroke="#bcbcbc" stroke-width=".5" :r="radius" :cx="radius" :cy="radius"></circle>
    <circle fill="none" stroke="#bcbcbc" stroke-width=".5" :r="radius*.9" :cx="radius" :cy="radius"></circle>
    <circle
      fill="none"
      stroke="#bcbcbc"
      stroke-width=".5"
      :r="radius*.8"
      :cx="radius"
      :cy="radius"
      style="overflow: hidden"
    ></circle>
    <g v-for="(item) in zodiac" :key="item.name">
      <line
        :x1="getX(item.start, radius-1, radius)"
        :y1="getY(item.start, radius-1, radius)"
        :x2="getX(item.start, radius*.8, radius)"
        :y2="getY(item.start, radius*.8, radius)"
        stroke="#bcbcbc"
        stroke-width=".5"
      ></line>
      <g>
        <path
          :fill="elementColor(item.element)"
          stroke="none"
          stroke-width=".5"
          stroke-linecap="round"
          :d="getElement(item.element).sign"
          :transform="transform(item.start-5, item.end-5, radius * .85, radius, .013)"
        ></path>
        <path
          :fill="plantPartColor(item.plantPart)"
          stroke="none"
          stroke-width=".5"
          stroke-linecap="round"
          :d="plantPart(item.plantPart).sign"
          :transform="transform(item.start+5, item.end+5, radius * .85, radius, .013)"
        ></path>
        <path
          :fill="getColor(item.color)"
          stroke="none"
          stroke-width=".5"
          stroke-linecap="round"
          :d="item.sign"
          :transform="transform(item.start, item.end, radius * .95, radius, .013)"
        ></path>
      </g>
    </g>
  </svg>
</template>
<script>
import { mapGetters } from 'vuex';
import colorMixin from '../../mixins/colorMixin.js';

export default {
  mixins: [colorMixin],
  created() {},
  mounted() {},
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    getElement(elementName) {
      const elements = this.elements.filter(item => item.name === elementName);
      return elements[0];
    },
    plantPart(plantPartName) {
      const plantParts = this.plantParts.filter(
        item => item.name === plantPartName,
      );
      return plantParts[0];
    },
    plantPartColor(plantPartName) {
      const plantPart = this.plantPart(plantPartName);
      return this.getColor(plantPart.color);
    },
    elementColor(elementName) {
      const element = this.getElement(elementName);
      return this.getColor(element.color);
    },
    deg2Rad(deg) {
      return (deg * Math.PI) / 180;
    },
    rad2Deg(rad) {
      return (rad * 180) / Math.PI;
    },
    getX(alpha, length, radius) {
      const radA = this.deg2Rad(alpha);
      const cosA = Math.cos(radA);

      return cosA * length + radius;
    },
    getY(alpha, length, radius) {
      const radA = this.deg2Rad(alpha);
      const sinA = Math.sin(radA);

      return sinA * length + radius;
    },
    transform(start, end, length, radius, percent) {
      const angle = end + (start - end) / 2;
      const scale = radius * percent;

      const x = this.getX(angle, length, radius);
      const y = this.getY(angle, length, radius);

      return `translate(${x},${y}) scale(${scale}) translate(-2.5,-2.5)`;
    },
  },
  computed: {
    ...mapGetters({
      zodiac: 'universe/zodiac',
      elements: 'universe/elements',
      plantParts: 'universe/plantParts',
    }),
    radius() {
      return this.diameter * 0.5;
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
.zodiac {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.label {
  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.5s;
  }
  &.fade-enter-active {
    transition-delay: 0.5s;
  }
  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }
}
</style>
