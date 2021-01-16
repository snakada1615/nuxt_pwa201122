<template>
  <b-modal
    :id="dialogId"
    :title="myModalHeader"
    body-bg-variant="light"
    header-bg-variant="info"
    header-text-variant="white"
    hide-footer
  >
    <p>current user: <span class="text-danger">{{ $store.state.user.email }}</span></p>
    <validation-observer v-slot="{invalid}">
      <b-form @submit.prevent>
        <b-row class="my-2">
          <b-col>
            you are going to login as:
          </b-col>
        </b-row>
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
            <b-button v-bind:disabled="invalid" @click="login()" variant="info" size="sm">login</b-button>
            <b-button @click="logout()" size="sm" variant="info">logout</b-button>
            <b-button @click="$bvModal.hide(dialogId)" size="sm" variant="warning">cancel</b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-modal>
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
    props:{
      dialogId: {
        type: String,
        required:true
      },
      myModalHeader: {
        type: String,
        default: 'User Login'
      },
    },
    methods: {
      login() {
        console.log(this.email)
        const vm = this
        this.$store.dispatch('login', {email: this.email, password: this.password}).then(function (res) {
          vm.email = ''
          vm.password = ''
          if (res){
            vm.$bvModal.hide(vm.dialogId)
          }
        })
      },
      logout() {
        this.$store.dispatch('logout')
        this.email = this.$store.state.user.email
        this.password = ''
        this.$bvModal.hide(this.dialogId)
      },
    }
  }
</script>
