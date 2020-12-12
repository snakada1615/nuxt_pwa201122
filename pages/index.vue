<template>
  <section class="container">
    <div>
      <p>{{ $store.state.message }}</p>
      <p>{{ $store.state.user.email }}</p>
    </div>
    <b-button @click="$store.commit('updateMessage', 'baka')">push me!</b-button>
    <b-button @click="$store.commit('setUser', {email:'aho', pass:'123232'})">push em!</b-button>
    <p
      v-if="false"
      class="text"
    >
      {{ $store.user.email }}
    </p>
    <form
      v-else
      class="form"
      @submit.prevent
    >
      <p>{{ $store.dummy }}</p>
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
  </section>
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
        this.$store.dispatch('login', {email: this.email, password: this.password}).then(
          console.log(this.$store.state.user.email),
          alert('yeah' + this.$store.state.user.email)
          //this.$router.push('/')
        )
      },
    }
  }
</script>
