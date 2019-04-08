<template>
  <transition name="modal">
    <div class="flex center modal-mask">
      <div class="flex column modal-container">
        <div class="flex column left modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="flex column center modal-body">
          <slot name="body" class="flex column left">default body</slot>
        </div>
        <div class="flex column right modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="$emit('close')">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  flex-flow: row;
  & .column {
    flex-flow: column;
  }
  &.left {
    align-items: flex-start;
  }
  &.center {
    align-items: center;
    justify-content: center;
  }
  &.right {
    align-items: flex-end;
  }
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  & .modal-container {
    width: 300px;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    & .modal-header {
      color: #18bdf0;
    }
    & .modal-body {
    }
    & .modal-footer {
      & .modal-default-button {
        cursor: pointer;
        border: 0;
        background: none;
        box-shadow: none;
        border-radius: 2px;
        border: 1px solid #18bdf0;
      }
    }
  }
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
