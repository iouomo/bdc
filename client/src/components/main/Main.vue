<template>
  <main class="flex">
    <section ref="leftColumn" class="column left">
      <app-universe
        v-if="isMounted"
        class="bigItem"
        :coords="coords"
        :diameter="universeWidth"
        :isReady="isReady"
      ></app-universe>
      <app-legend class="item" :coords="coords" :width="universeWidth" :isReady="isReady"></app-legend>
    </section>
    <section ref="centerColumn" class="column center">
      <app-calendar
        :key="currentMonth"
        v-if="isMounted"
        class="item"
        :width="calendarWidth"
        :height="calendarHeight"
      ></app-calendar>
    </section>
    <section ref="rightColumn" class="column right">
      <app-aspects
        v-if="isMounted"
        class="item"
        :width="aspectsWidth"
        :height="calendarHeight * .5"
      ></app-aspects>
      <app-dashboard class="item"></app-dashboard>
    </section>
  </main>
</template>
<script>
import { mapGetters } from 'vuex';
import Dashboard from '../dashboard/Dashboard';
import Universe from '../universe/Universe';
import Legend from '../legend/Legend';
import Calendar from '../calendar/Calendar';
import Aspects from '../calendar/Aspects';

export default {
  components: {
    appDashboard: Dashboard,
    appUniverse: Universe,
    appLegend: Legend,
    appCalendar: Calendar,
    appAspects: Aspects,
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.init();
      this.isMounted = true;
    });
  },
  computed: {
    ...mapGetters({
      coords: 'universe/filteredCoordinates',
      firstOfTheMonth: 'dashboard/firstOfTheMonth',
    }),
    isReady() {
      return (
        this.isMounted
        && (typeof this.coords !== 'undefined'
          && this.coords.constructor === Object
          && Object.entries(this.coords).length !== 0)
      );
    },
  },
  methods: {
    init() {
      this.setWidth();
    },
    setWidth() {
      this.universeWidth = this.$refs.leftColumn.clientWidth;
      this.calendarWidth = this.$refs.centerColumn.clientWidth;
      this.calendarHeight = this.$refs.centerColumn.clientHeight;
      this.aspectsWidth = this.$refs.rightColumn.clientWidth;
    },
  },
  data() {
    return {
      universeWidth: 0,
      calendarWidth: 0,
      calendarHeight: 0,
      aspectsWidth: 0,
      isMounted: false,
      currentMonth: 0,
    };
  },
  watch: {
    firstOfTheMonth: {
      immediate: true,
      handler(value) {
        if (value !== 0 && value !== this.currentMonth) {
          this.currentMonth = value;
        }
      },
    },
  },
};
</script>
<style scoped lang="scss">
main {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.flex {
  display: flex;
  flex-flow: row wrap;
  flex: 1 0 auto;
  & .column {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    padding: 10px;
    & .item {
      flex: 1;
    }
    & .bigItem {
      flex: 5;
    }
  }
  & .left {
    width: 50%;
    border-right: 1px solid #bcbcbc;
    background-color: #f2f2f2;
  }
  & .center {
    width: 15%;
    background-color: #ffffff;
  }
  & .right {
    width: 35%;
    background-color: #ffffff;
  }
}
.vertical {
  flex-direction: column;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
