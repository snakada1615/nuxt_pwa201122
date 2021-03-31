import firebase from '~/plugins/firebase'
import PouchDB from 'pouchdb'
import {pouchPutNewDoc, pouchGetDoc, pouchUpdateDoc, pouchPutNewOrUpdate} from "../plugins/pouchHelper";

export const state = () => ({
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

  isLoginChecked: false,
  loginStatus: 0,
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
  setLoginChecked: function (state) {
    state.isLoginChecked = true
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
  async autoLogin2({dispatch, state}) {
    dispatch('setLoginUnChecked')
    const userTemp = await dispatch('loadUserFromPouch')
    const caseTemp = await dispatch('loadCaseListFromPouch')
    if (userTemp && caseTemp) {
      dispatch('setLoginChecked')
      return 'login success'
    } else {
      console.log('autoLogin failed')
      let payload = {}
      payload.user = userTemp ? userTemp : {'email': 'anonymous', 'uid': ''}
      payload.caseId = 'case01'
      dispatch('initPouch', payload).then(function () {
        dispatch('setLoginChecked')
      })
      return 'initialized'
    }
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
        'workspace': state.caseId,
        'saveDate': state.saveDate
      }
    dispatch('addCaseIdList', caseInit)

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
    console.log(res)
    resolve(res)
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
        result = res1 * res2
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
                workspace: value.doc.caseId,
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
    console.log(res)
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
