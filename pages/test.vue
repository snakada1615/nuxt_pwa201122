<template>
  <b-container class="py-1">

    <b-button
      variant="info"
      size="sm"
      @click="testUpsert('testUp')"
    >test</b-button>
  </b-container>
</template>

<script>
  import PouchDB from 'pouchdb'

  export default {
    methods: {
      myDeltaFunction(doc) {
        doc.counter = doc.counter || 0;
        doc.counter++;
        return doc;
      },
      testUpsert(val) {
        let db = new PouchDB(val)
        db.upsert('my_id', this.myDeltaFunction).then(function () {
          // success!
          console.log('success')
        }).catch(function (err) {
          // error (not a 404 or 409)
          console.log(err)
        })
      },
    }
  }
</script>
