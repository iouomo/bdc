<template>
  <article class="calendarContainer flex">
    <svg class="calendar" :width="width" :height="height" :viewBox="'0 0 ' + width + ' ' + height">
      <text fill="#18bdf0" class="month">{{month}}</text>
      <g v-if="isReady">
        <app-day
          v-for="(elem, index) in daysInTheMonth"
          :ref="'day_' + (index + 1)"
          :key="'day_' + (index + 1)"
          :index="index"
          :day="elem"
          :width="width"
          :height="dayHeight"
          :info="getDayInfo(index)"
        ></app-day>
      </g>
      <g v-else>
        <app-preloader :percent="percent" :width="width" :height="height" @complete="onLoad"></app-preloader>
      </g>
    </svg>
  </article>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Preloader from '../preloader/Preloader';
import Day from './Day';

export default {
  created() {},
  destroyed() {},
  mounted() {
    this.init();
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
      default: 0,
    },
  },
  components: {
    appPreloader: Preloader,
    appDay: Day,
  },
  methods: {
    init() {},
    getDayInfo(index) {
      const info = this.dayInfo(index + 1);
      if (info.length !== 0) {
        return info[0];
      }
    },
    onLoad() {
      this.isReady = true;
    },
  },
  computed: {
    ...mapGetters({
      month: 'dashboard/monthForCalendar',
      daysInTheMonth: 'dashboard/daysInTheMonth',
      firstOfTheMonth: 'dashboard/firstOfTheMonth',
      daysInfoLength: 'universe/daysInfoLength',
      dayInfo: 'universe/dayInfo',
    }),
    dayHeight() {
      return this.height / this.daysInTheMonth - 0.5;
    },
    percent() {
      return Math.round((this.daysInfoLength / this.daysInTheMonth) * 100);
    },
  },
  data() {
    return {
      isReady: false,
      apogee: 0,
      perigee: 0,
    };
  },
};
</script>
<style scoped lang="scss">
.calendarContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
.calendar {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.month {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 20px;
  text-anchor: left;
}
</style>
