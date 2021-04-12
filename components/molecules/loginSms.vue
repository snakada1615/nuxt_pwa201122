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
        <div v-if="user">{{`user id: ${user.uid}`}}</div>
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
      }
    },
    data() {
      return {
        phoneNumber: '',
        recaptchaVerifier: null,
        confirmationResult: null,
        waitingVerify: false,
        verificationCode: '',
        user: null,
        regExTel: /^(\+\d{1,2})?\d{10}$/gm,
//        regExTel: /^\d{10}$/gm,
      }
    },
    computed: {
      state() {
        if (!this.waitingVerify && !this.user) {
          return 'startLogin'
        }
        if (this.waitingVerify && !this.user) {
          return 'waitingVerify'
        }
        return 'authComplete'
      },
      modalTitle(){
        if (!this.waitingVerify && !this.user) {
          return 'send mobile number'
        }
        if (this.waitingVerify && !this.user) {
          return 'send confirmation code'
        }
      },
    },
    async mounted() {
      const myCookie = this.$cookies.get('OTZ')
      this.$cookies.set('OTZ', myCookie, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'none',
        secure: true
      });

      const vm = this
      firebase.auth().getRedirectResult().then((result) => {
        if (result.credential) {
          console.log(result.user)
          vm.user = result.user
          vm.waitingVerify = true
        }
      })

      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('linkPhoneNumberBtn', {
        'size': 'invisible',
      })
    },
    methods: {
      openModal(){
        this.$bvModal.show('credModal')
      },
      async sendSmsVerification() {
        try {
          this.confirmationResult = await firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier)
          this.waitingVerify = true
        } catch(error) {
          console.error(error)
        }
      },
      async confirmVerification() {
        const result = await this.confirmationResult.confirm(this.verificationCode)
        this.user = result.user
        this.$emit('login', result.user)
        this.recaptchaVerifier = null
        this.confirmationResult = null
        this.result = null
        this.waitingVerify = false
        this.$bvModal.hide(this.name)
      }
    }
  }
</script>
