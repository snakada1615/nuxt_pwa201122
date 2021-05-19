<template>
  <b-container class="py-1" style="max-width: 540px; min-width: 530px;">
    <h6 class="text-danger">this function is to copy basic data to remote server when new server installed</h6>
    <b-form-checkbox v-model="isRemodeDb_Couch" name="showCouchSwitch" switch>
      is remote Db couchDb or Cloudant <b>(Checked: {{ isRemodeDb_Couch }})</b>
    </b-form-checkbox>
    <div v-if="!saveComplete">
      <b-card
        class="my-2"
        bg-variant="light"
      >
        <b-card-title>Set database info</b-card-title>
        <div v-if="isRemodeDb_Couch">
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
        </div>
        <div v-if="!isRemodeDb_Couch">
          <b-row class="my-2">
            <b-col cols="3">cloudant url</b-col>
            <b-col cols="9">
              <b-form-input
                v-model="ipCloudant"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-button
                class="my-1"
                variant="info"
                size="sm"
                @click="clickOkCloudant"
              >save info</b-button>
            </b-col>
          </b-row>
        </div>
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
        saveComplete: false,
        ipCloudant:'',
        isRemodeDb_Couch: true,
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
        console.log('no couchdb info set')
        //throw err
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
      clickOkCloudant(){
        console.log(this.ipCloudant)
        const urlOrg = "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud"
        this.$store.dispatch('replicateBaseData2', {
          urlFrom: urlOrg,
          urlTo: this.ipCloudant,
          dbList: ['userlist', 'dri', 'fct_org', 'fctlist_db']
        })
      },
    }
  };
</script>
