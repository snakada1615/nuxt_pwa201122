<template>
  <div class="container" style="max-width: 540px">
    <p>login user: <span v-if="$store.state.user">{{ $store.state.user.email }}</span></p>
    <p>login uid: <span v-if="$store.state.user">{{ $store.state.user.uid }}</span></p>
    <b-form @submit.prevent>
      <b-row>
        <b-col>
          <b-form-input
            id="email_input"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="email"
            type="email"
            v-model="email"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-form-input
            id="pass_input"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="password"
            s type="password"
            v-model="password"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-button @click="login()" variant="primary">login</b-button>
          <b-button @click="logout()">logout</b-button>
          <b-button @click="DBexists('firebaseLocalStorageDb')">list DB nmes</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      halo() {
        console.log('halo')
      },
      login() {
        this.$store.dispatch('login', {email: this.email, password: this.password})
        this.email = ''
        this.password = ''
        //this.$router.push('/')
      },
      logout() {
        this.$store.dispatch('logout')
        this.email = ''
        this.password = ''
        //this.$router.push('/')
      },
      DBexists(targetDB) {
        window.indexedDB.databases().then((namelist) => {
          let res = false
          for (let i=0; i < namelist.length; i++) {
            if (namelist[i].name === targetDB) {
              res = true
            }
          }
          console.log(res)
        })
      }
    }
  }
</script>
