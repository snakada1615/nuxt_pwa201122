import firebase from '~/plugins/firebase'
import PouchDB from 'pouchdb'
import {
  pouchPutNewDoc,
  pouchGetDoc,
  pouchUpdateDoc,
  pouchPutNewOrUpdate,
  pouchWSPutNewOrUpdate,
  pouchDeleteDb
} from "../plugins/pouchHelper";

export const state = () => ({
  packageVersion: process.env.PACKAGE_VERSION || '0',
  user: {
    name: '',
    email: '',
    country: '',
    profession: '',
    uid: ''
  },
  //dietCases: [],
  caseId: '',
  caseIdList: [],

  loginStatus: 0,
  tabNumber: 10,
  userDB: 'userWorkSpace',
  lastUser: 'lastUser',
  isEdited: false,
  saveDate: '',
})

export const getters = {
  currentPouchID: (state) => {
    return state.user.email + '_' + state.caseId
  },
  appVersion: (state) => {
    return state.packageVersion
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
    state.caseIdList = payload
  },
  addCaseIdList: function (state, payload) {
    state.caseIdList.push(payload)
  },
  setUser: function (state, payload) {
    state.user = payload
  },
  setOffUser: function (state) {
    state.user = {
      email: 'anonymous',
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
  async autoLogin({dispatch}) {
    await dispatch('loadCaseListFromPouch')
    const res = await dispatch('loadUserFromPouch')
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
    }).catch(function (error) {
      // An error happened.
      console.log('firebase:sign out failed')
      console.log(error)
      return false
    });
  },
  removeUserDb({state}){
    pouchDeleteDb(state.userDB)
  },
  saveUserToLastuser({state, dispatch, getters}, payload) {
    const lastUser = 'lastUser'
    let promise = new Promise(async (resolve, reject) => {

      //save from store.user -> pouchDB(lastUser)
      let db = new PouchDB(state.userDB)
      const userTemp = {}
      userTemp._id = lastUser
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

    // initialize caseId to store
    const caseInit = {
        'email': state.user.email,
        'caseId': state.caseId,
        'saveDate': state.saveDate
      }
    dispatch('addCaseIdList', state.caseId)

    // set user and caseid to lastUser
    await dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId})

    // initialize and set caseId to PouchDB
    let WS = {}
    const id = getters.currentPouchID
    const iCount = state.tabNumber

    WS.dietCases = initDiet(id, iCount)
    WS.feasibilityCases = initFeasibilityCase(id, iCount)
    WS.saveDate = state.saveDate
    WS.user = state.user
    WS.caseId = state.caseId
    WS._id = getters.currentPouchID

    let db = new PouchDB(state.userDB)
    const res = await pouchPutNewOrUpdate(db, WS).catch((err) => reject(err))
    console.log('data saved to Pouch')
    return res
  },
  loadUserFromPouch({state, dispatch}) {
    const lastUser = 'lastUser'
    let result = 0
    let res1 = 1
    let res2 = 1
    let db = new PouchDB(state.userDB)
    let promise = new Promise((resolve) => {
      pouchGetDoc(db, lastUser).then(function (docTemp) {
        const userTmp = docTemp.user
        const caseIdTmp = docTemp.caseId

        userTmp ? dispatch('setUser', userTmp) : res1 = 0
        caseIdTmp ? dispatch('setCaseId', caseIdTmp) : res2 = 0
        if (res1 && res2) {
          result = 1

          //check if caseId is already registered to PouchDB
          //initialize data if caseId does not exists
          //check if caseId is already registered to PouchDB
          const res3 = state.caseIdList.filter(function(val){
            return val.caseId === caseIdTmp && val.user === userTmp
          })
          if (!res3) {
            dispatch('initPouch', {user: state.user, caseId: state.caseId})
          }

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
  loadDietfromPouch({state, getters}) {
    let db = new PouchDB(state.userDB)
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
    const db = new PouchDB(state.userDB)
    dispatch('setNow')
    record.saveDate = state.saveDate
    record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await pouchWSPutNewOrUpdate(db, record, 'diet')
      if (res) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  loadFeasibilityCasefromPouch({state, getters}) {
    let db = new PouchDB(state.userDB)
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
    const db = new PouchDB(state.userDB)
    dispatch('setNow')
    record.saveDate = state.saveDate
    record._id = getters.currentPouchID
    let promise = new Promise(async (resolve) => {
      const res = await pouchWSPutNewOrUpdate(db, record, 'feasibility')
      if (res) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
    return promise
  },
  loadCaseListFromPouch({state, dispatch}) {
    let promise = new Promise(async (resolve, reject) => {
      const caseTemp = await dispatch('getListWorkspace', state.user.email)
      if (caseTemp) {
        // load list from pouchdb
        dispatch('setCaseIdList', caseTemp)
        resolve(caseTemp)
      } else {
        // if no caseId
        console.log('no caseId set in pouchDB: loadCaseListFromPouch')
        resolve(false)
      }
    })
    return promise
  },
  getListWorkspace({dispatch, state}, userEmail) {
    const db = new PouchDB(state.userDB)
    let promise = new Promise((resolve, reject) => {
      db.allDocs({include_docs: true}).then(function (docs) {
        let res = []
        docs.rows.forEach(function (value, index) {
          if (value.id !== 'lastUser') {
            if (value.doc.caseId) {
              res.push({
                email: value.doc.user.email,
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
    })
    return promise
  },
  async registUser({context, dispatch}, userInfo) {
    const res = await firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password).catch((error) => {
      context.commit('setOffUser')
      console.log('registration failed')
      alert(error)
      reject(error)
    })
    if (res){
      console.log('regist ok！')
      context.commit('setUser', {
        'email': res.user.email,
        'uid': res.user.uid
      })
      dispatch('initPouch', userInfo).then(function () {
        dispatch('autoLogin').then(function (res) {
          console.log('login -> autologin: loginStatus=' + res)
          resolve(true)
        })
      })
    }
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
