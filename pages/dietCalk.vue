<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row>
      <navigation-guard :form_dirty="$store.state.isEdited"/>
      <b-col>
        <b-button
          size="sm"
          :variant="colorFlag"
          @click="saveWS" class="my-2 float-right"
        >save workspace
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-tabs lazy pills justified disabled="$store.state.isLoginChecked" content-class="mt-3">
        <b-tab v-for="(diet, index) in WS.dietCases" :key="index" :title="String(index + 1)">
          <diet-calk-component
            :fct-org="items"
            :dri-org="itemsDRI"
            :target="diet.target"
            :target-switch="diet.targetSwitch"
            :max-pop="diet.maxPop"
            :food-items.sync="diet.foodItems"
            :page-id="index"
            :_id="diet._id"
            @targetSwitchChange="diet.targetSwitch = $event"
            @changeTarget="modifiedTarget($event, index)"
            @changeRecepi="modifiedSignal('recepi')"
          />
        </b-tab>
      </b-tabs>
    </b-row>
  </b-container>
</template>


<script>
  import dietCalkComponent from "../components/organisms/dietCalkComponent";
  import navigationGuard from "../components/atoms/navigationGuard";

  export default {
    components: {
      dietCalkComponent,
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
          fctDb: '',
        },
      }
    },
    computed: {
      colorFlag: function () {
        return this.$store.state.isEdited ? 'warning' : 'success'
      },
      currentCaseId: function () {
        return this.$store.state.caseId
      },
      loginChecked: function () {
        return this.$store.state.loginStatus === 1
      },
    },
    watch: {
      loginChecked: async function () {
        let vm = this
        if (vm.loginChecked) {
          try {
            vm.items = await vm.$store.dispatch('loadFctFromPouch',
              {dbName: vm.$store.state.fctDb, url: vm.$store.state.cloudantUrl})
            vm.itemsDRI = await vm.$store.dispatch('loadDriFromPouch',
              {dbName: 'dri', url: vm.$store.state.cloudantUrl})

            vm.WS.dietCases = JSON.parse(JSON.stringify(vm.$store.state.dietCases))
            vm.WS.user = JSON.parse(JSON.stringify(vm.$store.state.user))
            vm.WS.caseId = vm.$store.state.caseId
            vm.$store.dispatch('setNow')
            vm.WS.saveDate = vm.$store.state.saveDate
            vm.WS.fctDb = vm.$store.state.fctDb
          } catch (err) {
            vm.$nuxt.error(err)
          }
        }
      },
      currentCaseId: function (value) {
        this.WS.caseId = value
      },
    },
    beforeDestroy() {
      console.log('beforeDestroy')
    },
    async asyncData({store}) {
      // fetch data if loginstatus == 1 (autologin complete in middleware pages.js)
      // this is true when moving from index.vue (no reload)
      let myItem = []
      let myItemsDRI = []
      let myWS = {}

      if (store.state.loginStatus !== 1) {
        return
      } else {
        //myItem = getFCT(store.state.fctDb)
        myItem = await store.dispatch('loadFctFromPouch',
          {dbName: store.state.fctDb, url: store.state.cloudantUrl})
        myItemsDRI = await store.dispatch('loadDriFromPouch',
          {dbName: store.state.driDb, url: store.state.cloudantUrl})

        store.dispatch('setNow')

        myWS.dietCases = JSON.parse(JSON.stringify(store.state.dietCases))
        myWS.user = JSON.parse(JSON.stringify(store.state.user))
        myWS.caseId = store.state.caseId
        myWS.saveDate = store.state.saveDate
        myWS.fctDb = store.state.fctDb
      }
      return {
        items: await myItem,
        itemsDRI: await myItemsDRI,
        WS: myWS
      }
    },
    methods: {
      modifiedTarget(val, index) {
        this.WS.dietCases[index].target = JSON.parse(JSON.stringify(val))
        console.log('setedit:modifiedTarget')
        this.$store.dispatch('setEdit', true)
      },
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
       * save overall working data to Pouch with userId, workSpace and timestamp
       * @returns {Promise<boolean>}
       */
      async saveWS() {
        const res1 = await this.$store.dispatch('saveDietToPouch', this.WS)
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
