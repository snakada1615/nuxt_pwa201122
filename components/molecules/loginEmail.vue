<template>
  <b-modal
    :id="name"
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
      </b-form>
    </validation-observer>
    <b-row class="my-2">
      <b-col>
        <b-button @click="login()" variant="info" size="sm">login</b-button>
        <b-button @click="$bvModal.hide(name)" size="sm" variant="warning">cancel</b-button>
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
        email: '',
        password: '',
        user:''
      }
    },
    props:{
      name: {
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
        const vm = this
        this.$store.dispatch('login', {email: this.email, password: this.password}).then(function (res) {
          vm.email = ''
          vm.password = ''
          if (res){
            console.log('login success')
            vm.$emit('login', res)
            vm.user =  res
            vm.$bvModal.hide(vm.name)
          }
        }).catch(function(err){
          console.log(err)
        })
      },
    }
  }
</script>
