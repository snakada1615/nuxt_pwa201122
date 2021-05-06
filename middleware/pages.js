export default function ({store, redirect, route}) {
// go tell the store to update the page
  store.dispatch('autoLogin').then(function (){
    if (route.name !=='index'
      && route.name !=='user_login'
      && route.name !== 'user_reg'
      && route.name !== 'updateSW'
      && !(/^test*$/).test(route.name)
      && store.state.loginStatus!==1
    ) {
      alert('please login/register first')
      console.log('not login')
      return redirect('/')
    } else {
      console.log('autologin complete:')
    }
  })
}
