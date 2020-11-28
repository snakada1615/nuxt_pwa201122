<template>
  <div>
    <header>
      <div>
        <!-- As a link -->
        <b-navbar variant="info" type="dark" fixed="top" class="p-1" style="color: white">
          <b-navbar-brand href="#"><Fa :icon="faHome"/></b-navbar-brand>
          <span>NFA tool</span>
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
