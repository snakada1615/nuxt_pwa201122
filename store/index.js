import firebase from '~/plugins/firebase'
import PouchDB from 'pouchdb'
import {pouchPutNewDoc, pouchGetDoc, pouchUpdateDoc, pouchPutNewOrUpdate} from "../plugins/pouchHelper";

export const state = () => ({
  user: {
    name: '',
    email: 'anonymous',
    country: '',
    profession: '',
    uid: ''
  },
  //dietCases: [],
  caseId: 'case01',
  caseIdList: [],

  isLoginChecked: false,
  tabNumber: 10,
  userDB: 'userWorkSpace',
  lastUser: 'lastUser',
  isEdited: false,
  saveDate: '',
})

export const getters = {
  currentPouchID: state => {
    return state.user.email + '_' + state.caseId
  },
}

export const mutations = {
  setCaseId: function (state, payload) {
    state.caseId = payload
  },
  setCaseIdList: function (state, payload) {
    state.caseIdList = payload
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
  setLoginChecked: function (state) {
    state.isLoginChecked = true
  },
  setLoginUnChecked: function (state) {
    state.isLoginChecked = false
  },
  setEdit: function (state, payload) {
    state.isEdited = payload
  },
  setNow: function (state){
    const today = new Date()
    state.saveDate = today.getFullYear() + '/' + today.getMonth() + 1 + '/' + today.getDate()
      + '-' + ('00' + today.getHours()).slice(-2) + ':' + ('00' + today.getMinutes()).slice(-2)
  }
}

export const actions = {
  async autoLogin({dispatch, state}) {
    dispatch('setLoginUnChecked')
    const userTemp = await dispatch('loadUserFromPouch')
    const caseTemp = await dispatch('loadCaseListFromPouch')
    if (userTemp && caseTemp){
      dispatch('setLoginChecked')
      return 'login success'
    } else {
      console.log('autoLogin failed')
      let payload = {}
      payload.user = userTemp ? userTemp : {'email': 'anonymous', 'uid': ''}
      payload.caseId = 'case01'
      dispatch('initPouch', payload).then(function (){
        dispatch('setLoginChecked')
      })
      return 'initialized'
    }
  },
  login({dispatch, state}, userInfo) {
    let promise = new Promise((resolve) => {
      firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(user => {
          dispatch('setUser', {
            'email': user.user.email,
            'uid': user.user.uid
          })
          console.log('firebase successfully login:' + user.user.email)
          dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId}).then(function () {
            dispatch('autoLogin').then(function (res) {
              resolve(user)
            })
          }).catch((err) => {
            console.log(err)
            console.log('there was a problem either saveUserToLastuser or loadDietInfoFromPouch')
            resolve(null)
          })
        })
        .catch((error) => {
          alert('login failed')
          console.log('firebase: login failed')
          console.log(error)
          resolve(null)
        })
    })
    return promise
  },
  logout({dispatch, state}) {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      dispatch('setOffUser')
      dispatch('setCaseId', 'case01')
      dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId}).then(function () {
        dispatch('autoLogin').then(function (res) {
          console.log('firebase:successfully sign out')
          return true
        })
      })
    }).catch(function (error) {
      // An error happened.
      console.log('firebase:sign out failed')
      console.log(error)
      return false
    });
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
          'itemsRecepi': [],
          'targetName': '',
          'nutritionTarget': {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
          },
          'nutritionSum': {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
          },
          'driID': '',
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
          'selectedItem':{},
          'ansList':[-99, - 99, - 99, - 99,-99, -99, -99, -99, -99, -99, -99, -99],
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
    const caseInit = [{
      'workspace': state.caseId,
      'saveDate': state.saveDate
    }]
    dispatch('setCaseIdList', caseInit)

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
    const res = await pouchPutNewOrUpdate(db, WS).catch((err) => console.log(err))
    console.log('data saved to Pouch')
    console.log(res)
    return res
  },
  loadUserFromPouch({state, dispatch}) {
    const lastUser = 'lastUser'
    let db = new PouchDB(state.userDB)
    let promise = new Promise((resolve, reject) => {
      pouchGetDoc(db, lastUser).then(function (docTemp) {
        const userTmp = docTemp.user ? docTemp.user : {
          name: '',
          email: state.user.email,
          country: '',
          profession: '',
          uid: ''
        }
        const caseIdTmp = docTemp.caseId ? docTemp.caseId : 'case01'

        dispatch('setUser', userTmp)
        dispatch('setCaseId', caseIdTmp)
        pouchPutNewOrUpdate(db, {_id: lastUser, user: userTmp, caseId: caseIdTmp})
        resolve(state.user)
      }).catch((err) => {
        // if no record
        console.log('no user info set on lastuser')
        resolve(false)
      })
    })
    return promise
  },
  loadCaseListFromPouch({state, dispatch}) {
    let promise = new Promise(async (resolve, reject) => {
      const caseTemp = await dispatch('getListWorkspace', state.user.email)
      if (caseTemp.length) {
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
          if (value.doc.user.email === userEmail && value.id !== 'lastUser') {
            if (value.doc.caseId) {
              res.push({
                workspace: value.doc.caseId,
                saveDate: value.doc.saveDate
              })
            }
          }
        })
        resolve(res)
      }).catch(function (err) {
        console.log(err)
        reject('')
      })
    })
    return promise
  },
  registUser(context, userInfo) {
    firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((user) => {
        console.log('regist ok！')
        context.commit('setUser', {
          'email': user.user.email,
          'uid': user.user.uid
        })
      })
      .catch((error) => {
        context.commit('setOffUser')
        console.log('registration failed')
        alert(error)
      })
  },
  setNow(context){
    context.commit('setNow')
  },
  setUser(context, payload) {
    context.commit('setUser', payload)
  },
  setOffUser(context) {
    context.commit('setOffUser')
  },
  setLoginChecked(context) {
    context.commit('setLoginChecked')
  },
  setLoginUnChecked(context) {
    context.commit('setLoginUnChecked')
  },
  setCaseId: function (context, payload) {
    context.commit('setCaseId', payload)
  },
  setCaseIdList: function (context, payload) {
    context.commit('setCaseIdList', payload)
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
