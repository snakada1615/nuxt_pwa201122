<template>
  <div>
    <header>
      <div>
        <!-- As a link -->
        <b-navbar variant="info" type="dark" fixed="top" class="p-1" style="color: white">
          <b-navbar-brand to="/" Nuxt><Fa :icon="faHome"/></b-navbar-brand>
          <span>NFA tool</span>
          <b-navbar-nav class="ml-auto">
            <b-nav-text right class="mr-2"><h6>{{$store.state.user.email}}</h6></b-nav-text>
            <b-nav-item-dropdown no-caret right>
              <template #button-content>
                <b-img src="/img/profile_gray.png" width="20px"/>
              </template>
              <b-dropdown-item disabled>name: <span class="text-danger">{{$store.state.user.name}}</span></b-dropdown-item>
              <b-dropdown-item disabled>email: <span class="text-danger">{{$store.state.user.email}}</span></b-dropdown-item>
              <b-dropdown-item disabled>country:<span class="text-danger">{{$store.state.user.country}}</span></b-dropdown-item>
              <b-dropdown-item disabled>profession:<span class="text-danger">{{$store.state.user.profession}}</span></b-dropdown-item>
              <b-dropdown-item @click="openLogin"><span class="text-primary font-weight-bold">login</span></b-dropdown-item>
              <b-dropdown-item @click="$store.dispatch('saveInfoPouch')"><span class="text-primary font-weight-bold">save workspace</span></b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-if="$store.state.isEdited"><b-img width="20px" src="img/circle_red.png"/></b-nav-item>
            <b-nav-item v-else><b-img width="20px" src="img/circle_green.png"/></b-nav-item>
            <b-nav-item-dropdown no-caret right>
              <template #button-content>
                <b-img src="/img/menu.png" width="20px"/>
              </template>
              <b-dropdown-item
                v-for="(link, index) in links"
                :to="link.to"
                :key="link.val"
              >{{ link.val }}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-text :class="{'text-light':$nuxt.isOnline, 'text-info':$nuxt.isOffline}">
              <Fa :icon="faWifi"/>
            </b-nav-text>
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
  import { faHome, faUser, faWifi, faBars } from '@fortawesome/free-solid-svg-icons'
  import user_login from "./molecules/user_login";


  export default {
    components: {
      LayoutContent,
      Fa,
      user_login,
    },
    data(){
      return {
        faHome, faUser, faWifi, faBars,
        links:[
          {to: '/', val:'index'},
          {to: '/dietCalk', val:'dietCalk'},
          {to: '/test', val:'test'},
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
