<template>
  <div>
    <header>
      <div>
        <!-- As a link -->
        <b-navbar variant="info" type="dark" fixed="top" class="p-1" style="color: white">
          <b-navbar-brand href="#"><Fa :icon="faHome"/></b-navbar-brand>
          <span>NFA tool</span>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Link" right>
              <b-dropdown-item to="/index">index</b-dropdown-item>
              <b-dropdown-item to="/test">test</b-dropdown-item>
              <b-dropdown-item to="/modalTest">modal test</b-dropdown-item>
              <b-dropdown-item to="/validate_test">validate_test</b-dropdown-item>
              <b-dropdown-item to="/user_login">user_login</b-dropdown-item>
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


  export default {
    components: {
      LayoutContent,
      Fa
    },
    data(){
      return {
        faHome
      }
    }
  }
</script>
