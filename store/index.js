import firebase from '~/plugins/firebase'
import PouchDB from 'pouchdb'
import {
  pouchPutNewDoc,
  pouchGetDoc,
  pouchPutNewOrUpdate,
  pouchWSPutNewOrUpdate,
  pouchDeleteDb,
  getPouchDataAll, makeToast, setDRI, syncRemoteDb, pouchDeleteDoc
} from "../plugins/pouchHelper";

export const state = () => ({
  packageVersion: process.env.PACKAGE_VERSION || '0',
  user: {
    name: '',
    email: '',
    country: '',
    subnational1: '',
    subnational2: '',
    subnational3: '',
    organization: '',
    title: '',
    uid: ''
  },
  fctData: {
    _id: '',
    dbName: '',
    description: '',
    creator: '',
    data: [],
  },

  dietCases: [],
  feasibilityCases: [],
  caseId: '',
  caseIdList: [],

  cloudantUrl: "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud/",

  loginStatus: 0,
  tabNumber: 10,
  lastUser: 'lastuser',
  isEdited: false,
  saveDate: '',
  /////////////////////
  // ********** database used in the program **********
  // fctDb: food composition table
  // fctListDb: list of fctDb
  // userDb: user working data
  // userInfoDb: list of user personal information (e.g. name, email, country, occupation, etc.)
  // loginDb: record of last user logged in
  /////////////////////
  fctDb: 'fct_org',
  driDb: 'dri',
  fctListDb: 'fctlist_db',
  userInfoDb: 'userlist',
  loginDb: 'logindb',
})

export const getters = {
  currentPouchID: (state) => {
    return state.user.uid + '_' + state.caseId
  },
  appVersion: (state) => {
    return state.packageVersion
  },
  userDb: (state) => {
    return 'userdata_' + state.user.uid.toLowerCase()
  }
}

export const mutations = {
  setCloudantUrl: function (state, payload) {
    state.cloudantUrl = payload
  },
  setLoginStatus: function (state, payload) {
    state.loginStatus = payload
  },
  setFctDb: function (state, payload) {
    state.fctDb = payload
  },
  setCaseId: function (state, payload) {
    state.caseId = payload
  },
  setCaseIdList: function (state, payload) {
    if (payload) {
      state.caseIdList = JSON.parse(JSON.stringify(payload))
    } else {
      state.caseIdList = []
    }
  },
  addCaseIdList: function (state, payload) {
    state.caseIdList.push(payload)
  },
  setDietCases: function (state, payload) {
    state.dietCases = JSON.parse(JSON.stringify(payload))
  },
  setFeasibilityCases: function (state, payload) {
    state.feasibilityCases = JSON.parse(JSON.stringify(payload))
  },
  setUser: function (state, payload) {
    state.user = {...payload}
  },
  setOffUser: function (state) {
    state.user = {
      name: '',
      email: '',
      country: '',
      subnational1: '',
      subnational2: '',
      subnational3: '',
      organization: '',
      title: '',
      uid: ''
    }
  },
  setLoginUnChecked: function (state) {
    state.isLoginChecked = false
  },
  setEdit: function (state, payload) {
    state.isEdited = payload
  },
  setNow: function (state) {
    const today = new Date()
    state.saveDate = today.getFullYear() + '/' + today.getMonth() + 1 + '/' + today.getDate()
      + '-' + ('00' + today.getHours()).slice(-2) + ':' + ('00' + today.getMinutes()).slice(-2)
  }
}

export const actions = {
  autoLogin({dispatch, getters}) {
    let promise = new Promise(async (resolve, reject) => {
      try {
        const res = await dispatch('loadUserFromPouch')
        dispatch('setCaseIdList', await dispatch('getListWorkspace', getters.userDb))
        // activate following line (loadCouchUrl) only in case of Rwanda version
        // await dispatch('loadCouchUrl')
        dispatch('setLoginStatus', res)
      } catch (err) {
        if (err.docId === "myCouch"){
          reject(new Error('initRwanda'))
        }
        reject(err)
      }
    })
    return promise
  },
  login({dispatch, state}, userInfo) {
    let promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(res => {
          resolve(res.user)
        })
        .catch((error) => {
          alert('login failed')
          console.log(error)
          reject(error)
        })
    })
    return promise
  },
  logout({dispatch, state}) {
    let promise = new Promise((resolve, reject) => {
      firebase.auth().signOut().then(async function () {
        // Sign-out successful.
        dispatch('setOffUser')
        dispatch('setCaseId', '')
        await dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId}).then(function () {
          console.log('firebase:successfully sign out')
        })
        // set loginStatus to 0
        dispatch('setLoginStatus', 0)
        resolve('sucecssfully logout')
      }).catch(function (error) {
        // An error happened.
        console.log('firebase:sign out failed')
        console.log(error)
        reject('logout failed')
      });
    })
    return promise
  },
  loginProvider(state, flag) {
    let provider = null
    console.log(flag)
    switch (flag) {
      case 1:
        provider = new firebase.auth.GoogleAuthProvider()
        break
      case 2:
        provider = new firebase.auth.TwitterAuthProvider()
        break
      case 3:
        provider = new firebase.auth.FacebookAuthProvider()
        break
      default:
        return false
    }
    let promise = new Promise((resolve, reject) => {
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;

          resolve(user)
        }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        reject(error)
      });
    })
    return promise
  },
  removeUserDoc({state},payload) {
    let promise = new Promise(async (resolve, reject) => {
      const db = new PouchDB(payload.dbName)
      await pouchDeleteDoc(db, payload.docId)
      await syncRemoteDb({dbName: payload.dbName, url: payload.url})

      await pouchDeleteDb(state.lastUser)
      resolve(true)
    }).catch(err => reject(err))
    return promise
  },
  saveUseToUserSet({state, dispatch}, payload) {
    let promise = new Promise(async (resolve, reject) => {
      // fetch remoeteDb if localDb is not available
      await dispatch('syncIfNoDb', state.userInfoDb).catch(err => {reject(err)})

      //save all user-> pouchDB(lastUser)
      let db = new PouchDB(state.userInfoDb)
      const res = await pouchPutNewOrUpdate(db, payload)
      res ? resolve(res) : reject(res)
    })
    return promise
  },
  saveUserToLastuser({state, dispatch, getters}, payload) {
    let promise = new Promise(async (resolve, reject) => {

      //save from store.user -> pouchDB(lastUser)
      let db = new PouchDB(state.loginDb)
      const userTemp = {}
      userTemp._id = state.lastUser
      userTemp.user = payload.user
      userTemp.caseId = payload.caseId
      dispatch('setNow')
      userTemp.saveDate = state.saveDate
      const res = await pouchPutNewOrUpdate(db, userTemp)
      res ? resolve(res) : reject(res)
    })
    return promise
  },
  async initPouch({state, dispatch, getters}, payload) {
    function initDiet(id, iCount) {
      let dat = []
      for (let index = 0; index < iCount; index++) {
        dat.push({
          'foodItems': [],
          'target': [{id:0, count:1}],
          'maxPop': 1000,
          'targetSwitch':true,
          'targetName': '',
          '_id': id,
          'pageId': index
        })
      }
      return dat
    }

    function initFeasibilityCase(id, iCount) {
      let dat = []
      for (let index = 0; index < iCount; index++) {
        dat.push({
          'target': [{id:0, count:1}],
          'selectedItem': {},
          'ansList': [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99],
        })
      }
      return dat
    }

    console.log('initialize workspace data')
    // initialize user to store
    dispatch('setUser', payload.user)
    dispatch('setCaseId', payload.caseId)

    //set time stump
    dispatch('setNow')

    // initialize and set caseId to PouchDB
    let WS = {}
    const iCount = state.tabNumber
    const id = getters.currentPouchID

    WS.dietCases = initDiet(id, iCount)
    WS.feasibilityCases = initFeasibilityCase(id, iCount)
    WS.saveDate = state.saveDate
    WS.user = {...payload.user}
    WS.caseId = payload.caseId
    WS._id = id
    WS.fctDb = payload.fctDb

    // set dietCases to $store
    dispatch('setDietCases', WS.dietCases)

    // set feasibilityCases to $store
    dispatch('setFeasibilityCases', WS.feasibilityCases)

    // set workSpace to pouchDb
    let db = new PouchDB(getters.userDb)
    const res = await pouchPutNewOrUpdate(db, WS).catch((err) => reject(err))

    // set workSpace to cloudant
    await syncRemoteDb({dbName: getters.userDb, url: state.cloudantUrl})
    //await syncCloudant(getters.userDb)
    console.log('data initialized')
    console.log(res)
    return res
  },
  //
  // fetch db if no localDb exists
  syncIfNoDb({state}, payload) {
    let promise = new Promise(async (resolve, reject) => {
      let db = new PouchDB(payload)
      db.info()
        .then(function (info) {
          if (!(info.doc_count)) {
            console.log('your dataset is currently empty. the application will try to fetch data from server!')
            syncRemoteDb({dbName: payload, url: state.cloudantUrl})
              .then(dataset => {
                resolve(true)
              })
          } else {
            resolve(false)
          }
        })
        .catch(function (err) {
          console.log(err)
          reject(err)
        })
    })
    return promise
  },
  // get user information from userInfoDb
  loadUserPersonalInfo({state, dispatch}, payload) {
    let promise = new Promise(async (resolve, reject) => {
      // fetch remoeteDb if localDb is not available
      await dispatch('syncIfNoDb', state.userInfoDb)

      //save all user-> pouchDB(lastUser)
      let db = new PouchDB(state.userInfoDb)
      const res = await pouchGetDoc(db, payload).catch(function (err) {
        reject(err)
      })
      resolve(res)
    })
    return promise
  },
  loadUserFromPouch({state, dispatch, getters}) {
    let result = 0
    let res1 = 1
    let res2 = 1
    let db = new PouchDB(state.loginDb)
    let promise = new Promise((resolve) => {
      pouchGetDoc(db, state.lastUser).then(async function (docTemp) {
        const userTmp = docTemp.user
        const caseIdTmp = docTemp.caseId

        userTmp ? dispatch('setUser', userTmp) : res1 = 0
        caseIdTmp ? dispatch('setCaseId', caseIdTmp) : res2 = 0
        if (res1 && res2) {
          // get user workspace from PouchDb-userDb
          const userData = await dispatch('loadUserDataFromPouch', {
            dbName: getters.userDb,
            dataId: getters.currentPouchID
          })
          // set user workspace to store
          dispatch('setFeasibilityCases', userData.feasibilityCases)
          dispatch('setDietCases', userData.dietCases)
          dispatch('setFctDb', userData.fctDb)
          result = 1
        } else if (!res1) {
          result = 2
        } else if (!res2) {
          result = 3
        } else {
          result = 4
        }
        resolve(result)
      }).catch((err) => {
        // if no record
        console.log(err)
        console.log('no user info set on lastuser')
        resolve(0)
      })
    })
    return promise
  },
  /**
   * load list of Diet from PouchDB
   * @returns {Promise<unknown>}
   */
  async loadUserDataFromPouch({getters, dispatch}, payload) {
    // fetch remoteDb if localDb is not available
    await dispatch('syncIfNoDb', payload.dbName)

    let db = new PouchDB(payload.dbName)
    let currentDiet = {}
    let promise = new Promise((resolve) => {
      pouchGetDoc(db, payload.dataId).then(function (doc) {
        resolve(doc)
      }).catch(function (err) {
        console.log('no data exists in PouchDB')
        resolve(err)
      })
    })
    return promise
  },
  getFctInfo({state}) {
    let promise = new Promise(async (resolve, reject) => {
      console.log(state.fctDb)
      const fct = new PouchDB(state.fctDb)
      const res = await pouchGetDoc(fct, 'fct_info').catch(function (err) {
        reject(err)
      })
      resolve(res)
    })
    return promise
  },
  getDriInfo({state}) {
    let promise = new Promise(async (resolve, reject) => {
      const dri = new PouchDB(state.driDb)
      const res = await pouchGetDoc(dri, 'dri_info').catch(function (err) {
        reject(err)
      })
      resolve(res)
    })
    return promise
  },
  loadFctFromPouch({state}, payload) {
    const fct = new PouchDB(payload.dbName);
    let res = []
    let promise = new Promise((resolve, reject) => {
      try {
        fct.info().then(async function (info) {
          if (!(info.doc_count)) {
            console.log('your dataset is currently empty. the application will try to getch data from server!')
            const dataset = await syncRemoteDb({dbName: payload.dbName, url: payload.url})
            const docs = await getPouchDataAll(dataset)
            res = docs.filter(function (val) {
              //remove one record from db (db metadata)
              return val._id !== payload.dbName
            })
            resolve(res)
          } else {
            const docs = await getPouchDataAll(fct)
            res = docs.filter(function (val) {
              //remove one record from db (db metadata)
              return val._id !== payload.dbName
            })
            resolve(res)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
    return promise
  },
  loadDriFromPouch({state}, payload) {
    const dri = new PouchDB(payload.dbName);
    let res = []
    let promise = new Promise((resolve) => {
      dri.info().then(function (info) {
        if (!(info.doc_count)) {
          console.log('your dataset is currently empty. the application will try to getch data from server!')
          console.log(dri)
          syncRemoteDb({dbName:payload.dbName, url: payload.url}).then(dataset => {
            getPouchDataAll(dataset).then(docs => {
              res = setDRI(docs)
              resolve(res)
            })
          })
        } else {
          getPouchDataAll(dri).then(docs => {
            res = setDRI(docs)
            resolve(res)
          })
        }
      }).catch(err => {
        reject(err)
      })
    })
    return promise
  },
  /**
   * save list of diet to PouchDB
   * @param {Objects[]} record - array of diet dataset (WS[1..10])
   * @returns {Promise<unknown>}
   */
  async saveDietToPouch({state, getters, dispatch}, record) {
    console.log('saveDietToPouch')

    // fetch remoeteDb if localDb is not available
    await dispatch('syncIfNoDb', getters.userDb)

    const db = new PouchDB(getters.userDb)
    dispatch('setNow')
    record.saveDate = state.saveDate
    record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await pouchWSPutNewOrUpdate(db, record, 'diet')
      if (res) {
        // sync localDb with remoteDb
        await syncRemoteDb({dbName: getters.userDb, url: state.cloudantUrl})
        //await syncCloudant(getters.userDb)

        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  async saveFeasibilityToPouch({state, getters, dispatch}, record) {
    console.log('saveFeasibilityToPouch')

    // fetch remoeteDb if localDb is not available
    await dispatch('syncIfNoDb', getters.userDb)

    const db = new PouchDB(getters.userDb)
    dispatch('setNow')
    record.saveDate = state.saveDate
    record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await pouchWSPutNewOrUpdate(db, record, 'feasibility')
      if (res) {
        // sync localDb with remoteDb
        await syncRemoteDb({dbName: getters.userDb, url: state.cloudantUrl})
        //await syncCloudant(getters.userDb)

        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  async saveFctToPouch_bulk({state, getters, dispatch}, payload) {
    console.log('saveFeasibilityToPouch')
    const dbName = 'fct_' + payload.dbName

    // fetch remoeteDb if localDb is not available
    await dispatch('syncIfNoDb', dbName)

    const db = new PouchDB(dbName)
    dispatch('setNow')
    payload.saveDate = state.saveDate
    //record._id = getters.currentPouchID
    let promise = new Promise(async (resolve, reject) => {
      try {
        const res1 = await db.bulkDocs(payload.data)
        const res2 = await pouchPutNewOrUpdate(db, {
          _id: 'fct_info',
          dbId: dbName,
          dbName: payload._id,
          description: payload.description,
          creator: payload.creator,
          saveDate: payload.saveDate
        })
        if (res1 && res2) {
          // sync localDb with remoteDb
          await syncRemoteDb({dbName: dbName, url: state.cloudantUrl})
          //await syncCloudant(dbName)

          //register new FCT to dbFctList
          const dbFctList = new PouchDB(state.cloudantUrl + state.fctListDb)
          await pouchPutNewDoc(dbFctList, {
            _id: dbName,
            dbId: dbName,
            dbName: payload._id,
            description: payload.description,
            creator: payload.creator,
            saveDate: payload.saveDate
          })
          resolve(db)
        } else {
          reject(false)
        }
      } catch (err) {
        reject(err)
      }
    })
    return promise
  },
  async saveFctToPouch_replace({state, getters, dispatch}, payload) {
    console.log('saveFctToPouch_replace')
    const dbName = 'fct_' + payload.dbName

    // fetch remoeteDb if localDb is not available
    await dispatch('syncIfNoDb', dbName)

    console.log('saveFctToPouch_replace02')
    let db = new PouchDB(dbName)

    dispatch('setNow')
    payload.saveDate = state.saveDate
    //record._id = getters.currentPouchID
    let promise = new Promise(async (resolve, reject) => {
      try {
        console.log('saveFctToPouch_replace03')
        const res1 = await db.bulkDocs(payload.data)
        console.log('saveFctToPouch_replace04')
        const res2 = await pouchPutNewOrUpdate(db, {
          _id: 'fct_info',
          dbId: dbName,
          dbName: payload._id,
          description: payload.description,
          creator: payload.creator,
          saveDate: payload.saveDate
        })
        console.log('saveFctToPouch_replace05')
        if (res1 && res2) {
          // sync localDb with remoteDb
          await syncRemoteDb({dbName: dbName, url: state.cloudantUrl})
          //await syncCloudant(dbName)

          //register new FCT to dbFctList
          const dbFctList = new PouchDB(state.cloudantUrl + state.fctListDb)
          await pouchPutNewDoc(dbFctList, {
            _id: dbName,
            dbId: dbName,
            dbName: payload._id,
            description: payload.description,
            creator: payload.creator,
            saveDate: payload.saveDate
          })
          resolve(db)
        } else {
          reject(new Error('update failed or sync failed for ' + dbName))
        }
      } catch (err) {
        reject(err)
      }
    })
    return promise
  },
  async getFctList({state}) {
    let promise = new Promise(async (resolve, reject) => {
      const db = new PouchDB(state.cloudantUrl + state.fctListDb)
      db.allDocs({include_docs: true}).then(function (docs) {
        resolve(docs)
      }).catch(function (err) {
        console.log('error in getFctList')
        reject(err)
      })
    })
    return promise
  },
  getListWorkspace({getters, state, dispatch}, payload) {
    let promise = new Promise(async (resolve, reject) => {
      if (!payload) {
        reject('no workSpace is set:getListWorkspace')
      } else {

        // fetch remoteDb if localDb is not available
        await dispatch('syncIfNoDb', payload).catch(err => {reject(err)})

        const db = new PouchDB(payload)
        db.allDocs({include_docs: true}).then(function (docs) {
          let res = []
          docs.rows.forEach(function (value) {
            if (value.id !== state.lastUser) {
              if (value.doc.caseId) {
                res.push({
                  email: value.doc.user.email,
                  uid: value.doc.user.uid,
                  caseId: value.doc.caseId,
                  saveDate: value.doc.saveDate
                })
              }
            }
          })
          resolve(res)
        }).catch(function (err) {
          console.log(err)
          reject(err)
        })
      }
    })
    return promise
  },
  async registUserEmial({context, dispatch}, userInfo) {
    let promise = new Promise(function (resolve, reject) {
      firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(
          // if success
          function (res) {
            resolve(res)
          },
          //if failure
          function (err) {
            console.log('registration failed')
            console.log(err)
            //context.commit('setOffUser')
            reject(err)
          })
        .catch(function (err) {
          console.log(err)
          reject(err)
        })
    })
    return promise
  },
  setNow(context) {
    context.commit('setNow')
  },
  setLoginStatus(context, payload) {
    context.commit('setLoginStatus', payload)
  },
  setUser(context, payload) {
    context.commit('setUser', payload)
  },
  setOffUser(context) {
    context.commit('setOffUser')
  },
  setFctDb: function (context, payload) {
    context.commit('setFctDb', payload)
  },
  setCaseId: function (context, payload) {
    context.commit('setCaseId', payload)
  },
  setCaseIdList: function (context, payload) {
    context.commit('setCaseIdList', payload)
  },
  setDietCases(context, payload) {
    context.commit('setDietCases', payload)
  },
  setFeasibilityCases(context, payload) {
    context.commit('setFeasibilityCases', payload)
  },
  addCaseIdList: function (context, payload) {
    context.commit('addCaseIdList', payload)
  },
  setEdit: function (context, payload) {
    context.commit('setEdit', payload)
  },
  // "loadCouchUrl" is used only for Rwanda version
  // which use couchDb installed on MINAGRI server instead of IBM cloudant
  loadCouchUrl: function (context) {
    const dbName = 'couch_info'
    const myId = 'myCouch'
    let url = ''
    const promise = new Promise(async (resolve, reject) => {
      const db = new PouchDB(dbName)
      pouchGetDoc(db, myId).then(function (doc) {
        url = "http://" + doc.user + ":" + doc.pass + "@" + doc.ip + ":5984/"
        //replace cloudant Url by CouchDb URL
        context.commit('setCloudantUrl', url)
        resolve(doc)
      }).catch(function (err) {
        reject(err)
      })
    })
    return promise
  },
  //"saveCouchUrl" is used only for Rwanda version
  // which use couchDb installed on MINAGRI server instead of IBM cloudant
  replicateBaseData: function({state}, payload){
    // fetch key databases from cloudant
    const dbSet = ['userlist', 'dri', 'fct_org', 'fctlist_db']
    const promise = new Promise( (resolve, reject) => {
      try {
        const url = "http://" + payload.user + ":" + payload.pass + "@" + payload.ip + ":5984/"
        let localDatabases = []
        let remoteDatabases = []
        dbSet.forEach(async function (item,index) {
          localDatabases[index] = new PouchDB(url + item)
          remoteDatabases[index] = new PouchDB(state.cloudantUrl + item)
          //copy FCT database from cloudant
          await localDatabases[index].sync(remoteDatabases[index])
        })
        resolve('all database replicated')
      } catch (err) {
        reject(err)
      }
    })
    return promise
  },
  saveCouchUrl: function (context, payload) {
    const dbName = 'couch_info'
    const promise = new Promise(async (resolve, reject) => {
      const db = new PouchDB(dbName)
      pouchPutNewOrUpdate(db, {
        _id: 'myCouch',
        user: payload.user,
        pass: payload.pass,
        ip: payload.ip
      }).then(() => {
        resolve('db info saved successfully')
      }).catch((err) => {
        reject(err)
      })
    })
    return promise
  },
  async DBexists(context, dbname) {
    var req = indexedDB.open(dbname);
    var existed = true;
    req.onsuccess = function () {
      req.result.close();
      if (!existed)
        indexedDB.deleteDatabase(dbname);
    }
    req.onupgradeneeded = function () {
      existed = false;
    }
    return existed
  },
}
