<template>
  <b-container>
    halo:{{$store.state.user}}
    <b-button @click="test1">test1</b-button>
    <b-button @click="test2">test2</b-button>
  </b-container>
</template>

<script>
  import PouchDB from 'pouchdb'
  import {pouchGetDoc, pouchPutNewDoc} from "../plugins/pouchHelper";
  export default {
    data(){
      return {
        db:'',
      }
    },
    mounted() {
       this.db = new PouchDB('myTest')
    },
    methods:{
      async test1(){
        const res = await pouchGetDoc(this.db, 'baka').catch((err)=>err)
        if (res.error){
          console.log(res.message)
        } else {
          console.log(res)
        }
      },
      async test2(){
        const dat = {_id:'baka', name: 'aho'}
        const res = await pouchPutNewDoc(this.db, dat).catch((err)=>err)
        if (res.error){
          console.log(res.message)
        } else {
          console.log(res)
        }
      },
    }
  }
</script>
