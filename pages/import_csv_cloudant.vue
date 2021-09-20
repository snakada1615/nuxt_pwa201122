<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2">
    test
    <form>
      <b-form-file
        class="my-2"
        v-model="file1"
        @change="readFile"
        :state="fileState"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <div class="mt-3">Selected file: {{ file1 ? file1.name : '' }}</div>
      <b-form-input
        class="my-2"
        v-model="dbName"
        placeholder="Enter db name"
        :state="nameState"
      />
      <!-- This will only be shown if the preceding input has an invalid state -->
      <b-form-invalid-feedback id="input-live-feedback">
        Enter at least 4 letters, using a-z small letter
      </b-form-invalid-feedback>
    </form>
    <b-button
      class="my-2"
      :disabled="!nameState || !fileState"
      variant="success"
      @click="save2Pouch">
      save to Pouch
    </b-button>
    <b-button
      class="my-2"
      :disabled="!nameState || !fileState || !pouchState"
      variant="success"
      @click="syncMe">
      sync to cloudant
    </b-button>
    <div>{{ jsonData }}</div>
  </b-container>
</template>

<script>
  // this is to import csv file into local pouchdb and cloudant
  import PouchDB from "pouchdb";
  import {syncRemoteDb} from "../plugins/pouchHelper";

  export default {
    data() {
      return {
        file1: null,
        dbName: "",
        jsonData: [],
        pouchState: false,
      }
    },
    computed: {
      nameState() {
        return (/^[a-z._]{4,20}$/).test(this.dbName)
      },
      fileState(){
        return !!this.file1
      },
    },
    methods: {
      readFile(e) {
        const vm = this
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = function () {
          let tmp = []
          tmp = reader.result
          tmp = tmp.split('\n'); // 1行ごとに分割する
          vm.jsonData = vm.csv2json(tmp)
        }
        reader.readAsText(file)
      },

      csv2json(csvArray) {
        let jsonArray = [];

        // 1行目から「項目名」の配列を生成する
        let items = csvArray[0].split(',');

        // CSVデータの配列の各行をループ処理する
        //// 配列の先頭要素(行)は項目名のため処理対象外
        //// 配列の最終要素(行)は空のため処理対象外
        for (let i = 1; i < csvArray.length - 1; i++) {
          let a_line = new Object();
          a_line['_id'] = String(i)
          // カンマで区切られた各データに分割する。
          //　同時に@をピリオドに変換する（戻し）
          let csvArrayD = csvArray[i].split(',').map(function (val) {
            return val.replaceAll("@",".")
          });
          //// 各データをループ処理する
          for (let j = 0; j < items.length; j++) {
            // 要素名：items[j]
            // データ：csvArrayD[j]
            a_line[items[j]] = csvArrayD[j];
          }
          jsonArray.push(a_line);
        }
        //console.debug(jsonArray);
        return jsonArray;
      },
      save2Pouch(){
        // set workSpace to pouchDb
        let vm = this
        let db = new PouchDB(vm.dbName)
        db.bulkDocs(vm.jsonData).catch(function(err){
          throw err
        }).then( function(){
          vm.pouchState = true
        })
        console.log(vm.jsonData)
      },
      syncMe(){
        syncRemoteDb({dbName: this.dbName,
          url: this.$store.state.cloudantUrl})
      }
    }
  }
</script>
