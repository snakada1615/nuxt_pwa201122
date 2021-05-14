<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row >
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
  import {makeToast} from "@/plugins/pouchHelper";

  /**
   * Component to calculate nutrition balance of combined food
   * @module feasibilityCheck
   * @author shunichi nakada
   * @vue-data {array} items - FCT records
   * @vue-data {array} itemsDRI - DRI records
   * @vue-data {Number} tabNumber - number of Tabs
   * @vue-data {Boolean} beforeInitialize - flag to check if initialization complete
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
        return this.$store.state.loginStatus === 1
      },
      currentCaseIds: function () {
        return this.$store.state.caseIdList
      }
    },
    watch: {
      loginChecked: async function () {
        let vm = this
        if (this.loginChecked) {
          vm.items = await this.$store.dispatch('loadFctFromPouch',
            {dbName: store.state.fctDb, url: store.state.cloudantUrl})
          vm.itemsDRI =  await vm.$store.dispatch('loadDriFromPouch',
            {dbName: store.state.driDb, url: store.state.cloudantUrl})

          vm.WS.feasibilityCases = JSON.parse(JSON.stringify(
            this.$store.state.feasibilityCases))
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
    async asyncData({store}){
      // fetch data if loginstatus == 1 (autologin complete in middleware pages.js)
      // this is true when moving from index.vue (no reload)
      let myItem = []
      let myitemsDRI = []
      let myWS = {}

      if (store.state.loginStatus !== 1) {
        return
      } else {
        myItem = await store.dispatch('loadFctFromPouch',
          {dbName: store.state.fctDb, url: store.state.cloudantUrl})
        myitemsDRI =  await store.dispatch('loadDriFromPouch',
          {dbName: store.state.driDb, url: store.state.cloudantUrl})

        myWS.feasibilityCases = JSON.parse(JSON.stringify(store.state.feasibilityCases))
        myWS.user = JSON.parse(JSON.stringify(store.state.user))
        myWS.caseId = store.state.caseId
        store.dispatch('setNow')
        myWS.saveDate = store.state.saveDate
      }
      return {
        items: await myItem,
        itemsDRI: await myitemsDRI,
        WS: myWS
      }
    },
    methods: {
      onUpdateDriId(){
        this.modifiedSignal('driid')
      },
      modifiedSignal(val) {
        //this.isEdited = true
        this.$store.dispatch('setEdit', true)
        console.log('modified:' + val)
      },
      async saveWS() {
        console.log(this.WS)
        const res1 = await this.$store.dispatch('saveFeasibilityToPouch', this.WS)
        if (res1) {
          this.$store.dispatch('setEdit', false)
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

