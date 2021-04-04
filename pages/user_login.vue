<template>
  <div class="container" style="max-width: 540px">
    <p>current user: <span v-if="$store.state.user">{{ $store.state.user.email }}</span></p>
    {{ email }}
    <b-form @submit.prevent>
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
      <b-row class="mt-3">
        <b-col>
          <p>current FileName: <span v-if="$store.state.caseId">{{ $store.state.caseId }}</span></p>
          <b-input-group size="sm">
            <b-form-input
              v-model="fileName"
              type="text"
              id="input_filename"
              placeholder="file name"
              :state="fileNameValidator"
            ></b-form-input>
            <template #append>
              <b-dropdown text="Dropdown" variant="info" size="sm">
                <b-dropdown-item
                  v-for="caseId in caseIdList"
                  :key="caseId.caseId"
                  :value="caseId.caseId"
                  @click="fileName = caseId.caseId"
                >{{ caseId.caseId }}
                </b-dropdown-item>
              </b-dropdown>
              <b-button variant="warning" :disabled="!fileName" @click="fileName = ''">clear</b-button>
            </template>
          </b-input-group>
          <p>please specify file name to store your work record</p>
        </b-col>
      </b-row>
      <b-row class="my-2 mt-4">
        <b-col>
          <b-button @click="login()" variant="primary" size="sm">login</b-button>
          <b-button @click="registUser" variant="primary" size="sm">new user</b-button>
          <b-button @click="logout()" size="sm">logout</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
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
      fileName: '',
    }
  },
  computed: {
    caseIdList: function () {
      return this.$store.state.caseIdList
    },
    fileNameValidator: function () {
      return this.fileName.length > 3 ? true : false
    },
    isNewFileName: function () {
      return this.fileName
    }
  },
  methods: {
    async login() {
      const vm = this
      console.log('vm.caseIdList')
      const res = await vm.$store.dispatch('login', {
        email: vm.email,
        password: vm.password,
      })
      if (res) { // successfully logged in using firebase
        //update $store
        vm.$store.dispatch('setUser', {
          'email': res.email,
          'uid': res.uid
        })

        //update $store
        vm.$store.dispatch('setCaseId',
          vm.fileName
        )

        //update PouchDB-lastUser
        await vm.$store.dispatch('saveUserToLastuser', {user: vm.$store.state.user, caseId: vm.$store.state.caseId})

        //check if caseId is already registered to PouchDB
        const res2 = vm.caseIdList.filter(function(val){
          return val.caseId === vm.$store.state.caseId && val.user === vm.$store.state.user
        })
        if (res2.length === 0) {
          await vm.$store.dispatch('initPouch', {user: vm.$store.state.user, caseId: vm.$store.state.caseId})

          //move to top page
          console.log('gotoindex')
          vm.email = ''
          vm.password = ''
          vm.$router.push('/')
        } else {

          //move to top page
          console.log('gotoindex2')
          vm.email = ''
          vm.password = ''
          vm.$router.push('/')
        }
      }
    },
    logout() {
      this.$store.dispatch('logout')
      this.email = ''
      this.password = ''
      this.$router.push('/')
    },
    async registUser() {
      const res = await this.$store.dispatch('registUser', {
        email: this.email,
        password: this.password,
        caseId: this.fileName
      })
      this.email = ''
      this.password = ''
      this.fileName = ''
      if (res) {
        this.$router.push('/')
      }
    },
    DBexists(targetDB) {
      window.indexedDB.databases().then((namelist) => {
        let res = false
        for (let i = 0; i < namelist.length; i++) {
          if (namelist[i].name === targetDB) {
            res = true
          }
        }
        console.log(res)
      })
    }
  }
}
</script>
