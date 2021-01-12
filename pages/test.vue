<template>
  <b-container>
    <div>
      <b-tabs content-class="mt-3">
        <b-tab v-for="index in tabNumber" :key="index" :title="String(index)">
          <p>I'm the {{index}} tab</p>
          <b-button variant="primary" @click="saveDiet(index)">save</b-button>
          <b-button variant="primary" @click="loadDiet(index)">load</b-button>
          <diet-calk-comp
            :fct-org="items"
            :dri-org="itemsDRI"
            :diet-case="dietCases[index]"
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
        tabNumber:10,
        dietCases: [],
      }
    },
    mounted() {
      console.log('mounting main program')
      //initialize dietCases
      for (let inedex in this.tabNumber){
        connsole.log('index:'+index)
        this.dietCases.push({
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
          _id: index
        })
      }////////////////////////////
      const fct = new PouchDB('fct');
      const dri = new PouchDB('dri');
      const vm = this;
      let docs = []
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
            vm.setFTC(docs)
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
      ).then(docs => {
          for (let i = 1; i <= 10; i++)
            vm.loadDiet(i)
        }
      )
    },
    methods: {
      setFTC(docs) {
        let vm = this
        docs.forEach(function (val, index) {
          vm.items.push({
            'id': val.doc.food_item_id,
            'Group': val.doc.food_group_unicef,
            'Name': val.doc.Food_name,
            'En': val.doc.Energy,
            'Pr': val.doc.Protein,
            'Va': val.doc.VITA_RAE,
            'Fe': val.doc.FE
          })
        })
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
      saveDiet(index) {
        const vm = this
        const db = new PouchDB('test')
        const id = this.$store.state.user.email + index
        db.get(id).then(function (doc) {
          vm.dietCases[index]._rev = doc._rev
          doc = vm.dietCases[index]
          return db.put(doc);
        }).catch(function (e) {
          console.log('add new doc')
          return db.put(vm.dietCases[index])
        })
      },
      loadDiet(index) {
        console.log('loadDiet in')
        console.log(index)
        const vm = this
        const db = new PouchDB('test')
        const _id = this.$store.state.user.email + index
        db.get(_id).then(function (doc) {
          vm.dietCases[index] = doc
          vm.dietCases[index]._id = _id
          console.log(doc)
          console.log(index)
        }).catch(function (e) {
            console.log(e)
            console.log(index)
            vm.dietCases[index] = {
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
              _id: _id
            }
          }
        )
      },
    },
  }
</script>
