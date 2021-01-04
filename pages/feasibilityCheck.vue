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
              >
                <template #first>
                  <b-form-select-option value="" disabled>-- Please select an option --</b-form-select-option>
                </template>
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
    components:{
      FctTableModal,
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
    },
    methods:{
      onitemSelected(val){
        this.selectedItem = val
      },
      makeToast(mes, append = false) {
        this.$bvToast.toast(mes, {
          autoHideDelay: 5000,
          appendToast: append,
          variant: "info",
          noCloseButton: true
        })
      },
      showDialogue(){
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
    data() {
      return {
        items:[],
        selectedItem:'',
        ansList: [-99,3,-99,-99,-99,-99,-99,-99,-99,-99,-99,-99],
        qaList: [
          {
            categoryID: 1, categoryText: 'Nutrient balance',
            itemsQA: [
              {
                id: 1,
                questionText: 'Is required amount for nutrition target feasible?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'yes'},
                  {value: 3, text: 'maybe yes'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'no'},
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
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
                ]
              },
              {
                id: 3,
                questionText: 'Is there any social barrier to consume this commodity for women?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
                ]
              },
              {
                id: 4,
                questionText: 'Is there any social barrier to consume this commodity for child?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
                ]
              },
              {
                id: 5,
                questionText: 'Is this commodity affordable in the market for ordinary population?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
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
                  {value: 4, text: 'yes'},
                  {value: 3, text: 'maybe yes'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'no'},
                ]
              },
              {
                id: 7,
                questionText: 'Does this commodity imply incremental workload for women?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
                ]
              },
              {
                id: 8,
                questionText: 'Is technical service available for this commodity?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'yes / there is no need for it since beneficiaries already have enough skill'},
                  {value: 3, text: 'maybe yes'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'no'},
                ]
              },
            ]
          },
          {
            categoryID: 4,
            categoryText: 'Financial feasibility',
            itemsQA: [
              {
                id: 9,
                questionText: 'Is there need for specific infrastructure (irrigation / postharvest, etc.)?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
                ]
              },
              {
                id: 10,
                questionText: 'Is production input (fertilizer, seed, feed) become financial burden for small farmer?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'no'},
                  {value: 3, text: 'maybe no'},
                  {value: 2, text: 'maybe yes'},
                  {value: 1, text: 'yes'},
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
                  {value: 4, text: '10-12 mon'},
                  {value: 3, text: '7-9 mon'},
                  {value: 2, text: '4-6 mon'},
                  {value: 1, text: '0-3 mon'},
                ]
              },
              {
                id: 12,
                questionText: 'Are there any feasible storage method available for this commodity?',
                answerList: [
                  {value: -99, text: 'please select', disabled: true},
                  {value: 4, text: 'yes'},
                  {value: 3, text: 'maybe yes'},
                  {value: 2, text: 'maybe no'},
                  {value: 1, text: 'no'},
                ]
              },
            ]
          },
        ]
      }
    }
  }
</script>
