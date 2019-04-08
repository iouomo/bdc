<template>
  <article ref="container" class="universeContainer">
    <div ref="settingsButton" class="settingsButton" @click="showSettings = !showSettings">
      <app-font-awesome-layers full-width class="fa-2x" :style="{ cursor: 'pointer' }">
        <app-font-awesome-icon ref="settingsButtonIcon" :icon="[ 'fa', 'cog' ]" class="fa icon"></app-font-awesome-icon>
      </app-font-awesome-layers>
    </div>
    <transition v-on:enter="enter" v-on:leave="leave">
      <app-universe-settings v-if="showSettings" @onClose="onSettingsClose"></app-universe-settings>
    </transition>
    <app-zodiac class="zodiac" :diameter="diameter"></app-zodiac>
    <app-solarSystem v-if="isReady" :diameter="solarSystemDiameter" :coords="coords"></app-solarSystem>
  </article>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import { mapGetters, mapActions } from 'vuex';
import UniverseSettings from '../universeSettings/UniverseSettings';
import Zodiac from '../zodiac/Zodiac';
import SolarSystem from '../solarSystem/SolarSystem';

library.add(faCog);

export default {
  created() {},
  destroyed() {},
  mounted() {
    this.init();
  },
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 0,
    },
    isReady: {
      type: Boolean,
      required: false,
      default: false,
    },
    coords: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  components: {
    appUniverseSettings: UniverseSettings,
    appZodiac: Zodiac,
    appSolarSystem: SolarSystem,
    appFontAwesomeIcon: FontAwesomeIcon,
    appFontAwesomeLayers: FontAwesomeLayers,
    appFontAwesomeLayersText: FontAwesomeLayersText,
  },
  methods: {
    ...mapActions({
      setEditMode: 'dashboard/setEditMode',
      setShowPaths: 'universe/setShowPaths',
    }),
    init() {
      this.calculateSSDiameter();
      this.isMounted = true;
      this.animateScene();
    },
    calculateSSDiameter() {
      const width = this.$refs.container.clientWidth;
      const height = this.$refs.container.clientHeight;
      this.solarSystemDiameter = (width > height ? height : width) * 0.8;
    },
    animateScene() {
      TweenLite.to(this.$refs.settingsButton, 1, {
        css: { opacity: 1 },
        ease: Linear.easeNone,
      });
      TweenLite.to(this.$refs.settingsButtonIcon, 1, {
        css: { rotation: 180 },
        ease: Linear.easeNone,
      });
    },
    enter(el, done) {
      TweenLite.to(el, 0.4, {
        css: { left: `${50}px`, opacity: 1 },
        ease: Linear.easeNone,
      });
    },
    leave(el, done) {
      TweenLite.to(el, 0.25, { css: { opacity: 0 }, ease: Linear.easeNone });
    },
    onSettingsClose(settings) {
      // console.log(settings)
      this.setEditMode(true);
      this.setShowPaths(settings);
      // this.setEditMode(false)
      this.$nextTick(() => {
        this.setEditMode(false);
      });
    },
  },
  computed: {},
  data() {
    return {
      isMounted: false,
      solarSystemDiameter: 0,
      showSettings: false,
    };
  },
};
</script>

<style scoped lang="scss">
.universeContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
.settingsButton {
  position: fixed;
  top: 10%;
  left: 20px;
  z-index: 999;
  border: 1px solid #18bdf0;
  outline: none;
  background-color: #f2f2f2; //#231f20;
  color: #18bdf0;
  cursor: pointer;
  pointer-events: bounding-box;
  padding: 8px;
  border-radius: 50%;
  font-size: 8px;
  opacity: 0;
}
</style>
