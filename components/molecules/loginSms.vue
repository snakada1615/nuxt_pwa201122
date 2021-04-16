<template>
  <b-container>
    <b-modal :id="name" :static="true" hide-footer
             :title="modalTitle" size="sm" header-bg-variant="info">
      <div v-show="state==='startLogin'">
        <div class="mb-2">please send your mobile number. You will then, get confirmation code through SMS</div>
        <b-form-input
          v-model='phoneNumber'
          placeholder="phone number"
          type="tel"
          class="my-2"
        />
        <button id='linkPhoneNumberBtn' @click="sendSmsVerification">send</button>
      </div>

      <div v-show="state==='waitingVerify'">
        <div class="mb-2">please send verificatino code you got from SMS</div>
        <b-form-input
          v-model='verificationCode'
          placeholder="******"
          type="number"
          class="my-2"/>
        <button @click="confirmVerification" class="my-2">send</button>
      </div>

      <div v-show="state==='authComplete'">
        <div>you are already logged in. please log out first if you are going to login as another user</div>
        <div>user: {{uid}}</div>
      </div>

    </b-modal>
  </b-container>
</template>

<script>
  import firebase from '~/plugins/firebase'

  export default {
    props:{
      name: {
        type: String,
        required: true,
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
    data() {
      return {
        phoneNumber: '',
        recaptchaVerifier: null,
        confirmationResult: null,
        waitingVerify: false,
        verificationCode: '',
        regExTel: /^(\+\d{1,2})?\d{10}$/gm,
//        regExTel: /^\d{10}$/gm,
      }
    },
    computed: {
      state() {
        if (!this.waitingVerify && !this.uid) {
          return 'startLogin'
        }
        if (this.waitingVerify && !this.uid) {
          return 'waitingVerify'
        }
        return 'authComplete'
      },
      modalTitle(){
        if (this.state === 'startLogin') {
          return 'send mobile number'
        }
        if (this.state === 'waitingVerify') {
          return 'send confirmation code'
        }
        if (this.state === 'autoComplete') {
          return 'please logout first'
        }
      },
    },
    async mounted() {
      if (this.uid) {
        this.waitingVerify = true
      }
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('linkPhoneNumberBtn', {
        'size': 'invisible',
      })
    },
    methods: {
      async sendSmsVerification() {
        try {
          this.confirmationResult = await firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier)
          this.waitingVerify = true
        } catch(error) {
          console.error(error)
        }
      },
      async confirmVerification() {
        console.log('check01')
        const result = await this.confirmationResult.confirm(this.verificationCode)
        console.log(result.user)
        this.$emit('update:email', result.user.email)
        this.$emit('update:uid', result.user.uid)
        this.recaptchaVerifier = null
        this.confirmationResult = null
        this.result = null
        this.waitingVerify = false
        this.$bvModal.hide(this.name)
      }
    }
  }
</script>
