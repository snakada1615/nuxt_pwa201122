<template>
  <b-container>
    <b-tabs v-show="$store.state.isLoginChecked" content-class="mt-3">
      <b-tab v-for="(diet, index) in dietCases" :key="index" :title="String(index + 1)">
        <p>Tab-{{ index + 1 }}</p>
        <diet-calk-comp
          :fct-org="items"
          :dri-org="itemsDRI"
          :diet-case="diet"
        />
      </b-tab>
    </b-tabs>
  </b-container>
</template>


<script>
  import driTable from "../components/organisms/driTable";
  import PouchDB from 'pouchdb'
  import {getPouchData, syncCloudant} from '@/plugins/pouchHelper'
  import dietCalkComp from "../components/organisms/dietCalkComp";

  export default {
    components:{
      driTable,
      dietCalkComp,
    },
    data(){
      return{
        itemsDRI:[],
        items:[],
        tabNumber: 7,
        dietCases:[]
      }
    },
    computed:{
      loginChecked: function () {
        return this.$store.state.isLoginChecked
      },
    },
    watch:{
      loginChecked: function (value) {
        const vm = this
        if (value){
          for (let index = 0; index < this.tabNumber; index++) {
            vm.loadDiet(index).then(function (doc) {
              vm.dietCases.push(doc)
            })
          }
        }
      }
    },
    methods:{
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
      loadDiet(index) {
        const vm = this
        const db = new PouchDB('test')
        const _id = this.$store.state.user.email + index
        let promise = new Promise((resolve, reject) => {
          db.get(_id).then(function (doc) {
            doc._id = _id
            console.log('added pre-input to index:' + index)
            console.log(doc)
            resolve(doc)
          }).catch(function (e) {
              const dat = {
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
              resolve(dat)
            }
          )
        })
        return promise
      },
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
    },
  }
</script>
