<template>
  <b-container>
    <ul>
      <li v-for="obj in myObject">{{obj}}</li>
    </ul>
    <b-button @click="sortMe" variant="primary">push</b-button>
  </b-container>
</template>


<script>
  import {objectSort} from "@/plugins/helper";

  export default {
    data() {
      return {
        myObject: [
          {pageId: 1, first: 'yuto', last: 'nakada'},
          {pageId: 9, first: 'shunichi', last: 'nakada'},
          {pageId: 5, first: 'mari', last: 'nakada'},
          {pageId: 2, first: 'moe', last: 'nakada'}
        ]
      }
    },
    methods:{
      sortMe(){
        objectSort(this.myObject, 'pageId')
      }
    }
  }

</script>
