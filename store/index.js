import Vuex from 'vuex'
import firebase from '~/plugins/firebase'

const createStore = () => {
  return new Vuex.Store({
    state: function () {
      return {
        message: 'Hello Vuex!',
        user: {
          email: '',
          pass: '',
          // login status
          login: false,
        }
      }
    },
    mutations: {
      updateMessage: function (state, payload) {
        state.message = payload
      },
      setUser: function (state, payload) {
        state.user = {email: payload.email, pass: payload.pass, login:true}
      },
      setOffUser: function (state) {
        state.user = {email: '', pass: '', login:false}
      }
    },
    actions: {
      login(context, userInfo) {
        firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
          .then(user => {
            context.commit('setUser', userInfo)
            console.log('firebase:login ok！')
          }).catch((error) => {
            context.commit('setOffUser')
            console.log('firebase: login failed')
            alert(error)
        })
      },
      logout(context) {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          context.commit('setOffUser')
          console.log('firebase:successfully sign out')
        }).catch(function(error) {
          // An error happened.
          console.log('firebase:sign out failed')
        });
      },
      registUser(context, userInfo) {
        firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
          .then((user) => {
            console.log('regist ok！')
            context.commit('setUser', userInfo)
          })
          .catch((error) => {
            context.commit('setOffUser')
            console.log('registration failed')
            alert(error)
          });
      },
    }
  })
}

export default createStore


/*
import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: function () {
      return {
        user: {
          uid: '',
          email: '',
          // ログイン状態の真偽値を追加
          login: false,
        },
        dummy: 'halo'
      }
    },
    mutations: {
      updateMessage: function (state, payload) {
        state.user = payload
      }
    },
    actions: {
      login(context, userInfo) {
        firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
          .then(user => {
            console.log('login ok！')
            userInfo.login = true
            context.commit('updateMessage', userInfo)
          }).catch((error) => {
          console.log('login failed')
          alert(error)
        })
      },
      register(context, userInfo) {
        firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
          .then((user) => {
            console.log('regist ok！')
            userInfo.login = true
            context.commit('updateMessage', userInfo)
          })
          .catch((error) => {
            console.log('registration failed')
            alert(error)
          });
      },
    }
  })
}

export default createStore
*/
