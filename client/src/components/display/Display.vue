<template>
  <svg class="display">
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="65%" :stop-color="firstColor"></stop>
      <stop offset="35%" :stop-color="secondColor"></stop>
    </linearGradient>
    <circle
      id="display"
      fill="url(#lg)"
      :r="radius"
      :cx="center"
      :cy="center"
      stroke="#bcbcbc"
      stroke-width=".5"
    ></circle>
    <symbol id="caret">
      <path
        :d="'M 0 0 L 0 ' + iconSize + ' L ' + iconSize*.5 + ' ' + iconSize*.5 + ' Z'"
        :fill="firstColor"
      ></path>
    </symbol>

    <use xlink:href="#caret" x="56%" :y="caretY + '%'"></use>
    <g
      v-for="(button, index) in buttons"
      class="icon"
      @click="onButtonClick('currentView', button.view, index)"
      :key="index"
    >
      <app-font-awesome-icon
        :icon="[ 'fa', button.icon ]"
        class="fa-inverse"
        :x="'60%'"
        :y="getIconY(index) + '%'"
        :width="iconSize"
        :height="iconSize"
      ></app-font-awesome-icon>
      <text v-if="index === 1" :x="'62.5%'" :y="'50%'" class="fs-small center hanging">{{ date }}</text>
    </g>
    <g>
      <template v-if="currentView === 'clock'" :opacity="mainbarOpacity">
        <text class="right fs-big" x="53%" y="50%" dx="0" dy="-3%">{{ formattedTime }}</text>
        <text class="right fs-medium" x="53%" y="50%" dx="0" dy="3%">{{ formattedDate }}</text>
        <text class="right fs-small" x="53%" y="50%" dx="0" dy="7%">{{ timeZoneString }}</text>
      </template>
      <template v-if="currentView === 'calendar'">
        <app-font-awesome-icon
          :icon="[ 'fa', 'chevron-up' ]"
          :width="iconSize"
          :height="iconSize"
          :x="'43%'"
          :y="'42%'"
          :style="{ cursor: 'pointer' }"
          @click="onButtonClick('year', year+1, 1)"
        ></app-font-awesome-icon>
        <text
          class="right fs-big central"
          x="53%"
          y="50%"
          dx="0"
          dy="0"
          :opacity="mainbarOpacity"
        >{{ year }}</text>
        <app-font-awesome-icon
          :icon="[ 'fa', 'chevron-down' ]"
          :width="iconSize"
          :height="iconSize"
          :x="'43%'"
          :y="'53%'"
          :style="{ cursor: 'pointer' }"
          @click="onButtonClick('year', year-1, 1)"
        ></app-font-awesome-icon>
        <text
          class="right fs-medium"
          x="53%"
          y="60%"
          dx="0"
          dy="0"
          :opacity="mainbarOpacity"
        >{{ formattedDate }}</text>
      </template>
      <template v-if="currentView === 'location'" :opacity="mainbarOpacity">
        <text
          v-for="(city, index) in cities"
          :key="city"
          class="right fs-small"
          x="53%"
          :y="citiesY + '%'"
          dx="0%"
          :dy="3 * index + 1 + '%'"
        >{{ city }}</text>
      </template>
    </g>
  </svg>
</template>
<script>
import { mapGetters } from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faClock);
library.add(faCalendar);
library.add(faChevronUp);
library.add(faChevronDown);
library.add(faMapMarkedAlt);
library.add(faCaretRight);

export default {
  created() {},
  mounted() {},
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 0,
    },
    displayProps: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  components: {
    appFontAwesomeIcon: FontAwesomeIcon,
  },
  methods: {
    onButtonClick(property, newValue, index) {
      this.indexButton = index;
      this.$emit('onButtonClick', { name: property, value: newValue });
    },
    getIconY(iconIndex) {
      return 37.5 + iconIndex * 10;
    },
  },
  computed: {
    ...mapGetters({
      currentView: 'dashboard/currentView',
      year: 'dashboard/year',
      date: 'dashboard/date',
      formattedDate: 'dashboard/formattedDate',
      formattedTime: 'dashboard/formattedTime',
      timeZoneString: 'dashboard/timeZoneString',
    }),
    center() {
      return this.diameter * 0.5;
    },
    size() {
      return this.diameter;
    },
    radius() {
      return this.diameter * 0.22;
    },
    buttons() {
      return this.displayProps.buttons;
    },
    iconSize() {
      return this.diameter * 0.05;
    },
    cities() {
      return this.displayProps.cities;
    },
    firstColor() {
      return this.displayProps.firstColor;
    },
    secondColor() {
      return this.displayProps.secondColor;
    },
    citiesY() {
      return 50 - (this.cities.length / 2) * 3;
    },
  },
  data() {
    return {
      indexButton: 0,
      mainbarOpacity: 1,
      caretY: 0,
    };
  },
  watch: {
    indexButton: {
      immediate: true,
      handler(value) {
        TweenLite.to(this.$data, 0.75, {
          caretY: this.getIconY(value),
          ease: Linear.easeNone,
        });
      },
    },
  },
};
</script>
<style scoped lang="scss">
text {
  font-family: "Play", sans-serif;
  dominant-baseline: mathematical;
}
.display {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.icon {
  color: #fbfbfb;
  cursor: pointer;
  pointer-events: bounding-box;
}
.bold {
  font-weight: 700;
}
.left {
  text-anchor: start;
}
.center {
  text-anchor: middle;
}
.right {
  text-anchor: end;
}
.fs-big {
  font-size: 1.8em;
}
.fs-medium {
  font-size: 1em;
}
.fs-small {
  font-size: 0.75em;
}
.central {
  dominant-baseline: central;
}
.mathematical {
  dominant-baseline: mathematical;
}
.hanging {
  dominant-baseline: hanging;
}
</style>
