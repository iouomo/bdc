<template>
  <svg :width="diameter" :height="diameter" :viewBox="'0 0 ' + diameter + ' ' + diameter">
    <app-first-handle
      v-if="true"
      :diameter="diameter"
      :handleProps="firstHandleProps"
      :angle="firstHandleAngle"
      :handelLabelsProps="firstHandleLabelsProps"
      @onHandleMove="onHandleMove"
      @onEditMode="onEditMode"
    ></app-first-handle>
    <app-second-handle
      v-if="true"
      :diameter="diameter"
      :handleProps="secondHandleProps"
      :angle="secondHandleAngle"
      :handelLabelsProps="secondHandleLabelsProps"
      @onHandleMove="onHandleMove"
      @onEditMode="onEditMode"
    ></app-second-handle>
    <app-third-handle
      v-if="true"
      :diameter="diameter"
      :handleProps="thirdHandleProps"
      :angle="thirdHandleAngle"
      :handelLabelsProps="thirdHandleLabelsProps"
      @onHandleMove="onHandleMove"
      @onEditMode="onEditMode"
    ></app-third-handle>
    <app-display :diameter="diameter" :displayProps="displayProps" @onButtonClick="onButtonClick"></app-display>
  </svg>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

// import fortawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import Display from '../display/Display.vue';
import Handle from '../handle/Handle.vue';

library.add(faClock);

export default {
  created() {},
  mounted() {},
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  components: {
    appFirstHandle: Handle,
    appSecondHandle: Handle,
    appThirdHandle: Handle,
    appDisplay: Display,

    appFontAwesomeIcon: FontAwesomeIcon,
    appFontAwesomeLayers: FontAwesomeLayers,
    appFontAwesomeLayersText: FontAwesomeLayersText,
  },
  methods: {
    ...mapActions({
      setCurrentView: 'dashboard/setCurrentView',
      adjustClock: 'dashboard/adjustClock',
      setEditMode: 'dashboard/setEditMode',
    }),
    onHandleMove(response) {
      // coorection for the last day of a month
      if (response.name === 'date' && response.value === 0) {
        response.value = response.maxValue;
      }
      this.adjustClock(response);
    },
    onEditMode(payload) {
      this.setEditMode(payload);
    },
    onButtonClick(settings) {
      // async
      const { name } = settings;
      const { value } = settings;

      if (name === 'currentView') {
        this.setCurrentView(value);
      } else {
        this.setEditMode(true);
        this.adjustClock(settings);
        this.$nextTick(() => {
          this.setEditMode(false);
        });
      }
    },
  },
  computed: {
    ...mapGetters({
      currentView: 'dashboard/currentView',
      displayProps: 'dashboard/displayProps',
      firstHandleProps: 'dashboard/firstHandleProps',
      secondHandleProps: 'dashboard/secondHandleProps',
      thirdHandleProps: 'dashboard/thirdHandleProps',
      firstHandleAngle: 'dashboard/firstHandleAngle',
      secondHandleAngle: 'dashboard/secondHandleAngle',
      thirdHandleAngle: 'dashboard/thirdHandleAngle',
      handlesLabelsProps: 'dashboard/handlesLabelsProps',
      editMode: 'dashboard/editMode',
    }),
    firstHandleLabelsProps() {
      return this.handlesLabelsProps[0];
    },
    secondHandleLabelsProps() {
      return this.handlesLabelsProps[1];
    },
    thirdHandleLabelsProps() {
      return this.handlesLabelsProps[2];
    },
  },
  data() {
    return {};
  },
};
</script>
<style>
</style>
