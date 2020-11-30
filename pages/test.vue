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
      <b-col class="px-0 py-2">
        <b-card bg-variant="light" border-variant="success" class="mx-1 px-2">
          <recepi-table>
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
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Protain"
              :iconNum=iconNum
              :max="10"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Vit-A"
              :iconNum=iconNum
              :max="10"
            ></nutrition-bar>
          </b-row>
          <b-row class="mb-2">
            <nutrition-bar
              cropName="Iron"
              :iconNum=iconNum
              :max="10"
            ></nutrition-bar>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
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

  import PouchDB from 'pouchdb'

  var $ = require('jquery');

  export default {
    components: {
      fctTable,
      nutritionBar,
      recepiTable,
    },
    data() {
      return {
        items: [],
        iconNum: 1,
        showFCT: true
      }
    },
    mounted() {
      const fct = new PouchDB('fct');
      const vm = this;
      this.makeToast('start fetching')
      fct.info().then(function (info) {
        console.log(info);
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to getch data from server!')
          vm.syncCloudant(['fct'])
            .catch(err => {
              console.log(err)
            })
        }
      })
      this.setPouchData(fct)
    },
    methods: {
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
      syncCloudant(dbs) {
        const vm = this;
        let sync_count = 0;
        let url = "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud"
        // Replicating a local database to Remote
        dbs.map(function (value) {
          const localdb = new PouchDB(value)
          const remotedb = new PouchDB(
            url + '/' + value
          )
          localdb
            .sync(remotedb)
            .on('complete', function () {
              console.log(value + ': synced')
              sync_count += 1
              if (sync_count === dbs.length) {
                //location.reload();
                vm.setPouchData(localdb)
                console.log('all sync done!')
                vm.makeToast('sync complete')
              }
            })
            .on('error', function (err) {
              console.log(err)
              vm.makeToast('sync failed')
            })
        })
      },
    }
  }
</script>
