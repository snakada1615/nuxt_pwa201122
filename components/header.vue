<template>
  <div>
    <header>
      <div>
        <!-- As a link -->
        <b-navbar variant="info" type="dark" fixed="top" class="p-1" style="color: white">
          <b-navbar-brand to="/"><Fa :icon="faHome"/></b-navbar-brand>
          <span>NFA tool</span>
          <b-navbar-nav class="ml-auto">
            <b-nav-text right class="mr-2"><h6>{{$store.state.user.email}}</h6></b-nav-text>
            <b-nav-item-dropdown right>
              <template #button-content>
                <Fa :icon="faUser"/>
              </template>
              <b-dropdown-item disabled>user name: <span class="text-danger">{{$store.state.user.name}}</span></b-dropdown-item>
              <b-dropdown-item disabled>user email: <span class="text-danger">{{$store.state.user.email}}</span></b-dropdown-item>
              <b-dropdown-item disabled>user country:<span class="text-danger">{{$store.state.user.country}}</span></b-dropdown-item>
              <b-dropdown-item disabled>user profession:<span class="text-danger">{{$store.state.user.profession}}</span></b-dropdown-item>
              <b-dropdown-item @click="openLogin"><span class="text-primary font-weight-bold">login</span></b-dropdown-item>
              <b-dropdown-item @click="$store.dispatch('saveInfoPouch')"><span class="text-primary font-weight-bold">save workspace</span></b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right>
              <template #button-content>
                <Fa :icon="faCaretSquareDown"/>
              </template>
              <b-dropdown-item
                v-for="(link, index) in links"
                :to="link.to"
                :key="link.val"
              >{{ link.val }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-navbar>
        <user_login
          dialog-id="loginModal"
        ></user_login>
      </div>
    </header>
    <layout-content></layout-content>
  </div>
</template>

<script>
  import LayoutContent from '~/components/LayoutContent' // パスは適宜変更
  import Fa from 'vue-fa'
  import { faHome, faUser, faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'
  import user_login from "./molecules/user_login";


  export default {
    components: {
      LayoutContent,
      Fa,
      user_login,
    },
    data(){
      return {
        faHome, faUser, faCaretSquareDown,
        links:[
          {to: '/', val:'index'},
          {to: '/dietCalk', val:'dietCalk'},
          {to: '/test', val:'test'},
          {to: '/test3', val:'test3'},
          {to: '/test4', val:'test4'},
          {to: '/test5', val:'test5'},
          {to: '/user_login', val:'user_login'},
          {to: '/user_reg', val:'user_register'},
          {to: '/updateSW', val:'updateSW'},
          {to: '/feasibilityCheck', val:'Feasiblity Check'},
        ]
      }
    },
    methods:{
      openLogin() {
        console.log('open login')
        this.$bvModal.show('loginModal')
      }
    }
  }
</script>
