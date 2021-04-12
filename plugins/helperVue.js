import Vue from 'vue'
Vue.mixin({
  methods:{
    mySpecialMethod(value){
      console.log(value)
    },
    makeToast(mes) {
      const id = String(Math.floor(100 * Math.random()))
      this.$bvToast.toast(mes, {
        title:"Alert",
        autoHideDelay: 2500,
        variant: 'success',
        noCloseButton: true,
        solid: true,
        id: id,
      })
      return id
    },
    hideToast(id){
      this.$bvToast.hide(id)
    },
  }
})
