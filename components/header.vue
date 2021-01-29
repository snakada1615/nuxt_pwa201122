<template>
  <div>
    <header>
      <div>
        <!-- As a link -->
        <b-navbar variant="info" type="dark" fixed="top" class="p-1" style="color: white">
          <b-navbar-brand to="/" Nuxt><b-icon icon="house-fill"/></b-navbar-brand>
          <span>NFA tool</span>
          <b-navbar-nav class="ml-auto">
            <b-nav-text right class="mr-2"><h6>{{$store.state.user.email}}</h6></b-nav-text>
            <b-nav-item-dropdown no-caret right>
              <template #button-content>
                <b-icon variant="light" icon="person-circle"/>
              </template>
              <b-dropdown-item disabled>name: <span class="text-danger">{{$store.state.user.name}}</span></b-dropdown-item>
              <b-dropdown-item disabled>email: <span class="text-danger">{{$store.state.user.email}}</span></b-dropdown-item>
              <b-dropdown-item disabled>country:<span class="text-danger">{{$store.state.user.country}}</span></b-dropdown-item>
              <b-dropdown-item disabled>profession:<span class="text-danger">{{$store.state.user.profession}}</span></b-dropdown-item>
              <b-dropdown-item disabled>workspace: <span class="text-danger">{{$store.state.caseId}}</span></b-dropdown-item>
              <b-dropdown-item @click="openLogin"><span class="text-info font-weight-bold">change user</span></b-dropdown-item>
              <b-dropdown-item @click="openWorkSpaceChange"><span class="text-info font-weight-bold">change workspace</span></b-dropdown-item>
              <b-dropdown-item @click="$store.dispatch('saveInfoPouch')"><span class="text-info font-weight-bold">save workspace</span></b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-text><b-icon
              icon="check-circle-fill"
              :class="{'text-warning':$store.state.isEdited, 'text-light':!$store.state.isEdited}"
            /> </b-nav-text>
            <b-nav-item-dropdown no-caret right>
              <template #button-content>
                <b-icon variant="light" icon="caret-down-square"/>
              </template>
              <b-dropdown-item
                v-for="(link, index) in links"
                :to="link.to"
                :key="link.val"
              >{{ link.val }}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-text v-if="$nuxt.isOnline" class="text-light"><b-icon icon="reception4"/></b-nav-text>
            <b-nav-text v-else class="text-light"><b-icon icon="reception0"/></b-nav-text>
          </b-navbar-nav>
        </b-navbar>
        <user_login dialog-id="loginModal"/>
        <change-work-space dialog-id="changeWorkSpaceModal" :case-ids="$store.state.caseIdList"/>
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
  import changeWorkSpace from "./molecules/changeWorkSpace";
  import ChangeWorkSpace from "./molecules/changeWorkSpace";

  export default {
    components: {
      ChangeWorkSpace,
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
        this.$bvModal.show('loginModal')
      },
      openWorkSpaceChange(){
        this.$bvModal.show('changeWorkSpaceModal')
      }
    }
  }
</script>
