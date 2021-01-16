<template>
  <div class="container">
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
            rules="required"
            placeholder="password"
            type="password"
            v-model="password"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <b-button @click="registUser" variant="primary" size="sm">register</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
  import veeInput from "../components/atoms/veeInput";

export default {
  components: {
    veeInput
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    registUser() {
      this.$store.dispatch('registUser', {email: this.email, password: this.password})
      this.email = ''
      this.password = ''
      this.$router.push('/')
    },
  }
}
</script>
