import firebase from '~/plugins/firebase'
import PouchDB from 'pouchdb'
import {
  pouchPutNewDoc,
  pouchGetDoc,
  pouchUpdateDoc,
  pouchPutNewOrUpdate,
  pouchWSPutNewOrUpdate,
  pouchDeleteDb,
  syncCloudant,
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
  dietCases: [],
  feasibilityCases: [],
  caseId: '',
  caseIdList: [],

  loginStatus: 0,
  tabNumber: 10,
  fctDb: 'fct',
  fctListDb: 'fctListDb',
  userInfoDb: 'userlist',
  loginDb: 'logindb',
  lastUser: 'lastuser',
  isEdited: false,
  saveDate: '',
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
  },
}

export const mutations = {
  setLoginStatus: function (state, payload) {
    state.loginStatus = payload
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
  async autoLogin({dispatch, getters}) {
    const res = await dispatch('loadUserFromPouch')
    dispatch('setCaseIdList', await dispatch('getListWorkspace', getters.userDb))
    dispatch('setLoginStatus', res)
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
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      dispatch('setOffUser')
      dispatch('setCaseId', '')
      dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId}).then(function () {
        console.log('firebase:successfully sign out')
      })
      // set loginStatus to 0
      dispatch('setLoginStatus', 0)
      return true
    }).catch(function (error) {
      // An error happened.
      console.log('firebase:sign out failed')
      console.log(error)
      return false
    });
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
  removeUserDb({getters}) {
    pouchDeleteDb(getters.userDb)
  },
  saveUseToUserSet({state}, payload) {
    let promise = new Promise(async (resolve, reject) => {
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
          'targetName': '',
          'driID': '0',
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
          'driID': "0",
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

    // set dietCases to $store
    dispatch('setDietCases', WS.dietCases)

    // set feasibilityCases to $store
    dispatch('setFeasibilityCases', WS.feasibilityCases)

    // set workSpace to pouchDb
    let db = new PouchDB(getters.userDb)
    const res = await pouchPutNewOrUpdate(db, WS).catch((err) => reject(err))

    // set workSpace to cloudant
    await syncCloudant(getters.userDb)
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
            syncCloudant(payload).then(dataset => {
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
          const userData = await dispatch('loadUserDataFromPouch',{
            dbName: getters.userDb,
            dataId: getters.currentPouchID
          })
          // set user workspace to store
          dispatch('setFeasibilityCases', userData.feasibilityCases)
          dispatch('setDietCases', userData.dietCases)
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
        result = 0
        resolve(result)
      })
    })
    return promise
  },
  /**
   * load list of Diet from PouchDB
   * @returns {Promise<unknown>}
   */
  async loadUserDataFromPouch({getters, dispatch}, payload) {
    // fetch remoeteDb if localDb is not available
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
  /**
   * load list of Diet from PouchDB
   * @returns {Promise<unknown>}
   */
  async loadDietfromPouch({getters}) {
    // fetch remoeteDb if localDb is not available
    await dispatch('syncIfNoDb', getters.userDb)

    let db = new PouchDB(getters.userDb)
    let currentDiet = {}
    let promise = new Promise((resolve) => {
      pouchGetDoc(db, getters.currentPouchID).then(function (doc) {
        currentDiet = doc.dietCases
        resolve(currentDiet)
      }).catch(function (err) {
        console.log('no data exists in PouchDB')
        resolve(err)
      })
    })
    return promise
  },
  /**
   * save list of diet to PouchDB
   * @param {Objects[]} record - array of diet dataset (WS[1..10])
   * @returns {Promise<unknown>}
   */
  saveDietToPouch({state, getters, dispatch}, record) {
    console.log('saveDietToPouch')
    console.log(record)
    const db = new PouchDB(getters.userDb)
    dispatch('setNow')
    record.saveDate = state.saveDate
    record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await pouchWSPutNewOrUpdate(db, record, 'diet')
      if (res) {
        // sync localDb with remoteDb
        await syncCloudant(getters.userDb)

        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  async loadFeasibilityCasefromPouch({state, getters}) {
    // fetch remoeteDb if localDb is not available
    await dispatch('syncIfNoDb', getters.userDb)

    let db = new PouchDB(getters.userDb)
    let currentFeasibilityCases = {}
    let promise = new Promise((resolve) => {
      pouchGetDoc(db, getters.currentPouchID).then(function (doc) {
        currentFeasibilityCases = doc.feasibilityCases
        resolve(currentFeasibilityCases)
      }).catch(function (err) {
        console.log('no data exists in PouchDB')
        resolve(err)
      })
    })
    return promise
  },
  saveFeasibilityToPouch({state, getters, dispatch}, record) {
    console.log('saveFeasibilityToPouch')
    const db = new PouchDB(getters.userDb)
    dispatch('setNow')
    record.saveDate = state.saveDate
    record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await pouchWSPutNewOrUpdate(db, record, 'feasibility')
      if (res) {
        // sync localDb with remoteDb
        await syncCloudant(getters.userDb)

        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  saveFctToPouch({state, getters, dispatch}, payload) {
    console.log('saveFeasibilityToPouch')
    const db = new PouchDB(payload.name)
    dispatch('setNow')
    payload.saveDate = state.saveDate
    //record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await db.bulkDocs(payload.data)
      if (res) {
        // sync localDb with remoteDb
        await syncCloudant(getters.userDb)

        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  getListWorkspace({getters, state, dispatch}, payload) {
    let promise = new Promise(async (resolve, reject) => {
      if (!payload) {
        reject('no workSpace is set:getListWorkspace')
      } else {

        // fetch remoeteDb if localDb is not available
        await dispatch('syncIfNoDb', payload)

        const db = new PouchDB(payload)
        db.allDocs({include_docs: true}).then(function (docs) {
          let res = []
          docs.rows.forEach(function (value, index) {
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
