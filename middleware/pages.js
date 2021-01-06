export default function (store) {
// go tell the store to update the page
  console.log('user=' + store.store.state.user.email)
  store.store.commit('setUser', store.store.state.user)
}
