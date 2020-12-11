<template>
  <div class="container">
    <div>
      <p>email: {{ $store.state.user.email }}</p>
      <p>pass: {{ $store.state.user.pass }}</p>
      <p>status: {{ $store.state.user.login }}</p>
    </div>
    <form
      v-if="$store.state.user.login"
      class="form"
    >
      <div>you are signed in</div>
      <b-button @click="$store.dispatch('logout')">logout</b-button>
    </form>
    <form
      v-else
      class="form"
      @submit.prevent
    >
      <label class="label">
       <span class="label">
         email
       </span>
        <input
          class="input"
          type="email"
          v-model="email"
        >
      </label>
      <label class="label">
       <span class="label">
         password
       </span>
        <input
          class="input"
          type="password"
          v-model="password"
        >
      </label>
      <button
        class="button"
        type="submit"
        @click="login()"
      >
        Login
      </button>
    </form>
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
