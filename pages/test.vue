<template>
  <b-container>
    <b-row class="my-2" v-show="showFCT">
      <b-card bg-variant="light" border-variant="success" class="mx-1 px-0">
        <fct-table
          :items="items"
        ></fct-table>
      </b-card>
    </b-row>
    <b-row>
      <b-col>
        <b-form-checkbox v-model="showFCT" name="FCT-button" switch>
          Show FCT
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mb-2 mt-1">
        <b-card bg-variant="light" border-variant="success" class="mx-1 px-0">
          <dri-table @changeTarget="onChangeTarget" :mySelection=driID></dri-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 py-2">
        <b-card bg-variant="light" border-variant="success" class="mx-1 px-2">
          <recepi-table @inputData="onChangeRecepi">
          </recepi-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0">
        <b-card bg-variant="light" border-variant="success" class="mx-1 px-2">
          <b-row class="mt-2">
            <nutrition-bar
              cropName="Energy"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.En"
              :rating="nutritionRating.En"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Protain"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.Pr"
              :rating="nutritionRating.Pr"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Vit-A"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.Va"
              :rating="nutritionRating.Va"
            ></nutrition-bar>
          </b-row>
          <b-row class="mb-2">
            <nutrition-bar
              cropName="Iron"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.Fe"
              :rating="nutritionRating.Fe"
            ></nutrition-bar>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-button id="test" @click="setDRI(3)">test</b-button>
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
  import fctTable from '~/components/FctTable'
  import nutritionBar from "~/components/nutritionBar";
  import recepiTable from "~/components/recepiTable";
  import driTable from "../components/driTable";
  import PouchDB from 'pouchdb'

  var $ = require('jquery');

  export default {
    components: {
      fctTable,
      nutritionBar,
      recepiTable,
      driTable
    },
    computed: {
      nutritionRating: function () {
        let En = this.nutritionTarget.En ? Math.round(100 * this.nutritionSum.En / this.nutritionTarget.En) / 10 : 0
        let Pr = this.nutritionTarget.En ? Math.round(100 * this.nutritionSum.Pr / this.nutritionTarget.Pr) / 10 : 0
        let Va = this.nutritionTarget.En ? Math.round(100 * this.nutritionSum.Va / this.nutritionTarget.Va) / 10 : 0
        let Fe = this.nutritionTarget.En ? Math.round(100 * this.nutritionSum.Fe / this.nutritionTarget.Fe) / 10 : 0
        return {
          En: En,
          Pr: Pr,
          Va: Va,
          Fe: Fe,
        }
      }
    },
    data() {
      return {
        driID: "8",
        items: [],
        iconNum: 1,
        showFCT: true,
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
        }
      }
    },
    mounted() {
      const fct = new PouchDB('fct');
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
      vm.setDRI(9)
    },
    methods: {
      setDRI(val) {
        this.driID = val
        console.log('bbBBBBBBbbbBBBbbbBBB')
      },
      makeToast(mes, append = false) {
        this.$bvToast.toast(mes, {
          autoHideDelay: 5000,
          appendToast: append,
          variant: "info",
          noCloseButton: true
        })
      },
      setIcon() {
        this.iconNum += 1
        console.log(this.iconNum)
      },
      setPouchData(dataset) {
        const vm = this;
        console.log('test01');
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
        console.log('test03');
      },
      async syncCloudant(value) {
        const vm = this;
        let sync_count = 0;
        let url = "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud"
        // Replicating a local database to Remote
        let promise = new Promise((resolve, reject) =>{
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
      onChangeRecepi(value) {
        this.nutritionSum.En = value.En
        this.nutritionSum.Pr = value.Pr
        this.nutritionSum.Va = value.Va
        this.nutritionSum.Fe = value.Fe
        this.nutritionSum.Wt = value.Wt
      },
      onChangeTarget(value) {
        console.log("i am hi")
        console.log(value)
        this.nutritionTarget.En = Number(value[1].Value)
        this.nutritionTarget.Pr = Number(value[2].Value)
        this.nutritionTarget.Va = Number(value[3].Value)
        this.nutritionTarget.Fe = Number(value[4].Value)
      }
    }
  }
</script>
