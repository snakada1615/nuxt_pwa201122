import { auth } from '@/service/firebase.js'

export default context => {
  const { store } = context

  console.log('auth status changed')
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('middleware: ' + user)
        return resolve(store.commit('setUser', user))
      }
      return resolve()
    })
  })
}
