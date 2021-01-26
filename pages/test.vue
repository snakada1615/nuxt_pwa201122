<template>
  <b-container>
    halo:{{$store.state.user}}
    online:{{$nuxt.isOnline}}
  </b-container>
</template>

<script>
  export default {
    data(){
      return {
        stop: true
      }
    },
    methods: {
      handler (event) {
        if (this.stop) {
          event.returnValue = "Data you've inputted won't be synced"
        }
      }
    },
    created () {
      console.log('created')
      window.addEventListener("beforeunload", this.handler)
    },
    destroyed () {
      console.log('destroyed')
      window.removeEventListener("beforeunload", this.handler)
    },
    beforeRouteLeave (to, from, next) {
      let answer = window.confirm("Data you've inputted won't be synced, OK?")
      if (answer) {
        next()
      } else {
        next(false)
      }
    }  }
</script>
