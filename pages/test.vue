<template>
  <b-container>
    <div>
      <b-tabs v-show="$store.state.isLoginChecked" content-class="mt-3">
        <b-tab v-for="index in tabNumber" :key="index" :title="String(index)">
          <p>I'm the {{ index }} tab and login state is {{ loginEmail }}</p>
          <div>diet case: {{ dietCases[Number(index - 1)] }}</div>
          <b-button variant="primary" @click="saveDiet(index-1)">save</b-button>
          <b-button variant="primary" @click="loadDiet(dietCases, index-1)">load</b-button>
          <diet-calk-comp
            :fct-org="items"
            :dri-org="itemsDRI"
            :diet-case="dietCases[Number(index-1)]"
          />
        </b-tab>
      </b-tabs>
    </div>
  </b-container>
</template>

<script>
import dietCalkComp from "@/components/organisms/dietCalkComp";
import PouchDB from "pouchdb";
import {getPouchData, syncCloudant} from '@/plugins/pouchHelper'

export default {
  components: {
    dietCalkComp
  },
  data() {
    return {
      items: [],
      itemsDRI: [],
      pageId: 5,
      tabNumber: 10,
      dietCases: [],
    }
  },
  mounted() {
    console.log('mounted: new!!!')
    const fct = new PouchDB('fct');
    const dri = new PouchDB('dri');
    const vm = this;
    const idToast1 = this.makeToast('start fetching')
    fct.info().then(function (info) {
      if (!(info.doc_count)) {
        const idToast2 = vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
        syncCloudant('fct').then(dataset => {
          getPouchData(dataset).then(docs => {
            vm.setFTC(docs)
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
              vm.setDRI(docs)
              vm.hideToast(idToast2)
              vm.hideToast(idToast1)
            })
          })
        } else {
          getPouchData(dri).then(docs => {
            vm.setDRI(docs)
            vm.hideToast(idToast1)
          })
        }
      })
    )
  },
  computed: {
    loginChecked: function () {
      return this.$store.state.isLoginChecked
    },
    loginEmail: function () {
      return this.$store.state.user.email
    },
  },
  watch: {
    loginChecked: function (value) {
      console.log('yes login checked')
      console.log('loginEmail:' + value)
      if (value){
        for (let index = 0; index < this.tabNumber; index++) {
          console.log('forloop:' + index)
          this.dietCases[index] = this.loadDiet(this.dietCases, index)
        }
      }
    }
  },
  methods: {
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
      let vm = this
      docs.forEach(function (val, index) {
        vm.itemsDRI.push({
          'id': val.key,
          'Name': val.doc.nut_group,
          'En': val.doc.energy,
          'Pr': val.doc.protein,
          'Va': val.doc.vita,
          'Fe': val.doc.fe,
          'number': 0
        })
      })
    },
    saveDiet(dat, index) {
      const vm = this
      const db = new PouchDB('test')
      const id = this.$store.state.user.email + index
      db.get(id).then(function (doc) {
        dat[index]._rev = doc._rev
        doc = dat[index]
        return db.put(doc);
      }).catch(function (e) {
        console.log('add new doc')
        return db.put(dat[index])
      })
    },
    loadDiet(dat, index) {
      console.log('loadDiet in for')
      console.log(dat)
      console.log(index)
      const vm = this
      const db = new PouchDB('test')
      const _id = this.$store.state.user.email + index
      db.get(_id).then(function (doc) {
        dat[index] = doc
        dat[index]._id = _id
        console.log('added data to index:' + index)
        console.log(doc)
        return dat[index]
      }).catch(function (e) {
          console.log(e)
          console.log('added default data to index:' + index)
          dat[index] = {
            itemsRecepi: [],
            targetName: '',
            nutritionTarget: {
              En: 0,
              Pr: 0,
              Va: 0,
              Fe: 0,
            },
            nutritionSum: {
              En: 0,
              Pr: 0,
              Va: 0,
              Fe: 0,
              Wt: 0,
            },
            driID: '',
            _id: _id,
            pageId: index
          }
          return dat[index]
        }
      )
    },
  },
}
</script>
