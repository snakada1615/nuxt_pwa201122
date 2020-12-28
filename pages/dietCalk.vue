<template>
  <b-container style="max-width: 540px;">
    <b-row class="my-2" v-show="showFCT">
      <b-card bg-variant="light" border-variant="success" class="mx-1 px-0">
        <fct-table
          :items="items"
          head-row-variant="success"
          table-variant="light"
          @fctClick="onFCTclick"
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
          <dri-table
            @changeTarget="onChangeTarget"
            :mySelection="driID"
            :items="itemsDRI"
            head-row-variant="success"
            table-variant="light"
          ></dri-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 py-2">
        <b-card bg-variant="light" border-variant="success" class="mx-1 px-2">
          <recepi-table
            @inputData="onChangeRecepi"
            :items="itemsRecepi"
            head-row-variant="success"
            table-variant="light"
            foot-row-variant="light"
            @rowClick="onRecepiclick"
          >
          </recepi-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0">
        <b-card bg-variant="light" border-variant="success" class="mx-1 px-2">
          <b-row class="mt-0 bg-success">
            <b-col cols="3" class="text-center mr-2 font-weight-bold">Nutrition</b-col>
            <b-col cols="3" class="font-weight-bold">Balance</b-col>
            <b-col>
              <left-right-switch
                labelLeft="per meal"
                labelRight="per day"
                name="check"
                v-model="driSwitch"
              ></left-right-switch>
            </b-col>
          </b-row>
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
    <b-button id="test" @click="test">test</b-button>
    <b-button @click="initWeight=8">change</b-button>
    <food-modal
      :init-weight="initWeight"
      :items="itemSingleCrop"
      my-name="modalTest"
      my-type="Number"
      rules="min_value:0|max_value:500"
      @modalOk="onCropWeightSet"
    ></food-modal>
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
  import fctTable from '~/components/organisms/FctTable'
  import nutritionBar from "~/components/organisms/nutritionBar";
  import recepiTable from "~/components/organisms/recepiTable";
  import driTable from "../components/organisms/driTable";
  import driTableGroup from "../components/organisms/driTableGroup";
  import foodModal from '../components/organisms/foodModal'
  import leftRightSwitch from "@/components/atoms/leftRightSwitch";
  import PouchDB from 'pouchdb'

  var $ = require('jquery');

  export default {
    components: {
      fctTable,
      nutritionBar,
      recepiTable,
      driTable,
      foodModal,
      leftRightSwitch,
      driTableGroup,
    },
    computed: {
      nutritionRating: function () {
        let En = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.En * this.driRange / this.nutritionTarget.En) / 10 : 0
        let Pr = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Pr * this.driRange / this.nutritionTarget.Pr) / 10 : 0
        let Va = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Va * this.driRange / this.nutritionTarget.Va) / 10 : 0
        let Fe = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Fe * this.driRange / this.nutritionTarget.Fe) / 10 : 0
        return {
          En: En,
          Pr: Pr,
          Va: Va,
          Fe: Fe,
        }
      },
      driRange: function () {
        let res = 1
        if (this.driSwitch) {
          res = 0.33
        }
        return res
      }
    },
    data() {
      return {
        driID: "1",
        items: [],
        itemsDRI: [],
        itemSingleCrop: [],
        itemsRecepi: [],
        iconNum: 1,
        driSwitch: false,
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
        groupFlag: false
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
            vm.setPouchDataDRI(dataset).then(
              vm.setDRI(8)
            )
          })
        } else {
          vm.setPouchDataDRI(dri).then(
            vm.setDRI(8)
          )
        }
      })
    },
    methods: {
      setDRI(val) {
        this.driID = val
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
      async setPouchDataDRI(dataset) {
        const vm = this;
        console.log('test01');

        let promise = new Promise((resolve, reject) => {
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
            .then(
              resolve(true)
            )
            .catch(function (err) {
              console.log(err)
              reject(err)
            })
        })
        let output = await promise
        return output
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
      onChangeRecepi(value) {
        this.nutritionSum.En = value.En || 0
        this.nutritionSum.Pr = value.Pr || 0
        this.nutritionSum.Va = value.Va || 0
        this.nutritionSum.Fe = value.Fe || 0
        this.nutritionSum.Wt = value.Wt || 0
      },
      onChangeTarget(value) {
        console.log(value)
        this.nutritionTarget.En = Number(value[1].Value) || 0
        this.nutritionTarget.Pr = Number(value[2].Value) || 0
        this.nutritionTarget.Va = Number(value[3].Value) || 0
        this.nutritionTarget.Fe = Number(value[4].Value) || 0
      },
      test() {
        console.log('files1')
      },
      onFCTclick(rec) {
        console.log('halo')
        const vm = this
        vm.itemSingleCrop.length = 0
        vm.itemSingleCrop.push({
          'id': rec.id,
          'Name': rec.Name,
          'En': rec.En,
          'Pr': rec.Pr,
          'Va': rec.Va,
          'Fe': rec.Fe,
        })
        vm.initWeight = 0
        vm.itemsRecepi.forEach(function (item) {
          console.log(item.id)
          if (item.id === rec.id) {
            vm.initWeight = Number(item.Wt)
          }
        })
        vm.$bvModal.show('modalTest')
      },
      onRecepiclick(rec) {
        this.itemSingleCrop.length = 0
        this.itemSingleCrop.push({
          'id': rec.id,
          'Name': rec.Name,
          'En': rec.En,
          'Pr': rec.Pr,
          'Va': rec.Va,
          'Fe': rec.Fe,
        })
        this.initWeight = Number(rec.Wt)
        this.$bvModal.show('modalTest')
      },
      onCropWeightSet(dat) {
        console.log(dat)
        let res = false
        this.itemsRecepi.forEach(function (val) {
          if (val.id === dat.item[0].id) {
            val.Wt = dat.Wt
            res = true
          }
        })
        if (!res) {
          this.itemsRecepi.push({
            'id': dat.item[0].id || 0,
            'Name': dat.item[0].Name || 0,
            'En': dat.item[0].En || 0,
            'Pr': dat.item[0].Pr || 0,
            'Va': dat.item[0].Va || 0,
            'Fe': dat.item[0].Fe || 0,
            "Wt": dat.Wt || 0
          })
        }
      },
    }
  }
</script>
