<template>
  <div>
    <header>
      <div>
        <!-- As a link -->
        <b-navbar variant="info" type="dark" fixed="top" class="p-1" style="color: white">
          <b-navbar-brand to="/"><Fa :icon="faHome"/></b-navbar-brand>
          <span>NFA tool</span>
          <b-navbar-nav class="ml-auto">
            <b-nav-text v-if="$store.state.isLoginChecked">user: <span>{{$store.state.user.email}}</span></b-nav-text>
            <b-nav-item-dropdown text="Link" right>
              <b-dropdown-item
                v-for="(link, index) in links"
                :to="link.to"
                :key="link.val"
              >{{ link.val }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-navbar>
      </div>
    </header>
    <layout-content></layout-content>
  </div>
</template>

<script>
  import LayoutContent from '~/components/LayoutContent' // パスは適宜変更
  import Fa from 'vue-fa'
  import { faHome } from '@fortawesome/free-solid-svg-icons'
  import user_login from "../pages/user_login";


  export default {
    components: {
      LayoutContent,
      Fa
    },
    data(){
      return {
        faHome,
        links:[
          {to: '/', val:'index'},
          {to: '/dietCalk', val:'dietCalk'},
          {to: '/test', val:'test'},
          {to: '/user_login', val:'user_login'},
          {to: '/user_reg', val:'user_register'},
          {to: '/feasibilityCheck', val:'Feasiblity Check'},
        ]
      }
    }
  }
</script>
