<template>
  <b-container class="px-0" style="max-width: 540px;">
    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility assessment result
      </b-col>
    </b-row>
    <b-row>
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
            <b-col cols="2">
              Name:
            </b-col>
            <b-col
              cols="7" class="border"
              :class="{'border-dark':selectedItem.Name, 'border-danger':!selectedItem.Name}">
              <div class="font-weight-bold text-info">{{selectedItem.Name}}</div>
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
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility questions
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mx-0">
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
          <div v-show="index===0" class="mb-2">
            <dri-table
              @changeTarget="onChangeTarget"
              @change="$emit('update:driId', $event)"
              :mySelection="driId"
              :items="itemsDRI"
              :showTable=false
              head-row-variant="success"
              table-variant="light"
            />
            <b-card class="px-0 mx-0">
              <b-row class="mt-0 bg-success mb-3">
                <b-col cols="3" class="text-center mr-2 font-weight-bold">Nutrition</b-col>
                <b-col cols="3" class="font-weight-bold">Balance</b-col>
              </b-row>
              <b-row v-for="(nut, index) in nutritionRatingSet" :key="index">
                <nutrition-bar
                  :cropName="nut.name"
                  :max="10"
                  :nutritionTarget="nut.target"
                  :rating="nut.rating"
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
                :value="ansList[qa.id-1]"
                @input="onInput"
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
      @modalOk="onItemSelected"
    ></FctTableModal>
  </b-container>
</template>
<script>
  import PouchDB from "pouchdb";
  import FctTableModal from "@/components/organisms/FctTableModal";
  import {getPouchData, syncCloudant} from '@/plugins/pouchHelper'
  import driTable from "@/components/organisms/driTable";
  import nutritionBar from "@/components/organisms/nutritionBar";

  export default {
    components: {
      FctTableModal,
      driTable,
      nutritionBar,
    },
    mounted() {
      const fct = new PouchDB('fct');
      const dri = new PouchDB('dri');
      const vm = this;
      this.makeToast('start fetching')
      fct.info().then(function (info) {
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          syncCloudant('fct').then(dataset => {
            getPouchData(dataset).then(docs => {
              vm.setFTC(docs)
            })
          })
        } else {
          getPouchData(fct).then(docs => {
            vm.setFTC(docs)
          })
        }
      })
      dri.info().then(function (info) {
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          syncCloudant('dri').then(dataset => {
            getPouchData(dataset).then(docs => {
              vm.setDRI(docs)
            })
          })
        } else {
          getPouchData(dri).then(docs => {
            vm.setDRI(docs)
          })
        }
      })
    },
    methods: {
      onInput(val){
        console.log('onInput')
        console.log(val)
        this.$emit('update:ansList[qa.id-1]', val)
      },
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
      onChangeTarget(value) {
        console.log(value)
        this.nutritionTarget.En = Number(value[1].Value) || 0
        this.nutritionTarget.Pr = Number(value[2].Value) || 0
        this.nutritionTarget.Va = Number(value[3].Value) || 0
        this.nutritionTarget.Fe = Number(value[4].Value) || 0
      },
      onItemSelected(value) {
        this.$emit('update:selectedItem', value)
        //this.selectedItem = value
        this.nutritionSum.En = value.En || 0
        this.nutritionSum.Pr = value.Pr || 0
        this.nutritionSum.Va = value.Va || 0
        this.nutritionSum.Fe = value.Fe || 0
        this.nutritionSum.Wt = value.Wt || 0
      },
      showDialogue() {
        this.$bvModal.show('modalTest')
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
      nutritionRatingSet: function () {
        let Pr = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Pr / this.nutritionTarget.Pr) / 10 : 0
        let Va = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Va / this.nutritionTarget.Va) / 10 : 0
        let Fe = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Fe / this.nutritionTarget.Fe) / 10 : 0
        return [
          {
            name: 'Energy',
            target: this.nutritionTarget.En,
            rating: this.nutritionTarget.En ?
              Math.round(100 * this.nutritionSum.En / this.nutritionTarget.En) / 10 : 0
          },
          {
            name: 'Protein',
            target: this.nutritionTarget.Pr,
            rating: this.nutritionTarget.Pr ?
              Math.round(100 * this.nutritionSum.Pr / this.nutritionTarget.Pr) / 10 : 0
          },
          {
            name: 'VitA',
            target: this.nutritionTarget.Va,
            rating: this.nutritionTarget.Va ?
              Math.round(100 * this.nutritionSum.Va / this.nutritionTarget.Va) / 10 : 0
          },
          {
            name: 'Fe',
            target: this.nutritionTarget.Fe,
            rating: this.nutritionTarget.Fe ?
              Math.round(100 * this.nutritionSum.Fe / this.nutritionTarget.Fe) / 10 : 0
          },
        ]
      },
      items: {
        get: function () {
          return this.fctOrg
        }
      },
      itemsDRI: {
        get: function () {
          return this.driOrg
        }
      },
    },
    data() {
      return {
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
    },
    props: {
      selectedItem: {
        type: Object,
        default: {}
      },
      driId: {
        type: String,
        default: ''
      },
      ansList: {
        type: Array,
        default: [-99, - 99, - 99, - 99,-99, -99, -99, -99, -99, -99, -99, -99]
      },
      pageId: {
        type: Number,
        default: 1
      },
      fctOrg: {
        type: Array,
        required: true
      },
      driOrg: {
        type: Array,
        required: true
      },
    },
  }
</script>
