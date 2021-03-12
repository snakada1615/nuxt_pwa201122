import PouchDB from "pouchdb";

export function makeToast(mes) {
  const id = String(Math.floor(100 * Math.random()))
  this.$bvToast.toast(mes, {
    autoHideDelay: 5000,
    variant: "info",
    noCloseButton: true,
    id: id,
  })
  return id
}

export function pouchGetDb(dbName) {
  return new PouchDB(dbName)
}

export function pouchGetDoc(db, id){
  let promise = new Promise((resolve, reject) => {
    db.get(id).then(function (doc) {
      resolve(doc)
    }).catch(function (err) {
      reject(err)
    })
  })
  return promise
}
export function pouchUpdateDoc(db, id, newDoc){
  let promise = new Promise((resolve, reject) => {
    db.get(id).then(function (doc) {
      newDoc._rev = doc._rev
      db.put(newDoc).then(function () {
        resolve(true)
      })
    }).catch(function (err) {
      reject(err)
    })
  })
  return promise
}

export function pouchPutNewDoc(db, newDoc){
  let promise = new Promise((resolve) => {
    db.put(newDoc).then(function () {
        resolve(true)
    }).catch(function (err) {
      console.log(err)
      console.log(newDoc)
      resolve(false)
    })
  })
  return promise
}

export function pouchPutNewOrUpdate(db, doc){
  let promise = new Promise( (resolve) => {
    if (!doc._id){
      console.log('_id is missing')
      resolve(false)
    } else {
      db.get(doc._id).then(function (currentDoc) {
        doc._rev = currentDoc._rev
        pouchUpdateDoc(db, doc._id, doc).then(function (res) {
          resolve(res)
        })
      }).catch(function(err){
        console.log(err)
        pouchPutNewDoc(db, doc).then(function (res) {
          resolve(res)
        })
      })
    }
  })
  return promise
}

export async function getPouchData(dataset) {
  const vm = this;
  let res = []
  let promise = new Promise((resolve, reject) => {
    dataset.allDocs({include_docs: true})
      .then(function (docs) {
        resolve(docs.rows)
      })
      .catch(function (err) {
        console.log(err)
        reject(err)
      })
  })
  return await promise
}

export async function syncCloudant(value) {
  const vm = this;
  let sync_count = 0;
  let url = "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud"
  // Replicating a local database to Remote
  let promise = new Promise((resolve, reject) => {
    const localdb = new PouchDB(value)
    const remotedb = new PouchDB(url + '/' + value)
    localdb
      .sync(remotedb)
      .on('complete', function () {
        resolve(localdb)
      })
      .on('error', function (err) {
        console.log(err)
        reject(err)
      })
  })
  let output = await promise
  return output
}
