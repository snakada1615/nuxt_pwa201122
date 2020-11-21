<template>
  <div class="page">
    <div>おはようございます</div>
    <button class=""
      type="button"
      @click="sync"
    >
      Sync database
    </button>
    <nuxt-link to="/">index</nuxt-link>
    <div>
      <b-table
        striped
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
      ></b-table>
      <b-form-group
        label="Per page"
        label-cols-sm="6"
        label-cols-md="4"
        label-cols-lg="3"
        label-align-sm="right"
        label-size="sm"
        label-for="perPageSelect"
        class="mb-0"
      >
        <b-form-select
          v-model="perPage"
          id="perPageSelect"
          size="sm"
          :options="pageOptions"
        ></b-form-select>
      </b-form-group>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
      ></b-pagination>
    </div>
  </div>

</template>


<script>
  //  import PouchDB from '@/plugins/pouchdb'
  import PouchDB from 'pouchdb'

  var $ = require('jQuery');

  export default {
    data() {
      return {
        user: {
          name: "",
          email: ""
        },
        items: [],
        fields: [
          {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: true},
          {key: 'En', sortable: true},
          {key: 'Pr', sortable: true},
          {key: 'Va', sortable: true},
          {key: 'Fe', sortable: true},
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, {value: 100, text: "Show a lot"}],
        sortBy: 'Name',
        sortDesc: false,
        filter: null,
        filterOn: [],
        mydat: [
          {age: '40', first_name: 'Dickerson', last_name: 'Macdonald'},
          {age: '21', first_name: 'Larsen', last_name: 'Shaw'},
          {age: '89', first_name: 'Geneva', last_name: 'Wilson'},
          {age: '38', first_name: 'Jami', last_name: 'Carney'}
        ]
      }
    },
    mounted() {
      const fct = new PouchDB('@/assets/dbs/fct');
      const vm = this;
      fct.info().then(function (info) {
        console.log(info);
      })
      fct.allDocs({include_docs: true})
        .then(function (docs) {
          $.each(docs.rows, function (index, val) {
            console.log(val.doc.Food_grp);
            vm.items.push({
              'Group': val.doc.Food_grp,
              'Name': val.doc.Food_name,
              'En': val.doc.Energy,
              'Pr': val.doc.Protein,
              'Va': val.doc.VITA_RAE,
              'Fe': val.doc.FE
            })
            console.log(val.doc);
          })
          // Set the initial number of items
          vm.totalRows = vm.items.length
          console.log(vm.items);
          console.log(vm.mydat);
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    methods: {
      sync() {
        const dbs = ['fct', 'dri', 'pop', 'crop_national', 'crop_name']
        //const username = "82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix"
        //const password = "f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6"
        let url = "https://82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix:f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6@82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix.cloudantnosqldb.appdomain.cloud"
        // Replicating a local database to Remote
        dbs.map(function (value, index, array) {
          const localdb = new PouchDB('@/assets/dbs/' + value)
          const remotedb = new PouchDB(
            url + '/' + value
          )
          localdb
            .sync(remotedb)
            .on('complete', function () {
              console.log(value + ': synced')
            })
            .on('error', function (err) {
              console.log(err)
            })
        })
      },
      add() {
        const db = firebase.firestore()
        let dbUsers = db.collection('users').add({
          name: this.user.name,
          email: this.user.email,
        })
          .then(ref => {
            this.user.name = ''
            this.user.email = ''
            console.log('added -> Add ID: ', ref.id)
          })
      },
    },
  }
</script>
