export default function ({store, redirect, route}) {
// go tell the store to update the page
  store.dispatch('autoLogin').then(function (){
    if (route.name !=='index'
      && route.name !=='user_login'
      && route.name !== 'user_reg'
      && route.name !== 'user_remove'
      && route.name !== 'updateSW'
      && route.name !== 'saveCouchInfo'
      && !(/^test*$/).test(route.name)
      && store.state.loginStatus!==1
    ) {
      alert('please login/register first')
      console.log('not login')
      return redirect('/')
    } else {
      console.log('autologin complete:')
    }
  }).catch(err => {
    console.log(err)
    console.log(err.message)
    console.log(err.Error)
    if (err.message === "initRwanda"){
      alert('please setup couchDB database first')
      redirect('/saveCouchInfo')
    }
  })
}
