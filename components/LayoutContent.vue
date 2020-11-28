<template>
  <div class="layout-content" :class="{ 'content--top': top, 'content--bottom': bottom }">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      top: {
        type: Boolean,
        default: true
      },
      bottom: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    &--top {
      margin-top: 50px;
    }
    &--bottom {
      margin-bottom: 20px;
    }
  }
</style>
