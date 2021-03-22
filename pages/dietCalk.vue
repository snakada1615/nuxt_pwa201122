<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row>
      <navigation-guard :form_dirty="$store.state.isEdited"/>
      <b-col>
        <b-button
          size="sm"
          :variant="colorFlag"
          @click="saveWS" class="my-2 float-right"
        >save workspace</b-button>
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
          {{diet}}
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

  /**
   * Component to calculate nutrition balance of combined food
   * @module dietCalk
   * @author shunichi nakada
   * @vue-data {array} items - FCT records
   * @vue-data {array} itemsDRI - DRI records
   * @vue-data {Number} tabNumber - number of Tabs
   * @vue-data {String} userDatabaseName - Table name of user info
   * @vue-data {array} userDb - array of DRI records
   * @vue-data {array} lastUser - array of DRI records
   * @vue-data {Object[]} WS - list of datasets for each page (1..10)
   * @vue-data {String} WS[].user - ID for current user
   * @vue-data {String} WS[].caseId - ID for specific workspace
   * @vue-data {String} WS[].dietCases - set of diet IDs selected
   * @vue-data {String} WS[].saveDate - last date&time saved user data
   * @vue-computed {String} colorFlag - color for saveButton
   * @vue-computed {String} currentCaseId - current Wrokspace
   * @vue-computed {Boolean} loginChecked - true if login completed
   */

  export default {
    components: {
      driTable,
      dietCalkComp,
      navigationGuard,
    },
    data() {
      return {
        /**
         * @data {Object[]} itemsDRI -list of DRI dataset
         */
        itemsDRI: [],
        items: [],
        tabNumber: 10,
        //userDatabaseName: 'userWorkSpace',
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
      colorFlag: function(){
        return this.$store.state.isEdited? 'warning' : 'success'
      },
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
      loginChecked: async function () {
        let vm = this
        if (this.loginChecked) {
          vm.items = await getFCT()
          vm.itemsDRI = await getDRI()

          const res = await vm.loadDietfromPouch()
          vm.WS.dietCases = JSON.parse(JSON.stringify(res))
          console.log('vm.WS.dietCases')
          console.log(vm.WS.dietCases)
          vm.WS.user = JSON.parse(JSON.stringify(this.$store.state.user))
          vm.WS.caseId = this.$store.state.caseId
          this.$store.dispatch('setNow')
          vm.WS.saveDate = this.$store.state.saveDate
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
      /**
       * emit modified signal
       * @param {String} val - indicate which DOM have changed
       */
      modifiedSignal(val) {
        //this.isEdited = true
        this.$store.dispatch('setEdit', true)
        console.log('modified:' + val)
      },
      /**
       * load list of Diet from PouchDB
       * @returns {Promise<unknown>}
       */
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
      /**
       * save list of diet to PouchDB
       * @param {Objects[]} record - array of diet dataset (WS[1..10])
       * @returns {Promise<unknown>}
       */
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
      /**
       * save overall working data to Pouch with userId, workSpace and timestamp
       * @returns {Promise<boolean>}
       */
      async saveWS() {
        const user = this.$store.state.user
        const res1 = await this.saveDietToPouch(this.WS)
        const res2 = await this.$store.dispatch('saveUserToLastuser',
          {user: this.$store.state.user, caseId: this.$store.state.caseId})
        console.log(res1)
        console.log(res2)
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
  }
</script>
