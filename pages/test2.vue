<template>
  <b-container>
    halo music:
    <dri-table
      @changeTarget="onChangeTarget"
      :selected="driID"
      :items="itemsDRI"
      :showTable=false
      head-row-variant="success"
      table-variant="light"
    />
  </b-container>
</template>

<script>
  import driTable from "~/components/organisms/driTable";
  import PouchDB from "pouchdb";
  import {getPouchData, syncCloudant} from '~/plugins/pouchHelper'
  export default {
    components:{
      driTable,
    },
    data(){
      return{
        driID: '',
        itemsDRI: [],
      }
    },
    mounted() {
      const dri = new PouchDB('dri');
      const vm = this;
      this.makeToast('start fetching')
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
      onChangeTarget(value){
        console.log(value)
      },
      setFTC(docs) {
        let vm = this
        docs.forEach(function (val, index) {
          vm.items.push({
            'id': val.doc.food_item_id,
            'Group': val.doc.food_group_unicef,
            'Name': val.doc.Food_name,
            'En': val.doc.Energy,
            'Pr': val.doc.Protein,
            'Va': val.doc.VITA_RAE,
            'Fe': val.doc.FE
          })
        })
      },
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
    },
  }
</script>

