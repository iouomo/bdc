<template>
  <div id="app" class="noselect app">
    <app-header @onAbout="showAbout = true"></app-header>
    <app-main></app-main>
    <app-footer></app-footer>
    <app-about v-if="showAbout" @close="showAbout = false">
      <h3 slot="header">About</h3>
      <div slot="body">
        <h4>Frontend</h4>
        <a href="https://vuejs.org/">
          <img src="./assets/icons/vuejs.png" height="64" width="64" alt="Vue.js">
        </a>
        <a href="https://greensock.com/">
          <img src="./assets/icons/greensock.png" height="64" width="64" alt="GSAP">
        </a>
        <a href="http://konvajs.org/">
          <img src="./assets/icons/konva.png" height="64" width="64" alt="Konva">
        </a>
        <h4>Backend</h4>
        <a href="https://www.astro.com/">
          <img src="./assets/icons/astrodienst.png" height="64" width="64" alt="Astrodienst AG">
        </a>
        <a href="https://nodejs.org/">
          <img src="./assets/icons/nodejs.png" height="64" width="64" alt="Node.js">
        </a>
        <a href="https://expressjs.com/">
          <img src="./assets/icons/expressjs.png" height="64" width="64" alt="Express.js">
        </a>
      </div>
    </app-about>
  </div>
</template>

<script>
import { TweenLite, TimelineLite } from 'gsap';
import { mapGetters, mapActions } from 'vuex';
import Konva from 'konva';
import Header from './components/header/Header';
import Main from './components/main/Main';
import Footer from './components/footer/Footer';
import Modal from './components/modal/Modal';

export default {
  name: 'app',
  created() {},
  mounted() {
    this.master.add(this.timer(1, 1, this.updateCoordinates), 0);
    this.master.add(this.timer(-1, 1, this.tickTack), 1);
    // this.master.add(this.timer(1, 1, this.updateDaysInfo), 1);
    this.master.add(this.timer(-1, 10, this.updateCoordinates), 1);
    this.master.play();
  },
  components: {
    appHeader: Header,
    appMain: Main,
    appFooter: Footer,
    appAbout: Modal,
  },
  methods: {
    ...mapActions({
      tickTack: 'dashboard/tickTack',
      fillCoordinates: 'universe/fillCoordinates',
      eraseDayInfo: 'universe/eraseDayInfo',
      fillDayInfo: 'universe/fillDayInfo',
    }),
    restart() {
      this.master.restart(true, false);
    },
    pause() {
      this.master.pause();
    },
    timer(repeat, duration, callback) {
      const tl = new TimelineMax();
      tl.to({}, duration, {
        repeat,
        onRepeat: callback,
      });
      return tl;
    },
    updateCoordinates() {
      this.fillCoordinates({ ms: this.ms, ratio: this.ratio });
    },
    updateDaysInfo() {
      this.eraseDayInfo();
      for (let i = 0; i < this.daysInTheMonth; i++) {
        const startOfTheDay = this.firstOfTheMonth + i * 86400000; // A day holds 86 400 000 milliseconds
        this.fillDayInfo({ ms: startOfTheDay, dayNumber: i + 1 });
      }
      this.firstOfTheMonthLocal = this.firstOfTheMonth;
    },
  },
  computed: {
    ...mapGetters({
      editMode: 'dashboard/editMode',
      ms: 'dashboard/ms',
      ratio: 'dashboard/ratio',
      firstOfTheMonth: 'dashboard/firstOfTheMonth',
      daysInTheMonth: 'dashboard/daysInTheMonth',
      daysInfo: 'universe/daysInfo',
    }),
  },
  data() {
    return {
      master: new TimelineLite({ paused: true }),
      firstOfTheMonthLocal: 0,
      showAbout: false,
    };
  },
  watch: {
    editMode: {
      immediate: false,
      handler(editMode) {
        if (editMode) {
          this.pause();
        } else {
          this.restart();
        }
      },
    },
    firstOfTheMonth: {
      immediate: true,
      handler(value) {
        if (value !== 0 && this.firstOfTheMonthLocal !== value) {
          this.updateDaysInfo();
        }
      },
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Play:400,700");
@import url("https://fonts.googleapis.com/css?family=Roboto:300,500");

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
.app {
  display: flex;
  height: 100vh;
  flex-flow: column wrap;
  min-width: 500px;
}
</style>
