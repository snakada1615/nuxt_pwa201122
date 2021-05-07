<template>
  <b-container class="py-1">
    <h6 class="text-danger">this function is only for Rwanda version</h6>
    <div v-if="!saveComplete">
      <b-card
        class="my-2"
        bg-variant="light"
      >
        <b-card-title>Set database info</b-card-title>
        <b-row class="my-2">
          <b-col cols="3">user</b-col>
          <b-col cols="9">
            <b-form-input
              v-model="user"
              :state="stateUser"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">pass</b-col>
          <b-col cols="9">
            <b-form-input
              v-model="pass"
              :state="statePass"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">ip</b-col>
          <b-col cols="9">
            <b-form-input
              v-model="ip"
              :state="stateIp"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-button
              class="my-1"
              variant="info"
              size="sm"
              :disabled="!stateAll"
              @click="clickOk"
            >save info</b-button>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <div v-if="saveComplete">
      data successfully saved!
    </div>
  </b-container>
</template>

<script>

  export default {
    data(){
      return{
        user:'',
        pass:'',
        ip:'',
        saveComplete: false
      }
    },
    computed:{
      stateUser(){
        return (/^[a-zA-Z][a-zA-Z-.,_]{1,16}[a-zA-Z]{1,3}$/).test(this.user)
      },
      statePass(){
        return (/^[a-zA-Z0-9+-/*/]{6,20}$/).test(this.pass)
      },
      stateIp(){
        return (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/).test(this.ip)
      },
      stateAll(){
        return (this.stateUser && this.statePass && this.stateIp)
      },
      myUrl(){
        return  "http://" + this.ip + ":5984/"
      }
    },
    mounted(){
      const vm = this
      vm.$store.dispatch('loadCouchUrl').then(function (doc) {
        vm.user = doc.user
        vm.pass = doc.pass
        vm.ip = doc.ip
      }).catch((err)=>{
        console.log(err)
        throw err
      })
    },
    methods:{
      async clickOk(){
        const vm = this
        try {
          await vm.$store.dispatch('replicateBaseData', {
            user: vm.user,
            pass: vm.pass,
            ip: vm.ip
          })
          await vm.$store.dispatch('saveCouchUrl',{
            user: vm.user,
            pass: vm.pass,
            ip: vm.ip
          })
          vm.saveComplete = true
        } catch (err) {
          this.$nuxt.error(err)
        }
      },
    }
  };
</script>
