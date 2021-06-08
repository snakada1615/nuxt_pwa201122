<template>
  <b-modal
    :id="id"
    :title="myModalHeader"
    body-bg-variant="light"
    header-bg-variant="info"
    header-text-variant="white"
    hide-footer
  >
    <b-form @submit.prevent>
      <b-row class="my-2">
        <b-col>
          you are going to login as:
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          email
        </b-col>
        <b-col>
          <b-form-input
            id="input_email"
            size="sm"
            placeholder="email"
            :state="stateEmail"
            type="email"
            v-model="myEmail"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          password
        </b-col>
        <b-col>
          <b-form-input
            id="input_pass"
            size="sm"
            placeholder="password"
            :state="statePass"
            type="password"
            v-model="myPassword"
          ></b-form-input>
        </b-col>
      </b-row>
    </b-form>
    <b-row class="my-2">
      <b-col>
        <b-button @click="login()" variant="info" size="sm">login</b-button>
        <b-button @click="cancel(id)" size="sm" variant="warning">cancel</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  export default {
    data() {
      return {
        myEmail: '',
        myPassword: '',
      }
    },
    computed: {
      stateEmail() {
        return (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(this.myEmail)
      },
      statePass() {
        return (this.myPassword.length >= 6 && this.myPassword.length <= 20)
      }
    },
    mounted() {
      if (this.email) {
        this.myEmail = this.email
      }
    },
    props: {
      id: {
        type: String,
        required: true
      },
      myModalHeader: {
        type: String,
        default: 'User Login'
      },
      email: {
        type: String,
        default: ''
      },
      uid: {
        type: String,
        default: ''
      }
    },
    methods: {
      login() {
        const vm = this
        this.$store.dispatch('login', {email: this.myEmail, password: this.myPassword}).then(function (res) {
          vm.myEmail = ''
          vm.password = ''
          if (res) {
            console.log('login success')
            vm.$emit('update:uid', res.uid)
            vm.$emit('update:email', res.email)
            vm.$emit('loginEmail', {uid: res.uid, email: res.email})
            vm.$emit('loginSuccess', res)
            vm.$bvModal.hide(vm.id)
          }
        }).catch(function (err) {
          vm.myEmail = ''
          vm.password = ''
          console.log(err)
          alert(err.message)
        })
      },
      cancel(val) {
        this.$emit('cancelLoginEmail')
        this.$bvModal.hide(val)
      },
    }
  }
</script>
