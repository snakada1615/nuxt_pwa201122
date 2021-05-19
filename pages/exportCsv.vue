<template>
  <b-container>
    <b-form-select
      v-model="selected"
      :options="items"
      class="my-2"
    ></b-form-select>
    <b-form-input
      v-model="fileName"
      size="sm"
      class="my-2"
    ></b-form-input>
    <b-button
      class="my-2"
      variant="info"
      size="sm"
      @click="clickOk(selected)"
    >test</b-button>
  </b-container>
</template>

<script>
  import exportCSVFile from "@/plugins/exportCSV";
  import {getPouchDataAll} from "@/plugins/pouchHelper";
  import PouchDB from "pouchdb";

  export default {
    data() {
      return {
        items: ['dri', 'fct_org'],
        selected: null,
        headers: { name: 'Name', age: 'Age' },
        fileName: 'somefileName'
      }
    },
    components: {
      exportCSVFile,
      getPouchDataAll,
    },
    methods: {
      clickOk(val){
        const dat = new PouchDB(val)
        getPouchDataAll(dat).then(res =>{
          const myhead = Object.keys(res[0].doc).map(item=>{
            return item
          })
          const res2 = res.map((val, index)=>{
            return val.doc
          })
          exportCSVFile(myhead, res2, this.fileName + '.csv')
        })
      }
    }
  }
</script>
