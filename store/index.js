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
    subnational1: '',
    subnational2: '',
    subnational3: '',
    organization: '',
    title: '',
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
  async autoLogin({dispatch}) {
    dispatch('loadCaseListFromPouch')
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
  removeUserDb({state}) {
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
    console.log(payload)
    // initialize user to store
    dispatch('setUser', payload.user)
    dispatch('setCaseId', payload.caseId)

    //set time stump
    dispatch('setNow')

    //set time caseIdList
    dispatch('addCaseIdList', state.caseId)

    // set user and caseid to lastUser
    await dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId})

    // initialize and set caseId to PouchDB
    let WS = {}
    const id = getters.currentPouchID
    const iCount = state.tabNumber

    WS.dietCases = initDiet(id, iCount)
    WS.saveDate = state.saveDate
    WS.user = state.user
    WS.caseId = state.caseId
    WS.feasibilityCases = initFeasibilityCase(id, iCount)
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
    })
    return promise
  },
  async registUserEmial({context, dispatch}, userInfo){
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
        .catch(function (err){
          console.log(err)
          reject(err)
        })
    })
    return promise
  },
  async registUser({context, dispatch}, userInfo) {
    console.log(userInfo)
    let promise = new Promise(function (resolve, reject) {
      firebase.auth().createUserWithEmailAndPassword(userInfo.user.email, userInfo.user.password)
        .then(
          // if success
          function (res) {
            console.log('regist ok！')
            dispatch('setUser', {
              email: res.user.email,
              uid: res.user.uid,
              name: userInfo.user.name,
              country: userInfo.user.country,
              subnational1: userInfo.user.subnational1,
              subnational2: userInfo.user.subnational2,
              subnational3: userInfo.user.subnational3,
              organization: userInfo.user.organization,
              title: userInfo.user.title,
            })
            dispatch('initPouch', userInfo).then(function () {
              dispatch('autoLogin').then(function (res) {
                console.log('login -> autologin: loginStatus=' + res)
                console.log(res)
                resolve(true)
              })
            })
          },
          //if failure
          function (error) {
            console.log('registration failed')
            //context.commit('setOffUser')
            reject(error)
          })
        .catch(function (err){
          console.log(err)
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
