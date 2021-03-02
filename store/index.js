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
  dbUser: 'userWorkSpace',
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
  }
}

export const actions = {
  autoLogin({dispatch, state}) {
    let promise = new Promise(async (resolve, reject) => {
      dispatch('setLoginUnChecked')
      const userTemp = await dispatch('loadUserFromPouch').catch((err) => err)
      const caseTemp = await dispatch('loadCaseListFromPouch').catch((err) => err)
      if (userTemp && caseTemp) {
        dispatch('setLoginChecked')
        resolve(userTemp)
      } else {
        console.log('autoLogin failed')
        console.log(userTemp)
        reject(false)
      }
    })
    return promise
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
      let db = new PouchDB(state.dbUser)
      const userTemp = {}
      userTemp._id = lastUser
      userTemp.user = payload.user
      userTemp.caseId = payload.caseId
      let today = new Date()
      userTemp.saveDate = today.getFullYear() + '/' + today.getMonth() + 1 + '/' + today.getDate()
        + '-' + today.getHours() + ':' + today.getMinutes()
      const res = await pouchPutNewOrUpdate(db, userTemp)
      res ? resolve(res) : reject(res)
    })
    return promise
  },
  async saveDietToPouch({state, getters, dispatch}, payload) {
    const db = new PouchDB(state.dbUser)
    let today = new Date()
    payload.saveDate = today.getFullYear() + '/' + today.getMonth() + 1 + '/' + today.getDate()
      + '-' + today.getHours() + ':' + today.getMinutes()
    let promise = new Promise(async (resolve, reject) => {
      payload._id = getters.currentPouchID
      console.log(payload)
      const res = await pouchPutNewOrUpdate(db, payload).catch((err) => err)
      if (res) {
        resolve(res)
      } else {
        reject(false)
      }
    })
    return promise
  },
  loadUserFromPouch({state, dispatch}) {
    const lastUser = 'lastUser'
    let db = new PouchDB(state.dbUser)
    let promise = new Promise((resolve) => {
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
        pouchPutNewOrUpdate(db, {user: userTmp, caseId: caseIdTmp})
        resolve(state.user)
      }).catch((err) => {
        // if no record
        dispatch('setOffUser')
        dispatch('setCaseId', 'case01')
        dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId})
        resolve(state.user)
      })
    })
    return promise
  },
  loadCaseListFromPouch({state, dispatch}) {
    let promise = new Promise(async (resolve, reject) => {
      const caseTemp = await dispatch('getListWorkspace', state.user.email)
      if (caseTemp) {
        dispatch('setCaseIdList', caseTemp)
        resolve(caseTemp)
      } else {
        console.log(caseTemp)
        reject(caseTemp)
      }
    })
    return promise
  },
  loadDietInfoFromPouch({state, getters}) {
    function initStatus() {
      const id = getters.currentPouchID
      const iCount = state.tabNumber
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

    let db = new PouchDB(state.dbUser)
    const initDiet = initStatus()
    let currentDiet = {}
    let promise = new Promise((resolve) => {
      pouchGetDoc(db, getters.currentPouchID).then(function (doc) {
        currentDiet = doc.dietCases ? doc.dietCases : initDiet
        resolve(currentDiet)
      }).catch(function (err) {
        console.log(err)
        currentDiet = initDiet
        resolve(currentDiet)
      })
    })
    return promise
  },
  getListWorkspace({dispatch, state}, userEmail) {
    console.log('getListWorkspace')
    const db = new PouchDB(state.dbUser)
    let promise = new Promise((resolve, reject) => {
      db.allDocs({include_docs: true}).then(function (docs) {
        let res = []
        docs.rows.forEach(function (value, index) {
          if (value.doc.user.email === userEmail) {
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
  changeCaseId: function ({dispatch}, payload) {
    dispatch('setCaseId', payload)
    dispatch('saveUserToLastuser', {user: state.user, caseId: state.caseId})
    dispatch('autoLogin')
  },
  setEdit: function (context, payload) {
    context.commit('setEdit', payload)
  },
  async getRecordsFromDb(context, payload) {
    return new Promise((resolve, reject) => {
      let records = []
      let trans = payload.dbName.transaction(payload.tableName, 'readonly');
      let store = trans.objectStore(payload.tableName);

      store.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          records.push(cursor.value)
          cursor.continue();
        }
      };
      trans.oncomplete = e => {
        resolve(records);
      };
    });
  },
  async getDb(context, DBName) {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(DBName, 1);

      request.onerror = e => {
        console.log('Error opening db', e);
        reject('Error');
      };

      request.onsuccess = e => {
        //console.log(e.target.result)
        resolve(e.target.result);
      };
    });
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
