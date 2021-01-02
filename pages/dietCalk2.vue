<template>
  <b-container style="max-width: 540px;">
    hello
  </b-container>
</template>

<style>
  /* force rotate when screen width less than 450 */
  @media screen and (min-width: 320px) and (max-width: 450px) and (orientation: portrait) {
    html {
      transform: rotate(-90deg);
      transform-origin: left top;
      width: 100vh;
      overflow-x: hidden;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }

</style>

<script>
  import PouchDB from 'pouchdb'

  var $ = require('jquery');

  export default {
    data() {
      return {
        driID: "",
        items: [],
        itemsDRI: [],
        itemsDriGroup: [],
        itemSingleCrop: [],
        itemsRecepi: [],
        iconNum: 1,
        driSwitch: false,
        targetSwitch: false,
        showFCT: true,
        showFoodDialog: false,
        nutritionTarget: {
          En: 10,
          Pr: 10,
          Va: 10,
          Fe: 10,
        },
        nutritionSum: {
          En: 10,
          Pr: 10,
          Va: 10,
          Fe: 10,
          Wt: 10,
        },
        initWeight: 0,
        groupFlag: false,
      }
    },
    mounted() {
      const fct = new PouchDB('fct');
      const dri = new PouchDB('dri');
      const vm = this;
      this.makeToast('start fetching')
      fct.info().then(function (info) {
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          vm.syncCloudant('fct').then(dataset => {
            vm.setPouchData(dataset)
          })
        } else {
          vm.setPouchData(fct)
        }
      })
      dri.info().then(function (info) {
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          vm.syncCloudant('dri').then(dataset => {
            vm.setPouchDataDRI(dataset).then(function () {
              vm.setDRIGroup()
              console.log('SetPouchDRI failed')
            })
          })
        } else {
          vm.setPouchDataDRI(dri).then(function (result) {
            console.log('ここにいるよ' + result)
            console.log('itemsDRI =' + vm.itemsDRI)
            vm.setDRIGroup()
            console.log('itemsDRIGroup =' + vm.itemsDriGroup)
          })
        }
      })
    },
    methods: {
      setPouchData(dataset) {
        const vm = this;
        dataset.allDocs({include_docs: true})
          .then(function (docs) {
            $.each(docs.rows, function (index, val) {
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
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      setPouchDataDRI(dataset) {
        const vm = this;
        dataset.allDocs({include_docs: true})
          .then(function (docs) {
            $.each(docs.rows, function (index, val) {
              vm.itemsDRI.push({
                'id': val.key,
                'Name': val.doc.nut_group,
                'En': val.doc.energy,
                'Pr': val.doc.protein,
                'Va': val.doc.vita,
                'Fe': val.doc.fe
              })
            })
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      async syncCloudant(value) {
        const vm = this;
        let sync_count = 0;
        let url = "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud"
        // Replicating a local database to Remote
        let promise = new Promise((resolve, reject) => {
          const localdb = new PouchDB(value)
          const remotedb = new PouchDB(url + '/' + value)
          localdb
            .sync(remotedb)
            .on('complete', function () {
              resolve(localdb)
            })
            .on('error', function (err) {
              console.log(err)
              reject(err)
            })
        })
        let output = await promise
        return output
      },
    }
  }
</script>
