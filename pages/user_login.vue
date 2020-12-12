<template>
  <div class="container" style="max-width: 540px">
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
s            type="password"
            v-model="password"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-button @click="login()" variant="primary">login</b-button>
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
      //this.$router.push('/')
    },
  }
}
</script>
