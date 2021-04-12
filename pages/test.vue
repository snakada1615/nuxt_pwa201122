<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card bg-variant="gray-300" class="mt-3 mb-2">
          <b-form-group label="login option" class="my-0">
            <b-form-radio v-model="loginOption" value="1">
              <b-icon icon="envelope"/>
              email
            </b-form-radio>
            <b-form-radio v-model="loginOption" value="2">
              <b-icon icon="chat-dots-fill"/>
              SMS
            </b-form-radio>
            <b-form-radio v-model="loginOption" value="3">
              <b-icon icon="google"/>
              Google
            </b-form-radio>
            <b-form-radio v-model="loginOption" value="4">
              <b-icon icon="twitter"/>
              Twitter
            </b-form-radio>
            <b-form-radio v-model="loginOption" value="5">
              <b-icon icon="facebook"/>
              Facebook
            </b-form-radio>
          </b-form-group>
        </b-card>
        <b-card bg-variant="gray-300" class="mt-1 mb-2">
          <b-row class="my-1">
            <b-col cols="3">Name:</b-col>
            <b-col cols="9">
              <b-form-input
                id="nameInput"
                v-model="userName"
                placeholder="your name"
                size="sm"
                :state="nameState"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Country:</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput"
                v-model="userCountry"
                placeholder="country"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Aera1:</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput2"
                v-model="userSubNational1"
                placeholder="Area1"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Area2:</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput3"
                v-model="userSubNational2"
                placeholder="Area2"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Organization:</b-col>
            <b-col cols="9">
              <b-form-input
                id="organizationInput"
                v-model="userOrgainzation"
                placeholder="your organization"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Title:</b-col>
            <b-col cols="9">
              <b-form-input
                id="titleInput"
                v-model="userTitle"
                placeholder="your title"
                size="sm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <span>
          <b-button variant="success" @click="test" :disabled="!loginReady">login</b-button>
          <b-button variant="success" @click="test" :disabled="!isLogin">logout</b-button>
        </span>
      </b-col>
    </b-row>
    <login-sms name="loginSms"/>
    <login-email name="loginEmail"/>
    {{isLogin}}
    {{loginOption}}
    {{nameState}}
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms"
  import loginEmail from "@/components/molecules/loginEmail"

  export default {
    components: {
      loginSms,
      loginEmail
    },
    data() {
      return {
        loginOption: 0,
        userName: '',
        userCountry: '',
        userSubNational1: '',
        userSubNational2: '',
        userSubNational3: '',
        userOrgainzation: '',
        userTitle: '',
      }
    },
    computed: {
      isLogin() {
        return (this.$store.state.user.uid !== '')
      },
      loginReady(){
        return (!this.isLogin && this.loginOption > 0 && this.nameState)
      },
      nameState() {
        return (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).test(this.userName)
      },
      countryState() {
        return (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).test(this.userName)
      }
    },
    methods: {
      test(val) {
        this.$store.dispatch('loginProvider', val).then(function (val) {
          console.log(val)
          console.log(val.email)
          console.log(val.user)
        })
      },
      logout() {
        this.$store.dispatch('logout')
        this.email = ''
        this.password = ''
        this.$router.push('/')
      },
    },
  }
</script>

