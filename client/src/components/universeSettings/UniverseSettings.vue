<template>
  <div class="settingsContainer">
    <h1>Paths of the planets</h1>
    <ul class="flex">
      <li v-for="(planet, index) in planets" :key="planet.name" :index="index" class="item">
        <svg class="svg" :width="width" :height="width" :viewbox="'0 0 ' + width + ' ' + width">
          <circle
            :fill="getColor(planet.color)"
            fill-opacity="0.5"
            :stroke="getColor(planet.color)"
            stroke-width="1"
            :r="radius"
            cx="0"
            cy="0"
            :transform="'translate(' + circleShift + ', ' + circleShift + ')'"
          ></circle>
          <path
            stroke="none"
            :fill="getColor(planet.signColor)"
            :d="planet.sign"
            :transform="'scale(2) translate(' + signShift + ', ' + signShift + ')'"
          ></path>
        </svg>
        <app-toggle-switch
          class="toggler"
          :checked="planet.showPath"
          @onChecked="onChecked(index, ...arguments)"
        ></app-toggle-switch>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import colorMixin from '../../mixins/colorMixin';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch.vue';

export default {
  mixins: [colorMixin],
  created() {},
  mounted() {
    this.setPathsVisibility();
  },
  beforeDestroy() {
    this.$emit('onClose', this.paths);
  },
  components: {
    appToggleSwitch: ToggleSwitch,
  },
  methods: {
    onChecked(index, value) {
      this.setVisibility(index, value);
    },
    setPathsVisibility() {
      this.planets.forEach((element, index) => {
        this.setVisibility(index, element.showPath);
      });
    },
    setVisibility(index, value) {
      this.paths[index] = value;
    },
  },
  computed: {
    ...mapGetters({
      planets: 'universe/planets',
    }),
    width() {
      return this.radius * 2.5;
    },
    circleShift() {
      return this.radius * 1.25;
    },
    signShift() {
      return this.radius * 0.35;
    },
  },
  data() {
    return {
      radius: 10,
      paths: [],
    };
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 14px;
  color: #18bdf0;
  text-align: center;
  margin-bottom: 0px;
}
.settingsContainer {
  position: absolute;
  width: 20%;
  height: auto;
  top: 0;
  left: 100px;
  background-color: rgba(#f2f2f2, 0.85);
  z-index: 999;
  opacity: 0;
  border: 1px solid #18bdf0;
  border-radius: 3px;
}
.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  padding: 10px;
  margin: 0;
}
.item {
  display: flex;
  align-items: center;
  margin: 5px;
}
.toggler {
  margin-left: 10px;
}
</style>
