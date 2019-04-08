<template>
  <label class="switch">
    <input type="checkbox" v-model="value" @change="onChange">
    <span class="slider round"></span>
  </label>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    onChange(event) {
      this.$emit('onChecked', event.target.checked);
    },
  },
  computed: {},
  data() {
    return {
      value: this.checked,
    };
  },
};
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

/* The slider */

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  &:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
  }
}

input {
  &:checked + .slider {
    background-color: #18bdf0;
  }
  &:focus + .slider {
    box-shadow: 0 0 1px #18bdf0;
  }
  &:checked + .slider:before {
    transform: translateX(13px);
  }
}

/* Rounded sliders */

.slider.round {
  border-radius: 17px;
  &:before {
    border-radius: 50%;
  }
}
</style>
