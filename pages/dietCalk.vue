<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-button variant="primary" @click="refreshScreen">refresh</b-button>
    <b-button variant="primary" @click="$store.dispatch('loadDietInfoFromPouch')">login</b-button>
    <b-container class="my-2 bg-info">
      <div>{{$store.state.user}}</div>
      <div>{{$store.state.caseId}}</div>
      <div>{{$store.getters.currentPouchID}}</div>
    </b-container>
    <b-row>
      <b-col>
        <b-button size="sm" variant="info"
                  @click="saveWorkSpace" class="float-right mx-2"
        >save current workspace
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-tabs lazy pills justified disabled="$store.state.isLoginChecked" content-class="mt-3">
        <b-tab v-for="(diet, index) in dietCases" :key="index" :title="String(index + 1)">
          <b-container class="my-2 bg-info">
            {{$store.state.dietCases[index]}}
          </b-container>
          <b-container class="my-2 bg-info">
            {{diet}}
          </b-container>
          <diet-calk-comp
            :fct-org="items"
            :dri-org="itemsDRI"
            :diet-case="diet"
            @changeTarget = "onTargetChanged"
            @changeRecepi = "onRecepiChanged"
          />
        </b-tab>
      </b-tabs>
    </b-row>
  </b-container>
</template>


<script>
  import driTable from "../components/organisms/driTable";
  import PouchDB from 'pouchdb'
  import {getPouchData, syncCloudant} from '@/plugins/pouchHelper'
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
        dietCases: [],
        userDatabaseName: 'userWorkSpace',
        userDb: null,
        caseId: 'first'
      }
    },
    computed: {
      currentUserComputed: function () {
        return this.$store.state.user
      },
      loginChecked: function () {
        return this.$store.state.isLoginChecked
      },
    },
    watch: {
      loginChecked: function () {
        this.refreshScreen()
      },
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      this.saveWorkSpace()
    },
    methods: {
      onTargetChanged(value){
        this.$store.dispatch('setDiet', this.dietCases)
      },
      onRecepiChanged(value){
        this.$store.dispatch('setRecepi', value)
      },
      refreshScreen(){
        const vm = this
        // conduct deep copy for store value
        vm.dietCases = JSON.parse(JSON.stringify(this.$store.state.dietCases))
        vm.user = JSON.parse(JSON.stringify(vm.currentUserComputed))
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
      saveWorkSpace() {
        console.log('saveWorkSpace')
        console.log(this.dietCases)
        this.$store.dispatch('setDiet', this.dietCases)
        this.$store.dispatch('saveInfoPouch')
      },
      saveDiet(db, index) {
        const vm = this
        const id = this.$store.state.user.email + index
        console.log(index)
        console.log(vm.dietCases[index])
        let promise = new Promise((resolve) => {
          db.get(id).then(function (doc) {
            vm.dietCases[index]._rev = doc._rev
            doc = vm.dietCases[index]
            db.put(doc).then(function (res) {
              console.log('record-id [' + id + '] has been updated')
              resolve(true)
            })
          }).catch(function (e) {
            db.put(vm.dietCases[index]).then(function (res) {
              console.log('new record [' + id + '] has been saved')
              resolve(true)
            })
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
      //window.addEventListener("beforeunload", this.saveDietAll(this.tabNumber - 1));
    },
  }
</script>
