<template>
  <b-container class="my-2">
    <div>test prop component</div>
    <div>{{ name }}</div>
    <b-button
      variant="info"
      size="sm"
      @click="changeComputedValue"
    >push me</b-button>
  </b-container>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
      },
    },
    computed: {
      syncedName: {
        get() {
          return this.name
        },
        set(value) {
          this.$emit('update:name', value)
        },
      },
    },
    methods:{
      changeComputedValue(){
        this.syncedName = this.syncedName + '_i changed'
      }
    },
  }
</script>
