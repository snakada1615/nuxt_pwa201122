<template>
  <b-container class="py-1">
    <b-button
      @click="clickOk"
      variant="info"
      size="sm"
    >
    test</b-button>
    <b-button
      @click="add('test')"
      variant="info"
      size="sm"
    >
    add</b-button>
    <b-button
      @click="update({myDoc:'test'})"
      variant="info"
      size="sm"
    >
    update</b-button>
  </b-container>
</template>

<script>
  import {pouchPutNewOrUpdate} from "@/plugins/pouchHelper"
  import PouchDB from 'pouchdb'

  export default {
    methods:{
      clickOk(){
        $nuxt.error({ statusCode: 400, message: 'Teub' })
      },
      add(val){
        let db = new PouchDB('test')
        db.put({
          _id: val,
          myDoc: val
        })
      },
      update(val){
        let db = new PouchDB('test')
        pouchPutNewOrUpdate(db, {
          '_id': val._id + 'new',
          'myDoc': val.myDoc + '_revised'
        }).catch(err =>{
          console.log(err)
          $nuxt.error(err)
        })
      }
    }
  };
</script>
