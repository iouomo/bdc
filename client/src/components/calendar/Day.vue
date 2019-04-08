<template>
  <g :transform="transform" :style="{opacity: opacity, }">
    <text class="day" fill="#000" :x="width * .25" :font-size="width*.055">{{ formattedDate }}</text>
    <g :transform="moonTransform">
      <linearGradient :id="'day_' + day" x1="0" y1="0" x2="1" y2="0">
        <template v-if="phase <= 1">
          <stop :offset="phase" stop-color="#fff"/>
          <stop :offset="phase" stop-color="#f2f2f2"/>
        </template>
        <template v-else>
          <stop :offset="phase-1" stop-color="#f2f2f2"/>
          <stop :offset="phase-1" stop-color="#fff"/>
        </template>
      </linearGradient>
      <circle
        :fill="'url(#' + 'day_' + day + ')'"
        stroke="#bcbcbc"
        stroke-width="1"
        :r="height * .45"
        cx="0"
        cy="0"
      ></circle>
      <text class="moonPhase" fill="#000" x="0" y="0">
        {{ newMoon }}
        {{ fullMoon }}
      </text>
    </g>
    <g v-if="moonAspects.length > 0">
      <g
        v-for="(elem, index) in moonAspects"
        :key="'asp_' + (index + 1)"
        :transform="aspectsTransform(index)"
      >
        <app-zodiac-sign :zodiacName="elem.zodiac" transform="scale(2.5)"></app-zodiac-sign>
        <text
          v-if="index > 0"
          class="aspectText"
          fill="#000"
          :x="width * .03"
          :y="height * .6"
        >{{ dateFromTime(elem.ms) }}</text>
      </g>
    </g>
  </g>
</template>
<script>
import { mapGetters } from 'vuex';
import colorMixin from '../../mixins/colorMixin.js';
import ZodiacSign from '../zodiac/ZodiacSign';

export default {
  mixins: [colorMixin],
  created() {},
  destroyed() {},
  mounted() {
    this.init();
  },
  props: {
    index: {
      type: Number,
      required: false,
      default: 0,
    },
    day: {
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
      default: 0,
    },
    info: {
      type: Object,
      required: false,
      default: () => {},
    },
    apogee: {
      type: Boolean,
      required: false,
      default: false,
    },
    perigee: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    appZodiacSign: ZodiacSign,
  },
  methods: {
    init() {},
    dateFromTime(ms) {
      if (ms === undefined) {
        return undefined;
      }
      const options = {
        hour: '2-digit',
        minute: '2-digit',
      };
      return this.msToDate(ms, options);
    },
    aspectsTransform(index) {
      const x = this.width * 0.5 + this.width * 0.12 * index;
      const y = -this.height * 0.25;
      return `translate(${x}, ${y})`;
    },
  },
  computed: {
    ...mapGetters({
      dateForCalendar: 'dashboard/dateForCalendar',
      msToDate: 'dashboard/msToDate',
    }),
    moonX() {
      return this.width * this.distance - this.width * 0.4;
    },
    y() {
      return this.height * this.day + this.height * 0.5;
    },
    formattedDate() {
      return this.dateForCalendar(this.day);
    },
    transform() {
      return `translate(${0}, ${this.y})`;
    },
    moonTransform() {
      return `translate(${this.moonX})`;
    },
    moonAspects() {
      const newData = this.aspects.map(elem => ({
        ms: elem.ms,
        zodiac: elem.zodiac[0],
      }));
      return newData.filter((elem, index, arr) => {
        if (index == 0) {
          return true;
        }
        return elem.zodiac !== arr[index - 1].zodiac;
      });
    },
  },
  data() {
    return {
      opacity: 0,
      distance: 0,
      phase: 0,
      newMoon: undefined,
      fullMoon: undefined,
      aspects: [],
    };
  },
  watch: {
    info: {
      immediate: true,
      handler(value) {
        if (value !== undefined) {
          this.distance = value.info.moonDistance * 300;
          this.phase = value.info.moonPhase.maxAngle;
          this.newMoon = this.dateFromTime(value.info.moonPhase.newMoon);
          this.fullMoon = this.dateFromTime(value.info.moonPhase.fullMoon);
          this.aspects = value.info.aspects;
          TweenLite.to(this.$data, 2, { opacity: 1, ease: Power3.easeOut });
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
  dominant-baseline: central;
  text-anchor: start;
}
.day {
  text-anchor: end;
}
.moonPhase {
  text-anchor: middle;
  font-size: 12px;
}
.aspectText {
  font-size: 9px;
  text-anchor: middle;
  dominant-baseline: hanging;
}
</style>
