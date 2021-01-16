import Vuex from 'vuex'
import firebase from '~/plugins/firebase'

export const state = () => ({
  user: {
    email: 'NOT_REGISTERED',
    uid: ''
  },
  isLoginChecked: false
})

export const mutations = {
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

export const actions={
  async autoLogin({dispatch}) {
    dispatch('setLoginUnChecked')
    const DBName = 'firebaseLocalStorageDb'
    const tableName = 'firebaseLocalStorage'
    const DBstatus = await dispatch('DBexists', DBName)
    let records = []
    let db = null
    if (DBstatus) {
      db = await dispatch('getDb', DBName);
      records = await dispatch('getRecordsFromDb', {'dbName':db, 'tableName':tableName});
      if (records.length === 0) {
        dispatch('setOffUser')
      } else {
        dispatch('setUser', {
          'email': records[0].value.email,
          'uid': records[0].value.uid
        })
      }
    }
    dispatch('setLoginChecked')
    console.log('store initialize complete:' + this.state.isLoginChecked)
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
