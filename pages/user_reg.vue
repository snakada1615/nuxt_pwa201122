<template>
  <div class="login">
    <p
      v-if="user.login"
      class="text"
    >
      {{ user }}
    </p>
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
          type="text"
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
        @click="register"
      >
        register
      </button>
    </form>
  </div>
</template>

<script>
  export default {
    computed: {
      user () {
        return this.$store.getters['user']
      },
    },
    data () {
      return {
        email: '',
        password: '',
      }
    },
    methods : {
      register (email, password) {
        if (this.$store.dispatch('register', {email: this.email, password: this.password})) // 成功したら1以上がreturnで帰ってくる
          this.$router.push('/')
      },
    },
  }
</script>
