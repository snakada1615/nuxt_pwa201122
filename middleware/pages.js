export default function (store) {
// go tell the store to update the page
  store.store.dispatch('autoLogin').then(function(){
      console.log('autologin complete:')
      console.log(store.store.state.user.email)
    }
  )
}
