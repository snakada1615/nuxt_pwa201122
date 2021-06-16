<template>
  <b-container>
    <b-modal :id="id" :static="true" hide-footer
             :title="modalTitle" header-bg-variant="info">
      <div v-show="state==='startLogin'">
        <div class="mb-2">please send your mobile number. You will then, get confirmation code through SMS</div>
        <vue-phone-number-input
          v-model="localNumber"
          @update="numberUpdate"
        ></vue-phone-number-input>
        <button id='linkPhoneNumberBtn'
                @click="sendSmsVerification"
                :disabled="!statePhoneNUmber"
                class="mt-2"
        >send</button>
      </div>

      <div v-show="state==='waitingVerify'">
        <div class="mb-2">please send verification code you got from SMS</div>
        <b-form-input
          v-model='verificationCode'
          placeholder="******"
          type="number"
          class="my-2"/>
        <button @click="passCodeVerification" class="my-2">send</button>
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
  import VuePhoneNumberInput from  'vue-phone-number-input'
  import 'vue-phone-number-input/dist/vue-phone-number-input.css'

  export default {
    components:{
      VuePhoneNumberInput,
    },
    props:{
      id: {
        type: String,
        required: true,
      },
      uid:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        phoneNumber:'',
        localNumber:'',
        statePhoneNUmber: false,
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
      numberUpdate(val){
        if (val.formattedNumber){
          this.phoneNumber = val.formattedNumber
          this.statePhoneNUmber = val.isValid
        }
      },
      async sendSmsVerification() {
        try {
          this.confirmationResult = await firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier)
          this.waitingVerify = true
        } catch(error) {
          console.error(error)
        }
      },
      async passCodeVerification() {
        try {
          const result = await this.confirmationResult.confirm(this.verificationCode)
          console.log(result.user)
          this.$emit('update:uid', result.user.uid)
          this.$emit('loginSuccess', result.user)
          this.recaptchaVerifier = null
          this.confirmationResult = null
          this.result = null
          this.waitingVerify = false
        } catch (err) {
          alert(err)
        }
        this.$bvModal.hide(this.id)
      }
    }
  }
</script>
