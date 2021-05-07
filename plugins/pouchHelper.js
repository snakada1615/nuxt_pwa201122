import PouchDB from "pouchdb"
PouchDB.plugin(require('pouchdb-upsert'))

export function makeToast(vm, mes) {
  const id = String(Math.floor(100 * Math.random()))
  vm.$bvToast.toast(mes, {
    autoHideDelay: 5000,
    variant: "info",
    noCloseButton: true,
    id: id,
  })
  return id
}

export function pouchDeleteDb(dbName) {
  let promise = new Promise((resolve, reject) => {
    new PouchDB(dbName).destroy().then(function () {
      console.log(dbName + ' successfully deleted')
      resolve(true)
    }).catch(function (err) {
      console.log(dbName + ' failed to deleted')
      reject(err)
    })
  })
  return promise
}
export function pouchDeleteDoc(db, docId) {
  let promise = new Promise((resolve, reject) => {
    db.get(docId).then(function (doc) {
      resolve(db.remove(doc))
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function pouchGetDoc(db, id) {
  let promise = new Promise((resolve, reject) => {
    db.get(id).then(function (doc) {
      resolve(doc)
    }).catch(function (err) {
      reject(err)
    })
  })
  return promise
}

export function pouchUpdateDoc(db, id, newDoc) {
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

export function pouchPutNewDoc(db, newDoc) {
  let promise = new Promise((resolve, reject) => {
    db.put(newDoc).then(function () {
      resolve(true)
    }).catch(function (err) {
      reject(err)
    })
  })
  return promise
}

export function pouchPutNewOrUpdate(db, doc) {
  let promise = new Promise((resolve, reject) => {
    if (!doc._id) {
      console.log('_id is missing')
      reject(new Error('_id is missing: pouchPutNewOrUpdate'))
    } else {
      db.get(doc._id).then(function (currentDoc) {
        doc._rev = currentDoc._rev
        pouchUpdateDoc(db, doc._id, doc).then(function (res) {
          resolve(res)
        })
      }).catch(function (err) {
        if (err.name === 'not_found') {
          pouchPutNewDoc(db, doc).then(function (res) {
            resolve(res)
          })
        } else {
          console.log(err)
          reject(err)
        }
      })
    }
  })
  return promise
}

export async function getPouchDataAll(dataset) {
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
  return promise
}
export async function replicateDb(sourceDb, destinationDb) {
  let promise = new Promise((resolve, reject) => {
    const source = new PouchDB(sourceDb)
    const destination = new PouchDB(destinationDb)
    source.allDocs({revs: true}, function (docs) {
      destination.bulkDocs([doc], {new_edits: false}).then(res => {
        resolve(res)
      })
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export async function syncRemoteDb(value) {
  const vm = this;

  // Replicating a local database to Remote
  console.log('syncCouch in progress...')
  console.log(value)
  let promise = new Promise((resolve, reject) => {
    const localdb = new PouchDB(value.dbName)
    const remotedb = new PouchDB(value.url + '/' + value.dbName)
    localdb
      .sync(remotedb, {retry: true})
      .on('complete', function () {
        console.log('syncCouch Complete')
        resolve(localdb)
      })
      .on('error', function (err) {
        console.log('syncCouch failed')
        console.log(err)
        reject(err)
      })
  })
  return promise
}

export function setDRI(docs) {
  let itemsDRI = []
  docs.forEach(function (val, index) {
    itemsDRI.push({
      'id': val.key,
      'Name': val.doc.nut_group,
      'En': val.doc.energy,
      'Pr': val.doc.protein,
      'Va': val.doc.vita,
      'Fe': val.doc.fe,
      'number': 0
    })
  })
  return itemsDRI
}

export function pouchWSPutNewOrUpdate(db, doc, WStype) {
  let promise = new Promise((resolve, reject) => {
    if (!doc._id) {
      console.log('_id is missing')
      reject(new Error('_id is missing: pouchWSPutNewOrUpdate'))
    } else {
      db.get(doc._id).then(function (currentDoc) {
        currentDoc.caseId = doc.caseId
        if (WStype === 'diet') {
          currentDoc.dietCases = doc.dietCases
        } else if (WStype === 'feasibility') {
          currentDoc.feasibilityCases = doc.feasibilityCases
        } else {
          console.log('error: WStype option is wrong in pouchWSPutNewOrUpdate')
        }
        currentDoc.user = doc.user
        currentDoc.saveDate = doc.saveDate
        pouchUpdateDoc(db, doc._id, currentDoc).then(function (res) {
          resolve(res)
        })
      }).catch(function (err) {
        console.log(err)
        if (err.name === 'not_found') {
          pouchPutNewDoc(db, doc).then(function (res) {
            resolve(res)
          })
        } else {
          reject(err)
        }
      })
    }
  })
  return promise
}

