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
  isLoginChecked: false,
  dietCases: [],
  tabNumber: 10,
  dbUser: 'userWorkSpace',
  caseId: 'case01',
  isEdited: false,
})

export const getters = {
  currentPouchID: state => {
    return state.user.email + '_' + state.caseId
  }
}

export const mutations = {
  setDiet: function (state, payload) {
    state.dietCases = payload
  },
  setRecepi: function (state, payload) {
    let res = false
    state.dietCases[payload.pageId].itemsRecepi.forEach(function (val) {
      if (val.id === payload.itemsRecepi.item[0].id) {
        val.Wt = payload.itemsRecepi.Wt
        res = true
      }
    })
    if (!res) {
      state.dietCases[payload.pageId].itemsRecepi.push({
        'id': payload.itemsRecepi.item[0].id || 0,
        'Name': payload.itemsRecepi.item[0].Name || 0,
        'Group': payload.itemsRecepi.item[0].Group || 0,
        'En': payload.itemsRecepi.item[0].En || 0,
        'Pr': payload.itemsRecepi.item[0].Pr || 0,
        'Va': payload.itemsRecepi.item[0].Va || 0,
        'Fe': payload.itemsRecepi.item[0].Fe || 0,
        "Wt": payload.itemsRecepi.Wt || 0
      })
    }
    //state.dietCases[payload.pageId].itemsRecepi = payload
  },
  setCaseId: function (state, payload) {
    state.caseId = payload
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
      const userTemp = await dispatch('loadUserPouch').catch((err)=> err)
      const infoTemp = await dispatch('loadDietInfoFromPouch').catch((err)=>err)
      if (userTemp && infoTemp){
        dispatch('setLoginChecked')
        resolve(userTemp)
      } else {
        console.log('autoLogin failed')
        console.log(userTemp)
        console.log(infoTemp)
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
          dispatch('saveUserPouch').then(function () {
            dispatch('autoLogin').then(function(res){
              resolve(user)
            })
          }).catch((err)=> {
            console.log(err)
            console.log('there was a problem either saveUserPouch or loadDietInfoFromPouch')
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
  logout({dispatch}) {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      dispatch('setOffUser')
      dispatch('saveUserPouch').then(function () {
        dispatch('autoLogin').then(function(res){
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
  saveUserPouch({state, dispatch, getters}){
    const lastUser = 'lastUser'
    let promise = new Promise(async (resolve, reject) => {

      //save from store.user -> pouchDB(lastUser)
      let db = new PouchDB(state.dbUser)
      const userTemp = {}
      userTemp._id = lastUser
      userTemp.user = {}
      userTemp.user.email = state.user.email
      userTemp.user.uid = state.user.uid
      userTemp.user.name = ''
      userTemp.user.country = ''
      userTemp.user.profession = ''
      userTemp.caseId = state.caseId
      const res = await pouchPutNewOrUpdate(db, userTemp)
      res ? resolve(res) : reject(res)
    })
    return promise
  },
  loadUserPouch({state, dispatch}){
    const lastUser = 'lastUser'
    let db = new PouchDB(state.dbUser)
    let promise = new Promise( (resolve) => {
      pouchGetDoc(db, lastUser).then(function (docTemp){
        docTemp.user ? dispatch('setUser', docTemp.user) : console.log('doc.User = null')
        docTemp.caseId ? dispatch('setCaseId', docTemp.caseId) : console.log('doc.caseId = null')
        resolve(state.user)
      }).catch((err)=>{
        // if no record
        dispatch('setOffUser')
        dispatch('setCaseId', 'case01')
        resolve(state.user)
      })
    })
    return promise
  },
  saveInfoPouch({getters, state}) {
    let db = new PouchDB(state.dbUser)
    let promise = new Promise(async (resolve, reject) => {
      // get current state
      const dat = {}
      dat._id = getters.currentPouchID
      dat.caseId = state.caseId
      dat.dietCases = state.dietCases
      dat.user = state.user

      console.log('now i am saving')
      console.log(dat.dietCases)

      // save state.dietCases to pouchDB
      const res = await pouchPutNewOrUpdate(db, dat).catch((err) => err)
      res ? resolve(res) : reject(res)
    })
    return promise
  },
  loadDietInfoFromPouch({dispatch, state, getters}) {
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
          '_id': id + '_' + index,
          'pageId': index
        })
      }
      return dat
    }

    let db = new PouchDB(state.dbUser)
    const initDiet = initStatus()
    let currentDiet = {}
    let promise = new Promise( (resolve, reject) => {
      pouchGetDoc(db, getters.currentPouchID).then(function(doc){
        currentDiet = doc.dietCases ? doc.dietCases : initDiet
        dispatch('setDiet', currentDiet)
        resolve(currentDiet)
      }).catch(function(err){
        currentDiet = initDiet
        dispatch('setDiet', currentDiet)
        resolve(currentDiet)
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
      });
  },
  setDiet(context, payload) {
    context.commit('setDiet', payload)
  },
  setRecepi(context, payload) {
    context.commit('setRecepi', payload)
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
