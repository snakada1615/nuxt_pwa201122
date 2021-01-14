<template>
  <b-container>
    <diet-calk-comp
      :fct-org="items"
      :dri-org="itemsDRI"
      :diet-case="dietCase"
    />
    <diet-calk-comp
      :fct-org="items"
      :dri-org="itemsDRI"
      :diet-case="dietCase2"
    />
  </b-container>
</template>


<script>
  import driTable from "../components/organisms/driTable";
  import PouchDB from 'pouchdb'
  import {getPouchData} from '@/plugins/pouchHelper'
  import dietCalkComp from "../components/organisms/dietCalkComp";

  export default {
    components:{
      driTable,
      dietCalkComp,
    },
    data(){
      return{
        dietCase : {
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
          _id: 'baka',
          pageId: 1
        },
        dietCase2 : {
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
          _id: 'baka',
          pageId: 2
        },
        itemsDRI:[],
        items:[],
      }
    },
    methods:{
      onChangeTarget:function (val, target) {
        console.log('val:'+val)
        console.log('target:'+target)
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
    },
    mounted() {
      const vm = this
      const dri = new PouchDB('dri')
      const fct = new PouchDB('fct')
      dri.info().then(function (info) {
        if (info.doc_count){
          getPouchData(dri).then(docs => {
            vm.itemsDRI = vm.setDRI(docs)
          })
        }
      }).then(
        fct.info().then(function (info) {
          if (info.doc_count){
            getPouchData(fct).then(docs => {
              vm.items = vm.setFTC(docs)
            })
          }
        })
      )
    }
  }
</script>
