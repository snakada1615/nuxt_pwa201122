<template>
  <h4>this is for importing NFA static data</h4>
</template>

<script>
// const PouchDB = require('pouchdb')
import PouchDB from 'pouchdb'
export default {
  name: 'PoucnImportNfa',
}
const dbs = ['fct', 'dri', 'pop', 'crop_national', 'crop_name']

// Replicating a local database to Remote
dbs.map(function (value, index, array) {
  const localdb = new PouchDB('../assets/dbs/' + value)
  const remotedb = new PouchDB(
    'http://snakada:Bluecity1965@localhost:5984/' + value
  )
  localdb
    .sync(remotedb)
    .on('complete', function () {
      console.log(value + ': synced')
    })
    .on('error', function (err) {
      console.log(err)
    })
})
</script>

<style scoped></style>
