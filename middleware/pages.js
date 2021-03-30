export default function ({store, redirect, route}) {
// go tell the store to update the page
  console.log(store.state.loginStatus)
  store.dispatch('autoLogin').then(function (){
    if (route.name !=='index' && route.name !=='user_login' && store.state.loginStatus!==1) {
      console.log('not login')
      return redirect('/')
    } else {
      console.log('autologin complete:')
    }
  })
}
