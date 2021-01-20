<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <b-row>
      <b-col>
        <b-button size="sm" variant="warning"
                  @click="saveWorkSpace" class="float-right mx-2"
        >save to Store
        </b-button>
        <b-button size="sm" variant="warning"
                  @click="saveToPouch" class="float-right"
        >save current workspace
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-tabs lazy pills justified disabled="$store.state.isLoginChecked" content-class="mt-3">
        <b-tab v-for="(diet, index) in dietCases" :key="index" :title="String(index + 1)">
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
  import {getPouchData, syncCloudant} from '@/plugins/pouchHelper'
  import dietCalkComp from "../components/organisms/dietCalkComp";
  import {objectSort} from "../plugins/helper";

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
      loginChecked: function () {
        return this.$store.state.isLoginChecked
      },
    },
    watch: {
      loginChecked: function (value) {
        const vm = this
        if (value) {
          vm.dietCases = this.$store.state.dietCases
          vm.user = this.$store.state.user
        }
      },
    },
    methods: {
      sortMe() {
        objectSort(this.dietCases, 'pageId')
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
        if (!this.loginChecked) {
          return
        }
        this.$store.dispatch('setDiet', this.dietCases)
        console.log('save work space ')
      },
      saveDietAll(counter) {
        if (!this.loginChecked) {
          return
        }
        const vm = this
        vm.saveDiet(vm.userDb, counter).then(function () {
          if (counter > 0) {
            vm.saveDietAll(counter - 1)
          }
        })
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
      saveToPouch() {
        this.$store.dispatch('saveUserInfo')
      },
      beforeRouteLeave(to, from, next) {
        console.log('moving')
        this.saveWorkSpace()
        next()
      },
      destroyed() {
        window.removeEventListener("beforeunload", this.saveDietAll(this.tabNumber - 1));
      },
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
      window.addEventListener("beforeunload", this.saveDietAll(this.tabNumber - 1));
    },
  }
</script>
