<template>
  <b-container>
    halo
    <b-button @click="myMes('ごめん')" variant="info">toast</b-button>
    <div>{{ docs }}</div>
  </b-container>
</template>

<script>
  import PouchDB from 'pouchdb'
  import {setPouchData, syncCloudant} from '@/plugins/pouchHelper'

  export default {
    data() {
      return {
        docs: [],
      }
    },
    mounted() {
      const vm = this
      const testDat = new PouchDB('fct')
      let toastID = ''
      testDat.info().then(function (info) {
        if (!(info.doc_count)) {
          toastID = vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          syncCloudant('fct').then(dataset => {
            setPouchData(dataset).then(result => {
              vm.docs = result
            })
          })
        } else {
          toastID = vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          setPouchData(testDat).then(result => {
            vm.docs = result
            vm.hideToast(toastID)
          })
        }
      })
    },
    methods: {
      myMes(mes) {
        const i = this.makeToast(mes)
        console.log('id: ' + i)
      },
      makeToast(mes) {
        const id = String(Math.floor(100 * Math.random()))
        this.$bvToast.toast(mes, {
          autoHideDelay: 5000,
          variant: "info",
          noCloseButton: true,
          id: id,
        })
        return id
      },
      hideToast(id){
        this.$bvToast.hide(id)
      },
    },
  }
</script>
