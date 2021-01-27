<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row>
      <div>isEdited:{{isEdited}}</div>
      <div>user:{{WS.user}}</div>
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

  export default {
    components: {
      driTable,
      dietCalkComp,
    },
    data() {
      return {
        itemsDRI: [],
        items: [],
        tabNumber: 10,
        userDatabaseName: 'userWorkSpace',
        userDb: null,
        WS: {
          caseId: 'case01',
          dietCases: [],
          user: '',
        },
        isEdited: false,
      }
    },
    computed: {
      currentUserComputed: function () {
        return this.$store.state.user
      },
      loginChecked: function () {
        return this.$store.state.isLoginChecked
      },
      dietStatus: function (){
        return this.WS.dietCases
      },
      userStatus: function (){
        return this.WS.user
      },
    },
    watch: {
      loginChecked: function () {
        this.refreshScreen()
      },
      dietStatus: function (){
        this.isEdited = true
      },
      userStatus: function (){
        this.isEdited = true
      },
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      //this.saveWS()
    },
    methods: {
      refreshScreen() {
        const vm = this
        // conduct deep copy for store value
        vm.WS.dietCases = JSON.parse(JSON.stringify(this.$store.state.dietCases))
        vm.WS.user = JSON.parse(JSON.stringify(vm.currentUserComputed))
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
      saveWS() {
        const vm = this
        const db = new PouchDB(vm.userDatabaseName)
        vm.WS._id = this.$store.getters.currentPouchID
        let promise = new Promise((resolve, reject) => {
          pouchPutNewOrUpdate(db, vm.WS).then(function (res) {
            if (res){
              vm.isEdited = false
              resolve(true)
            } else {
              reject(false)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
        return promise
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
