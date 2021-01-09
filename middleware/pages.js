export default function (store) {
// go tell the store to update the page
  store.store.dispatch('autoLogin')
}
