<template>
  <div class="container">
    <form
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
        @click="registUser()"
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
    registUser() {
      this.$store.dispatch('registUser', {email: this.email, password: this.password})
      this.$router.push('/')
    },
  }
}
</script>
