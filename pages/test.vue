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
        form_dirty: true
      }
    },
    beforeRouteLeave (to, from, next) {
      // If the form is dirty and the user did not confirm leave,
      // prevent losing unsaved changes by canceling navigation
      console.log('leaving')
      if (this.confirmStayInDirtyForm()){
        next(false)
      } else {
        // Navigate to next view
        next()
      }
    },

    created() {
      window.addEventListener('beforeunload', this.beforeWindowUnload)
    },

    beforeDestroy() {
      window.removeEventListener('beforeunload', this.beforeWindowUnload)
    },

    methods: {
      confirmLeave() {
        return window.confirm('Do you really want to leave? you have unsaved changes!')
      },

      confirmStayInDirtyForm() {
        return this.form_dirty && !this.confirmLeave()
      },

      beforeWindowUnload(e) {
        if (this.confirmStayInDirtyForm()) {
          // Cancel the event
          e.preventDefault()
          // Chrome requires returnValue to be set
          e.returnValue = ''
        }
      },
    },
 }
</script>

