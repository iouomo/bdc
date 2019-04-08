<template>
  <section class="dashboardContainer" ref="container">
    <transition appear name="fade">
      <app-clock class="clock" :diameter="diameter"></app-clock>
    </transition>
  </section>
</template>
<script>
import { mapActions } from 'vuex';
import Clock from '../clock/Clock.vue';

export default {
  created() {},
  mounted() {},
  components: {
    appClock: Clock,
  },
  methods: {
    ...mapActions({}),
  },
  data() {
    return {
      diameter: 450,
    };
  },
};
</script>
<style scoped>
.dashboardContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
.clock {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
