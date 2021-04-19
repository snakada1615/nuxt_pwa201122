<template>
  <b-modal
    :id="id"
    :title="myModalHeader"
    body-bg-variant="light"
    header-bg-variant="info"
    header-text-variant="white"
    hide-footer
  >
    <validation-observer>
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
              v-model="myEmail"
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
              v-model="myPassword"
            />
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
    <b-row class="my-2">
      <b-col>
        <b-button @click="login()" variant="info" size="sm">login</b-button>
        <b-button @click="cancel(id)" size="sm" variant="warning">cancel</b-button>
      </b-col>
    </b-row>
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
        myEmail: '',
        myPassword: '',
      }
    },
    mounted() {
      if(this.email) {
        this.myEmail = this.email
      }
    },
    props:{
      id: {
        type: String,
        required:true
      },
      myModalHeader: {
        type: String,
        default: 'User Login'
      },
      email: {
        type: String,
        default: ''
      },
      uid:{
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
          if (res){
            console.log('login success')
            vm.$emit('update:uid', res.uid)
            vm.$emit('update:email', res.email)
            vm.$emit('loginEmail', {uid: res.uid, email: res.email})
            vm.$bvModal.hide(vm.id)
          }
        }).catch(function(err){
          vm.myEmail = ''
          vm.password = ''
          console.log(err)
          alert(err.message)
        })
      },
      cancel(val){
        this.$emit('cancelLoginEmail')
        this.$bvModal.hide(val)
      },
    }
  }
</script>
