<template>
  <b-modal>
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</template>

<script>
  export default {
    // ...
    methods: {
      // ...
      handleHide(bvEvt) {
        if (bvEvt.trigger === 'ok') {
          // User clicked OK button
          this.$emit('input', 'click ok')
        } else {
          // The modal was closed not via the `ok` button
          this.$emit('input', null)
        }
      }
    }
  };
</script>
