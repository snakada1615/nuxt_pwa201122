import Vuex from 'vuex'
import firebase from '~/plugins/firebase'

const store = () => {
  return new Vuex.Store({
    state: function () {
      return {
        user: {
          email: 'NOT_REGISTERED',
          uid: ''
        },
        isLoginChecked: false
      }
    },
    data() {
      return {
        db: null,
        records: []
      }
    },
    mutations: {
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
      }
    },
    actions: {
      async autoLogin({dispatch}) {
        const DBName = 'firebaseLocalStorageDb'
        const tableName = 'firebaseLocalStorage'
        const DBstatus = await dispatch('DBexists', DBName)
        console.log('DBExistrs:' + DBstatus)
        if (DBstatus) {
          this.db = await dispatch('getDb', DBName);
          this.records = await dispatch('getRecordsFromDb', tableName);
          if (this.records.length === 0) {
            dispatch('setOffUser')
          } else {
            dispatch('setUser', {
              'email': this.records[0].value.email,
              'uid': this.records[0].value.uid
            })
            console.log('email:' + this.records[0].value.email)
          }
        }
        dispatch('setLoginChecked')
      },
      login(context, userInfo) {
        firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
          .then(user => {
            context.commit('setUser', {
              'email': user.user.email,
              'uid': user.user.uid
            })
            console.log('firebase:login ok！')
          }).catch((error) => {
          context.commit('setOffUser')
          console.log('firebase: login failed')
          alert(error)
        })
          .catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            alert('login failed')
            alert(errorMessage)
            alert(errorCode)
          });
      },
      logout(context) {
        firebase.auth().signOut().then(function () {
          // Sign-out successful.
          context.commit('setOffUser')
          console.log('firebase:successfully sign out')
        }).catch(function (error) {
          // An error happened.
          console.log('firebase:sign out failed')
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
      async getRecordsFromDb(context, storeName) {
        return new Promise((resolve, reject) => {
          let trans = this.db.transaction(storeName, 'readonly');
          trans.oncomplete = e => {
            resolve(this.records);
          };

          let store = trans.objectStore(storeName);
          this.records = [];

          store.openCursor().onsuccess = e => {
            let cursor = e.target.result;
            if (cursor) {
              this.records.push(cursor.value)
              cursor.continue();
            }
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
      async DBexists(context,targetDB) {
        let res = false
        const nameList = await window.indexedDB.databases()
        for (let i=0; i < nameList.length; i++) {
          if (nameList[i].name === targetDB) {
            res = true
          }
        }
        return res
      }
    },
  })
}

export default store
