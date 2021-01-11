<template>
  <b-container>
    <dri-table2 v-model="selected" :items="itemsDRI"></dri-table2>
    seleceted by main: {{selected}}
    <b-input v-model="selected">selection</b-input>
  </b-container>
</template>

<script>
  import PouchDB from 'pouchdb'
  import {getPouchData, syncCloudant} from '@/plugins/pouchHelper'
  import driTable2 from "../components/organisms/driTable2";

  export default {
    components: {
      driTable2
    },
    data() {
      return {
        dat: '',
        idDat: '',
        selected: '5',
        itemsDRI: [],
      }
    },
    mounted() {
      const dri = new PouchDB('dri')
      const vm = this
      dri.info().then(function (info) {
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          syncCloudant('dri').then(dataset => {
            getPouchData(dataset).then(docs => {
              vm.setDRI(docs)
            })
          })
        } else {
          getPouchData(dri).then(docs => {
            vm.setDRI(docs)
          })
        }
      })
    },
    methods: {
      setDRI(docs) {
        let vm = this
        docs.forEach(function (val, index) {
          vm.itemsDRI.push({
            'id': val.key,
            'Name': val.doc.nut_group,
            'En': val.doc.energy,
            'Pr': val.doc.protein,
            'Va': val.doc.vita,
            'Fe': val.doc.fe,
            'number': 0
          })
        })
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
    },
  }
</script>
