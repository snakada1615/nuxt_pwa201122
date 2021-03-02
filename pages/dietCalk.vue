<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row>
      <navigation-guard :form_dirty="$store.state.isEdited"/>
      <b-col>
        <b-button size="sm" variant="warning" @click="saveWS" class="mb-2 float-right">save workspace</b-button>
      </b-col>
    </b-row>
    <b-button size="sm" variant="success" v-b-toggle:showVariable class="mb-2">
      <span class="when-open">Close</span><span class="when-closed">Open</span>
    </b-button>
    <b-collapse class="mb-2" id="showVariable">
      <b-row>
        <b-col>
          <b-card>
            <b-card-body body-bg-variant="success" body-text-variant="light">
              <div>cases: {{currentCaseIds}}</div>
              <div>user: {{WS.user.email}}</div>
              <div>date: {{WS.saveDate}}</div>
              <div>case: {{WS.caseId}}</div>
              <div>case: {{currentCaseId}}</div>
              <div>diets: {{WS.dietCases[0]}}</div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-collapse>
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
  import {getPouchData, syncCloudant, pouchPutNewOrUpdate} from '@/plugins/pouchHelper'
  import dietCalkComp from "../components/organisms/dietCalkComp";
  import navigationGuard from "../components/atoms/navigationGuard";

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
        vm.getDietfromPouch().then(function (res) {
          vm.WS.dietCases = JSON.parse(JSON.stringify(res))
          vm.refreshScreen()
        })
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
        //vm.WS.dietCases = this.getDietfromPouch()
        vm.WS.user = JSON.parse(JSON.stringify(this.$store.state.user))
        vm.WS.caseId = this.$store.state.caseId
        vm.WS.saveDate = this.$store.state.saveDate
        console.log(vm.WS.caseId)
        console.log(vm.WS.saveDate)
      },
      async getDietfromPouch() {
        const res = await this.$store.dispatch('loadDietInfoFromPouch').catch((err) => err)
        return res
      },
      setFTC(docs) {
        let res = []
        docs.forEach(function (val, index) {
          res.push({
            'id': val.doc.food_item_id,
            'Group': val.doc.food_group_unicef,
            'Name': val.doc.Food_name,
            'En': val.doc.Energy,
            'Pr': val.doc.Protein,
            'Va': val.doc.VITA_RAE,
            'Fe': val.doc.FE
          })
        })
        return res
      },
      setDRI(docs) {
        let res = []
        docs.forEach(function (val) {
          res.push({
            'id': val.key,
            'Name': val.doc.nut_group,
            'En': val.doc.energy,
            'Pr': val.doc.protein,
            'Va': val.doc.vita,
            'Fe': val.doc.fe,
            'number': 0
          })
        })
        return res
      },
      async saveWS() {
        console.log(this.$store.state)
        const user = this.$store.state.user
        const res1 = await this.$store.dispatch('saveDietToPouch', this.WS).catch((err)=>err)
        const res2 = await this.$store.dispatch('saveUserToLastuser',
          {user: this.$store.state.user, caseId: this.$store.state.caseId}).catch((err)=>err)
        console.log('user:'+ user)
        console.log('caseid:'+ this.$store.state.caseId)
        if (res1 && res2) {
          this.$store.dispatch('setEdit', false)
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
      const vm = this;
      const fct = new PouchDB('fct');
      const dri = new PouchDB('dri');
      vm.userDb = new PouchDB(vm.userDatabaseName)
      const idToast1 = this.makeToast('start fetching')
      fct.info().then(function (info) {
        if (!(info.doc_count)) {
          const idToast2 = vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          syncCloudant('fct').then(dataset => {
            getPouchData(dataset).then(docs => {
              vm.items = vm.setFTC(docs)
              vm.hideToast(idToast2)
            })
          })
        } else {
          getPouchData(fct).then(docs => {
            vm.items = vm.setFTC(docs)
          })
        }
      }).then(
        dri.info().then(function (info) {
          if (!(info.doc_count)) {
            const idToast2 = vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
            syncCloudant('dri').then(dataset => {
              getPouchData(dataset).then(docs => {
                vm.itemsDRI = vm.setDRI(docs)
                vm.hideToast(idToast2)
                vm.hideToast(idToast1)
              })
            })
          } else {
            getPouchData(dri).then(docs => {
              vm.itemsDRI = vm.setDRI(docs)
              vm.hideToast(idToast1)
            })
          }
        })
      )
      //window.addEventListener("beforeunload", this.saveWSAll(this.tabNumber - 1));
    },
  }
</script>
