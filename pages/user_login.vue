<template>
  <div class="container" style="max-width: 540px">
    <p>current user: <span v-if="$store.state.user">{{ $store.state.user.email }}</span></p>
    <b-form @submit.prevent>
      <b-row class="my-2">
        <b-col>
          <vee-input
            name="input_email"
            rules="required|email"
            placeholder="email"
            type="email"
            v-model="email"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <vee-input
            name="input_pass"
            rules="required|min:6"
            placeholder="password"
            type="password"
            v-model="password"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <b-button @click="login()" variant="primary" size="sm">login</b-button>
          <b-button @click="registUser" variant="primary" size="sm">new user</b-button>
          <b-button @click="logout()" size="sm">logout</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
  import veeInput from "@/components/atoms/veeInput";

  export default {
    components: {
      veeInput,
    },
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
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
      registUser() {
        this.$store.dispatch('registUser', {email: this.email, password: this.password})
        this.email = ''
        this.password = ''
        this.$router.push('/')
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
