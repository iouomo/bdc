<template>
  <g ref="orb">
    <circle
      :fill="fillColor"
      :stroke="strokeColor"
      stroke-width=".5"
      :r="radius"
      :cx="center"
      :cy="center"
    ></circle>
    <circle
      :fill="handleColor"
      :stroke="handleColor"
      stroke-width=".5"
      :r="handleRadius"
      :cx="getDX(handleAngle)"
      :cy="getDY(handleAngle)"
      class="handle"
      @mousedown="onMouseDown"
    ></circle>
    <transition-group name="fade" tag="g">
      <text
        class="label"
        dominant-baseline="middle"
        text-anchor="middle"
        :fill="textColor"
        x="0"
        y="0"
        v-for="(label, index) in labels"
        :transform="getMatrix(index)"
        :key="handleName + index"
        @click="onLabelClick"
      >
        <template v-if="label.visible">{{label.text}}</template>
      </text>
    </transition-group>
  </g>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  created() {
    const diff = this.angleDiff(0, this.angle);
    this.updateHandleAngle(0, this.angle, diff);
  },
  mounted() {},
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 0,
    },
    handleProps: {
      type: Object,
      required: false,
      default: () => {},
    },
    angle: {
      type: Number,
      required: false,
      default: 0,
    },
    handelLabelsProps: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({}),
    labels() {
      return this.handelLabelsProps.labels;
    },
    degOffset() {
      return this.handelLabelsProps.degOffset;
    },
    sectorDegree() {
      return this.handelLabelsProps.sectorDegree;
    },
    handleRadius() {
      return this.handleProps.handleRadius;
    },
    strokeColor() {
      return this.handleProps.strokeColor;
    },
    textColor() {
      return this.handleProps.textColor;
    },
    fillColor() {
      return this.handleProps.fillColor;
    },
    handleColor() {
      return this.handleProps.handleColor;
    },
    handleName() {
      return this.handelLabelsProps.name;
    },
    radius() {
      return this.diameter * this.handleProps.width * 0.5;
    },
    center() {
      return this.diameter * 0.5;
    },
  },
  methods: {
    onLabelClick(event) {
      // async
      this.$emit('onEditMode', true);
      const labelText = event.target.innerHTML.replace(/[\n]/g, '').trim();
      const labelIndex = this.labels.findIndex(item => item.text === labelText);
      if (labelIndex !== -1) {
        this.$emit('onHandleMove', {
          name: this.handleName,
          maxValue: this.labels.length,
          value: Math.round(labelIndex),
        });
      }
      this.$nextTick(() => {
        this.$emit('onEditMode', false);
      });
    },
    onMouseDown(event) {
      event.preventDefault();
      this.$emit('onEditMode', true);
      this.mousePressed = true;

      const orbitCoordinates = this.$el.getBoundingClientRect();

      this.shiftX = orbitCoordinates.left;
      this.shiftY = orbitCoordinates.top;

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    },
    onMouseMove(event) {
      const newX = event.clientX - this.shiftX - this.radius - this.handleRadius;
      const newY = event.clientY - this.shiftY - this.radius - this.handleRadius;
      const radA = Math.atan2(newY, newX);
      let degA = Math.round(this.rad2Deg(radA)) + this.degOffset;

      this.handleAngle = degA;

      if (degA < 0) {
        degA += 360;
      }

      if (degA % Math.round(this.sectorDegree) === 0) {
        this.$emit('onHandleMove', {
          name: this.handleName,
          maxValue: this.labels.length,
          value: Math.round(degA / this.sectorDegree),
        });
      }
    },
    onMouseUp(event) {
      event.preventDefault();
      this.$emit('onEditMode', false);
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('mousemove', this.onMouseMove);
      this.mousePressed = false;
    },
    deg2Rad(deg) {
      return (deg * Math.PI) / 180;
    },
    rad2Deg(rad) {
      return (rad * 180) / Math.PI;
    },
    getDX(alpha, offset = 1) {
      const radA = this.deg2Rad(alpha - this.degOffset);
      const cosA = Math.cos(radA);

      return cosA * (this.radius - offset) + this.center;
    },
    getDY(alpha, offset = 0) {
      const radA = this.deg2Rad(alpha - this.degOffset);
      const sinA = Math.sin(radA);

      return sinA * (this.radius - offset) + this.center;
    },
    getMatrix(value) {
      const alpha = this.sectorDegree * value;
      const radA = this.deg2Rad(alpha);

      const sinA = Math.sin(radA);
      const cosA = Math.cos(radA);

      const a = cosA;
      const b = sinA;
      const c = -sinA;
      const d = cosA;

      const offset = 20;

      const dx = this.getDX(alpha, offset);
      const dy = this.getDY(alpha, offset);

      return `matrix(${a},${b},${c},${d},${dx},${dy})`;
    },
    updateHandleAngle(alpha, beta, diff, step = 10) {},
    angleDiff(alpha, beta) {
      const diff = ((beta - alpha + 180) % 360) - 180;
      return diff <= -180 ? diff + 360 : diff;
      // This works by noticing that we want to take the difference between the two angles, angle1 and angle2 and wrap that result to the range [-180, 179).
      // The mod operator allows us to wrap something to the range [0, n). I.e. x % n "wraps" (with a caveat for x < 0) x to the range [0, n).
      // Our range starts at -180 rather than 0, so we shift it over by adding 180. Then we wrap to 360, then we shift back. That's what the first line of the method does.
      //
      // The second line takes care of that little wrinkle with negative numbers.
      // If angle2 - angle1 + 180 happened to be less than 0, then diff will be less than 180.
      // In that case we just wrap it back into range by adding 360 to it. Otherwise we do nothing.
      //
      // As an added bonus, the input angles are completely unconstrained. They need not be between -360 and 360. They can be anything.
    },
  },
  data() {
    return {
      orbitCoordinates: undefined,
      handleAngle: 0,
      mousePressed: false,
      shiftX: 0,
      shiftY: 0,
    };
  },
  watch: {
    angle: {
      immediate: true,
      handler(value) {
        if (!this.mousePressed) {
          const alpha = this.handleAngle;
          const beta = value;
          const diff = this.angleDiff(alpha, beta);
          TweenLite.to(this.$data, 1, {
            handleAngle: alpha + diff,
            ease: Linear.easeNone,
          });
        }
      },
    },
  },
};
</script>
<style scoped lang="scss">
.redText {
  fill: tomato;
}
.handle {
  cursor: pointer;
}
.label {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  cursor: pointer;
  &.fade-enter-active,
  &.fade-leave-active {
    //
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
