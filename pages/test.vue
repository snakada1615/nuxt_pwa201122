<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-card>
      test
      <b-button @click="test">btn</b-button>
    </b-card>
  </b-container>
</template>

<script>
  import PouchDB from "pouchdb";

  export default {
    data(){
      return{
      }
    },
    methods:{
      test() {
        let db = new PouchDB(this.$store.state.driDb)
        db.sync(this.$store.state.cloudantUrl + "dri_eth").on('complete', function () {
          console.log("done")
        }).on('error', function (err) {
          console.log(err)
        });
      }
    }
  }
</script>
