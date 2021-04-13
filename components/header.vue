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
                <b-icon variant="light" icon="people-fill"/>
              </template>
              <b-dropdown-item disabled>name: <span class="text-danger">{{$store.state.user.name}}</span></b-dropdown-item>
              <b-dropdown-item disabled>email: <span class="text-danger">{{$store.state.user.email}}</span></b-dropdown-item>
              <b-dropdown-item disabled>country:<span class="text-danger">{{$store.state.user.country}}</span></b-dropdown-item>
              <b-dropdown-item disabled>profession:<span class="text-danger">{{$store.state.user.organization}}</span></b-dropdown-item>
              <b-dropdown-item disabled>workspace: <span class="text-danger">{{$store.state.caseId}}</span></b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-text v-if="$nuxt.isOnline" class="text-light"><b-icon icon="reception4"/></b-nav-text>
            <b-nav-text v-else class="text-light"><b-icon icon="reception0"/></b-nav-text>
          </b-navbar-nav>
        </b-navbar>
      </div>
    </header>
    <layout-content></layout-content>
  </div>
</template>

<script>
  import LayoutContent from '~/components/LayoutContent' // パスは適宜変更

  export default {
    components: {
      LayoutContent,
    },
    data(){
      return {
        links:[
          {to: '/', val:'index'},
          {to: '/dietCalk', val:'dietCalk'},
          {to: '/test', val:'test'},
          {to: '/updateSW', val:'updateSW'},
          {to: '/feasibilityCheck', val:'Feasiblity Check'},
        ]
      }
    },
  }
</script>
