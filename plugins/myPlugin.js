import { barrating } from 'jquery-bar-rating';

export default () => {
  //inject('barrating', barrating)
  // For Nuxt <= 2.12, also add 👇
  //context.barrating = barrating
  barrating
}
/*
export default function(){
// manually add the script to the DOM
  const myScript = document.createElement('script')
  myScript.src = '/node_modules/jquery-bar-rating/jquery.barrating.min.js' + ''
  document.getElementsByTagName('head')[0].appendChild(myScript)
}
*/

