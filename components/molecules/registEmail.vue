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
          you are going to register as:
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <b-form-input
            id="input_email"
            size="sm"
            :state="stateEmail"
            type="email"
            v-model="myEmail"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <b-form-input
            id="input_pass"
            size="sm"
            :state="statePass"
            type="password"
            v-model="myPassword"
          ></b-form-input>
        </b-col>
      </b-row>
    </b-form>
    <b-row class="my-2">
      <b-col>
        <b-button @click="register()" variant="info" size="sm">register</b-button>
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
        default: 'User register'
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
      register() {
        const vm = this
        this.$store.dispatch('registUserEmial', {email: this.myEmail, password: this.myPassword}).then(function (res) {
          vm.myEmail = ''
          vm.password = ''
          if (res) {
            console.log('register success')
            vm.$emit('registSuccess', res.user)
            vm.$bvModal.hide(vm.id)
          }
        }).catch(function (err) {
          vm.myEmail = ''
          vm.password = ''
          alert(err.message)
        })
      },
      cancel(val) {
        this.$emit('cancelRegistEmail')
        this.$bvModal.hide(val)
      },
    }
  }
</script>
