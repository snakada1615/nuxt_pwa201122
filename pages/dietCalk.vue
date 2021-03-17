<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row>
      <navigation-guard :form_dirty="$store.state.isEdited"/>
      <b-col>
        <b-button size="sm" variant="warning" @click="saveWS" class="mb-2 float-right">save workspace</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-tabs lazy pills justified disabled="$store.state.isLoginChecked" content-class="mt-3">
        <b-tab v-for="(diet, index) in WS.dietCases" :key="index" :title="String(index + 1)">
          <diet-calk-comp
            :fct-org="items"
            :dri-org="itemsDRI"
            :diet-case="diet"
            @changeTarget="modifiedSignal('target')"
            @changeRecepi="modifiedSignal('recepi')"
          />
        </b-tab>
      </b-tabs>
    </b-row>
  </b-container>
</template>


<script>
  import driTable from "../components/organisms/driTable";
  import PouchDB from 'pouchdb'
  import {pouchWSPutNewOrUpdate} from '@/plugins/pouchHelper'
  import dietCalkComp from "../components/organisms/dietCalkComp";
  import navigationGuard from "../components/atoms/navigationGuard";
  import {pouchGetDoc} from "../plugins/pouchHelper";
  import {getFCT, getDRI} from "../plugins/pouchHelper";
  //import {state} from "../store";

  export default {
    components: {
      driTable,
      dietCalkComp,
      navigationGuard,
    },
    data() {
      return {
        itemsDRI: [],
        items: [],
        tabNumber: 10,
        userDatabaseName: 'userWorkSpace',
        userDb: null,
        lastUser: 'lastUser',
        WS: {
          caseId: 'case01',
          dietCases: [],
          user: '',
          saveDate: '',
        },
      }
    },
    computed: {
      currentCaseId: function () {
        return this.$store.state.caseId
      },
      loginChecked: function () {
        return this.$store.state.isLoginChecked
      },
      currentCaseIds: function () {
        return this.$store.state.caseIdList
      }
    },
    watch: {
      loginChecked: function () {
        let vm = this
        if (this.loginChecked) {
          vm.loadDietfromPouch().then(function (res) {
            vm.WS.dietCases = JSON.parse(JSON.stringify(res))
            vm.refreshScreen()
          })
        }
      },
      currentCaseId: function (value) {
        this.WS.caseId = value
      },
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      //this.saveWS()
    },
    methods: {
      modifiedSignal(val) {
        //this.isEdited = true
        this.$store.dispatch('setEdit', true)
        console.log('modified:' + val)
      },
      refreshScreen() {
        const vm = this
        // conduct deep copy for store value
        //vm.WS.dietCases = this.loadDietfromPouch()
        vm.WS.user = JSON.parse(JSON.stringify(this.$store.state.user))
        vm.WS.caseId = this.$store.state.caseId
        this.$store.dispatch('setNow')
        vm.WS.saveDate = this.$store.state.saveDate
      },
      loadDietfromPouch() {
        let db = new PouchDB(this.$store.state.userDB)
        const id = this.$store.getters.currentPouchID
        const iCount = this.$store.state.tabNumber
        let currentDiet = {}
        let promise = new Promise((resolve) => {
          pouchGetDoc(db, this.$store.getters.currentPouchID).then(function (doc) {
            currentDiet = doc.dietCases
            resolve(currentDiet)
          }).catch(function (err) {
            console.log('no data exists in PouchDB')
            resolve(err)
          })
        })
        return promise
      },
      saveDietToPouch(record) {
        console.log('saveDietToPouch')
        const db = new PouchDB(this.$store.state.userDB)
        this.$store.dispatch('setNow')
        record.saveDate = this.$store.state.saveDate
        record._id = this.$store.getters.currentPouchID
        let promise = new Promise(async (resolve) => {
          console.log(record)
          const res = await pouchWSPutNewOrUpdate(db, record, 'diet')
          if (res) {
            resolve(res)
          } else {
            resolve(false)
          }
        })
        return promise
      },
      async saveWS() {
        console.log(this.$store.state)
        const user = this.$store.state.user
        const res1 = await this.saveDietToPouch(this.WS)
        const res2 = await this.$store.dispatch('saveUserToLastuser',
          {user: this.$store.state.user, caseId: this.$store.state.caseId}).catch((err)=>err)
        if (res1 && res2) {
          this.$store.dispatch('setEdit', false)
          await this.$store.dispatch('loadCaseListFromPouch')
          console.log('WS saved')
          return true
        } else {
          console.log('encountered error to save current WS to pouchDB')
          return false
        }
      },
    },
    destroyed() {
//      console.log('destroyed')
//      alert('destroy')
//      window.removeEventListener("beforeunload", this.sayHello);
    },
    created() {
//      console.log('created')
//      window.addEventListener("beforeunload", this.sayHello)
    },
    mounted() {
      const vm = this
      getFCT().then(function (dat) {
        vm.items = dat
      })
      getDRI().then(function (dat) {
        vm.itemsDRI = dat
      })
    },
  }
</script>
