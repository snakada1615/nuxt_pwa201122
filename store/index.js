//import Vuex from 'vuex'
/*
data structure
dietCases[] = ({
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

user = {
  name: '',
    email: 'NOT_REGISTERED',
    country: '',
    profession: '',
    uid: ''
},

isLoginChecked: false,
tabNumber: 10,
caseId: ''

*/

import firebase from '~/plugins/firebase'
import PouchDB from 'pouchdb'

export const state = () => ({
  user: {
    name: '',
    email: 'NOT_REGISTERED',
    country: '',
    profession: '',
    uid: ''
  },
  isLoginChecked: false,
  dietCases: {},
  tabNumber: 10,
  dbUser: 'userWorkSpace',
  caseId: ''
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
  setCaseId: function (state, payload) {
    state.caseId = payload
  },
  setUser: function (state, payload) {
    state.user = payload
  },
  setOffUser: function (state) {
    state.user = {
      email: 'NOT_REGISTERED',
      uid: ''
    }
  },
  setLoginChecked: function (state) {
    state.isLoginChecked = true
  },
  setLoginUnChecked: function (state) {
    state.isLoginChecked = false
  }
}

export const actions = {
  async autoLogin({dispatch}) {
    dispatch('setLoginUnChecked')
    dispatch('loadInitialInfo').then(function (res) {
      console.log('resolved')
      dispatch('setLoginChecked')
      console.log('store initialize complete:')
    })
  },
  login(context, userInfo) {
    let promise = new Promise((resolve) => {
      firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(user => {
          console.log('firebase successfully login:' + user.user.email)
          context.commit('setUser', {
            'email': user.user.email,
            'uid': user.user.uid
          })
          resolve({
            'email': user.user.email,
            'uid': user.user.uid
          })
        })
        .catch((error) => {
          console.log('firebase: login failed')
          alert(error)
          resolve(null)
        })
    })
    return promise
  },
  logout(context) {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      context.commit('setOffUser')
      console.log('firebase:successfully sign out')
      return true
    }).catch(function (error) {
      // An error happened.
      console.log('firebase:sign out failed')
      return false
    });
  },
  saveUserInfo(context) {
    const initStateDb = new PouchDB(this.state.dbUser)
    let promise = new Promise((resolve, reject) => {
      const id = context.state.user.email + '_' + context.state.caseId
      const dat = {}
      dat._id = id
      dat.caseId = context.state.caseId
      dat.dietCases = context.state.dietCases
      dat.user = context.state.user
      initStateDb.get(dat._id).then(function (doc) {
        dat._rev = doc._rev
        initStateDb.put(dat).then(function (res) {
          console.log('record-id [' + id + '] has been updated')
          resolve(true)
        })
      }).catch(function (e) {
        console.log('now put new record')
        initStateDb.put(dat).then(function (res) {
          console.log('new record [' + id + '] has been saved')
          resolve(true)
        })
      })
    })
    return promise
  },
  loadInitialInfo(context) {
    const initStateDb = new PouchDB(context.state.dbUser)

    function initStatus() {
      context.commit('setOffUser')
      context.commit('setCaseId', 'case01')
      const id = context.getters.currentPouchID
      const iCount = context.state.tabNumber
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
      context.commit('setDiet', dat)
    }

    let promise = new Promise((resolve, reject) => {
      initStateDb.info().then(function (info) {
        if (info.doc_count === 0) {
          initStatus()
          resolve(true)
        } else {
          initStateDb.get(id)
            .then(function (docs) {
              console.log(docs);
              context.commit('setUser', docs.user)
              context.commit('setDiet', docs.dietCases)
              context.commit('setCaseId', docs.caseId)
              resolve(true)
            })
            .catch(function (err) {
              initStatus()
              resolve(true)
            })
        }
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
