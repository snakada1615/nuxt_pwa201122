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
            you are going to register as:
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
        <b-button @click="register()" variant="info" size="sm">register</b-button>
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
        default: 'User register'
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
      register() {
        const vm = this
        this.$store.dispatch('registUserEmial', {email: this.myEmail, password: this.myPassword}).then(function (res) {
          vm.myEmail = ''
          vm.password = ''
          if (res){
            console.log('register success')
            vm.$emit('update:uid', res.user.uid)
            vm.$emit('update:email', res.user.email)
            vm.$bvModal.hide(vm.id)
          }
        }).catch(function(err){
          vm.myEmail = ''
          vm.password = ''
          alert(err.message)
        })
      },
      cancel(val){
        this.$emit('cancelRegistEmail')
        this.$bvModal.hide(val)
      },
    }
  }
</script>
