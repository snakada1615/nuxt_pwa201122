<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row >
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
      <b-tabs lazy pills justified disabled="beforeInitialize" content-class="mt-3">
        <b-tab v-for="(feasibilityCase, index) in WS.feasibilityCases" :key="index" :title="String(index + 1)">
          <feasibility-check-component
            :dri-org="itemsDRI"
            :fct-org="items"
            :dri-id.sync="feasibilityCase.driID"
            :selected-item.sync="feasibilityCase.selectedItem"
            :ans-list="feasibilityCase.ansList"
            @ansListChange="modifiedSignal('ansList')"
            @update:driId="modifiedSignal('driId')"
            @update:selectedItem="modifiedSignal('crop')"
          />
        </b-tab>
      </b-tabs>
    </b-row>
  </b-container>
</template>

<script>
  import feasibilityCheckComponent from "@/components/organisms/feasibilityCheckComponent";
  import {getDRI, getFCT, pouchGetDoc, pouchWSPutNewOrUpdate} from "@/plugins/pouchHelper";
  import PouchDB from "pouchdb";

  export default {
    components:{
      feasibilityCheckComponent
    },
    data(){
      return{
        items:[],
        itemsDRI: [],
        tabNumber: 10,
        beforeInitialize: true,
        WS: {
          feasibilityCases: [],
          caseId: 'case01',
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

          const res = await vm.loadFeasibilityCasefromPouch()
          vm.WS.feasibilityCases = JSON.parse(JSON.stringify(res))
          vm.WS.user = JSON.parse(JSON.stringify(this.$store.state.user))
          vm.WS.caseId = this.$store.state.caseId
          this.$store.dispatch('setNow')
          vm.WS.saveDate = this.$store.state.saveDate

          vm.beforeInitialize = false  // start rendering from here
          //vm.refreshScreen()
        }
      },
      currentCaseId: function (value) {
        this.WS.caseId = value
      },

    },
    methods: {
      modifiedSignal(val) {
        //this.isEdited = true
        this.$store.dispatch('setEdit', true)
        console.log('modified:' + val)
      },
      loadFeasibilityCasefromPouch() {
        let db = new PouchDB(this.$store.state.userDB)
        let currentFeasibilityCases = {}
        let promise = new Promise((resolve) => {
          pouchGetDoc(db, this.$store.getters.currentPouchID).then(function (doc) {
            currentFeasibilityCases = doc.feasibilityCases
            resolve(currentFeasibilityCases)
          }).catch(function (err) {
            console.log('no data exists in PouchDB')
            resolve(err)
          })
        })
        return promise
      },
      saveFeasibilityToPouch(record) {
        console.log('saveFeasibilityToPouch')
        const db = new PouchDB(this.$store.state.userDB)
        this.$store.dispatch('setNow')
        record.saveDate = this.$store.state.saveDate
        record._id = this.$store.getters.currentPouchID
        let promise = new Promise(async (resolve) => {
          const res = await pouchWSPutNewOrUpdate(db, record, 'feasibility')
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
        const res1 = await this.saveFeasibilityToPouch(this.WS)
        const res2 = await this.$store.dispatch('saveUserToLastuser',
          {user: this.$store.state.user, caseId: this.$store.state.caseId})
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
  }
</script>

