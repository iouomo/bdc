<template>
  <header class="flex">
    <div class="column left">
      <span class="logo" @click="restart">BIODYNAMIC CALENDAR</span>
    </div>
    <div class="column right">
      <span class="button" @click="$emit('onAbout')">About</span>
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    restart() {
      window.location.reload();
    },
  },
};
</script>
<style scoped lang="scss">
header {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 16px;
  border-bottom: 1px solid #bcbcbc;
  &.flex {
    display: flex;
    flex-flow: row;
    & .column {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1 0 auto;
      width: 50%;
      padding: 10px;
      &.left {
        align-items: flex-start;
      }
      &.right {
        align-items: flex-end;
      }
    }
    & .logo {
      cursor: pointer;
    }
    & .button {
      cursor: pointer;
      &:hover {
        color: #18bdf0;
      }
    }
  }
}
</style>
