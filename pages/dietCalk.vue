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
            :dri-id.sync="diet.driID"
            :food-items.sync="diet.foodItems"
            :page-id="index"
            :_id="diet._id"
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
  import dietCalkComp from "../components/organisms/dietCalkComp";
  import navigationGuard from "../components/atoms/navigationGuard";
  import {getFCT, getDRI} from "../plugins/pouchHelper";

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
        return this.$store.state.loginStatus === 1
      },
    },
    watch: {
      loginChecked: async function () {
        let vm = this
        if (vm.loginChecked) {
          vm.items = await getFCT()
          vm.itemsDRI = await getDRI()

          const res = await vm.$store.dispatch('loadDietfromPouch')
          vm.WS.dietCases = JSON.parse(JSON.stringify(res))
          vm.WS.user = JSON.parse(JSON.stringify(vm.$store.state.user))
          vm.WS.caseId = vm.$store.state.caseId
          vm.$store.dispatch('setNow')
          vm.WS.saveDate = vm.$store.state.saveDate
        }
      },
      currentCaseId: function (value) {
        this.WS.caseId = value
      },
    },
    beforeDestroy() {
      console.log('beforeDestroy')
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
        myItem =  getFCT()
        myitemsDRI =  getDRI()

        store.dispatch('setNow')
        const res = await store.dispatch('loadDietfromPouch')

        myWS.dietCases = JSON.parse(JSON.stringify(res))
        myWS.user = JSON.parse(JSON.stringify(store.state.user))
        myWS.caseId = store.state.caseId
        myWS.saveDate = store.state.saveDate
      }
      return {
        items: await myItem,
        itemsDRI: await myitemsDRI,
        WS: myWS
      }
    },
    methods: {
      delRecepiItem(id){
        console.log(id)
        let res = []
        this.dietCase.foodItems.forEach(function (val, index) {
          if (index !== id) {
            res.push(val)
          }
        })
        console.log(res)
        this.dietCase.foodItems = res
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
