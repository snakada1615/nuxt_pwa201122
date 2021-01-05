<template>
  <b-container class="px-0" style="max-width: 540px;">
    <b-row class="my-2">
      <b-col class="px-0 mx-0">
        <b-card
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2">
          <template #header>
            <div>Selected crop</div>
          </template>
          <b-row>
            <b-col>
              Name: <span class="font-weight-bold text-info">{{selectedItem.Name}}</span>
            </b-col>
            <b-col cols="3">
              <b-button @click="showDialogue" size="sm" variant="info">select crop</b-button>
            </b-col>
          </b-row>
        </b-card>

        <b-card
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2">
          <template #header>
            <div>Feasibility score</div>
          </template>
          <b-row>
            <b-col class="text-center">Crop name:</b-col>
            <b-col class="text-info">{{selectedItem.Name}}</b-col>
          </b-row>
          <b-row>
            <b-col cols="6" class="text-center">total score:</b-col>
            <b-col cols="6">{{qaScore[qaScore.length-1].value}} / 50</b-col>
          </b-row>
          <b-row v-for="(qa, index) in qaScore" :key="index">
            <nutrition-bar
              v-if="qa.id > 0"
              :colWidthFirst=6
              :colwidthSecond="0"
              :cropName="qa.text"
              :max="10"
              :nutritionTarget="0"
              :rating="qa.value"
            ></nutrition-bar>
          </b-row>
        </b-card>

        <b-card
          v-for="(qaGroup, index) in qaList"
          :key="index"
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2">
          <template #header>
            <div>{{qaGroup.categoryText}}</div>
          </template>
          <div v-show="index===0">
            <dri-table
              @changeTarget="onChangeTarget"
              :mySelection="driID"
              :items="itemsDRI"
              :showTable = false
              head-row-variant="success"
              table-variant="light"
            />
            <b-card class="px-0 mx-0">
              <b-row class="mt-0 bg-success">
                <b-col cols="3" class="text-center mr-2 font-weight-bold">Nutrition</b-col>
                <b-col cols="3" class="font-weight-bold">Balance</b-col>
              </b-row>
              <b-row class="mt-2">
                <nutrition-bar
                  cropName="Energy"
                  :max="10"
                  :nutritionTarget="nutritionTarget.En"
                  :rating="nutritionRating.En"
                ></nutrition-bar>
              </b-row>
              <b-row>
                <nutrition-bar
                  cropName="Protain"
                  :max="10"
                  :nutritionTarget="nutritionTarget.Pr"
                  :rating="nutritionRating.Pr"
                ></nutrition-bar>
              </b-row>
              <b-row>
                <nutrition-bar
                  cropName="Vit-A"
                  :max="10"
                  :nutritionTarget="nutritionTarget.Va"
                  :rating="nutritionRating.Va"
                ></nutrition-bar>
              </b-row>
              <b-row class="mb-2">
                <nutrition-bar
                  cropName="Iron"
                  :max="10"
                  :nutritionTarget="nutritionTarget.Fe"
                  :rating="nutritionRating.Fe"
                ></nutrition-bar>
              </b-row>
            </b-card>
          </div>
          <ul class="pl-2 my-0">
            <li
              v-for="(qa, index2) in qaGroup.itemsQA"
              :key="index2"
              :class="{'mt-3':index2!==0}"
            >
              {{qa.questionText}}
              <b-form-select
                v-model="ansList[qa.id-1]"
                :options="qa.answerList"
                size="sm"
                :state="ansList[qa.id-1]!=-99"
              >
              </b-form-select>
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
    <FctTableModal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :items="items"
      @modalOk="onitemSelected"
    ></FctTableModal>
  </b-container>
</template>
<script>
  import PouchDB from "pouchdb";
  import FctTableModal from "../components/organisms/FctTableModal";

  export default {
    components: {
      FctTableModal,
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
            vm.setPouchDataDRI(dataset)
          })
        } else {
          vm.setPouchDataDRI(dri)
        }
      })
    },
    methods: {
      onChangeTarget(value) {
        console.log(value)
        this.nutritionTarget.En = Number(value[1].Value) || 0
        this.nutritionTarget.Pr = Number(value[2].Value) || 0
        this.nutritionTarget.Va = Number(value[3].Value) || 0
        this.nutritionTarget.Fe = Number(value[4].Value) || 0
      },
      onitemSelected(value) {
        this.selectedItem = value
        this.nutritionSum.En = value.En || 0
        this.nutritionSum.Pr = value.Pr || 0
        this.nutritionSum.Va = value.Va || 0
        this.nutritionSum.Fe = value.Fe || 0
        this.nutritionSum.Wt = value.Wt || 0
      },
      makeToast(mes, append = false) {
        this.$bvToast.toast(mes, {
          autoHideDelay: 5000,
          appendToast: append,
          variant: "info",
          noCloseButton: true
        })
      },
      showDialogue() {
        this.$bvModal.show('modalTest')
      },
      setPouchData(dataset) {
        const vm = this;
        dataset.allDocs({include_docs: true})
          .then(function (docs) {
            vm.items.length = 0           //initialize items value
            docs.rows.forEach(function (val, index) {
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
            docs.rows.forEach(function (val, index) {
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
            console.log(vm.itemsDRI)
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
    },
    computed: {
      qaScore: function () {
        let sum = []
        let vm = this
        vm.qaList.forEach(function (categories) {
          let sumTemp = 0
          categories.itemsQA.forEach(function (question) {
            if (vm.ansList[question.id - 1] > 0) {
              sumTemp += vm.ansList[question.id - 1]
            }
          })
          sum.push({
            id: categories.categoryID,
            text: categories.categoryText,
            value: Math.round(10 * sumTemp / (3 * categories.itemsQA.length))
          })
        })
        // add total score
        const sumTemp = sum.reduce((p, x) => p + x.value, 0)
        sum.push({
          id: 0,
          text: 'total score',
          value: sumTemp
        })
        return sum
      },
      nutritionRating: function () {
        let En = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.En / this.nutritionTarget.En) / 10 : 0
        let Pr = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Pr / this.nutritionTarget.Pr) / 10 : 0
        let Va = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Va / this.nutritionTarget.Va) / 10 : 0
        let Fe = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Fe / this.nutritionTarget.Fe) / 10 : 0
        return {
          En: En,
          Pr: Pr,
          Va: Va,
          Fe: Fe,
        }
      },
    },
    data() {
      return {
        items: [],
        itemsDRI: [],
        selectedItem: '',
        driID: "",
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
        ansList: [-99, 3, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99],
        qaList: [
          {
            categoryID: 1, categoryText: 'Nutrient balance',
            itemsQA: [
              {
                id: 1,
                questionText: 'Is required amount for nutrition target feasible?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'yes'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'maybe no'},
                  {value: 0, text: 'no'},
                ]
              },
            ]
          },
          {
            categoryID: 2,
            categoryText: 'Socioeconomic feasibility',
            itemsQA: [
              {
                id: 2,
                questionText: 'Is there any social barrier to consume this commodity in general?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
              {
                id: 3,
                questionText: 'Is there any social barrier to consume this commodity for women?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
              {
                id: 4,
                questionText: 'Is there any social barrier to consume this commodity for child?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
              {
                id: 5,
                questionText: 'Is this commodity affordable in the market for ordinary population?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
            ]
          },
          {
            categoryID: 3,
            categoryText: 'Technical feasibility',
            itemsQA: [
              {
                id: 6,
                questionText: 'do target beneficiary have enough skill to grow this commodity?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'yes'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'maybe no'},
                  {value: 0, text: 'no'},
                ]
              },
              {
                id: 7,
                questionText: 'Does this commodity imply incremental workload for women?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
              {
                id: 8,
                questionText: 'Is technical service available for this commodity?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'yes / there is no need for it since beneficiaries already have enough skill'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'maybe no'},
                  {value: 0, text: 'no'},
                ]
              },
            ]
          },
          {
            categoryID: 4,
            categoryText: 'Investment',
            itemsQA: [
              {
                id: 9,
                questionText: 'Is there need for specific infrastructure (irrigation / postharvest, etc.)?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
              {
                id: 10,
                questionText: 'Is production input (fertilizer, seed, feed) become financial burden for small farmer?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'no'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'maybe yes'},
                  {value: 0, text: 'yes'},
                ]
              },
            ]
          },
          {
            categoryID: 5,
            categoryText: 'Stability',
            itemsQA: [
              {
                id: 11,
                questionText: 'How many month can you harvest this commodity in a year?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: '10-12 mon'},
                  {value: 2, text: '7-9 mon'},
                  {value: 1, text: '4-6 mon'},
                  {value: 0, text: '0-3 mon'},
                ]
              },
              {
                id: 12,
                questionText: 'Are there any feasible storage method available for this commodity?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 3, text: 'yes'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'maybe no'},
                  {value: 0, text: 'no'},
                ]
              },
            ]
          },
        ]
      }
    }
  }
</script>
