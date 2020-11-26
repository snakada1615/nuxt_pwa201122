<template>
  <div class="page">
    <b-form-group
      label="Filter"
      label-cols-sm="3"
      label-align-sm="right"
      label-size="sm"
      label-for="filterInput"
      class="mb-0"
    >
      <b-input-group size="sm">
        <b-form-input
          v-model="filter"
          type="search"
          id="filterInput"
          placeholder="Type to Search"
        ></b-form-input>
        <b-dropdown right size="sm" id="dropdown1" text="Food Group" class="m-md-2" variant="primary">
          <b-dropdown-item v-for="grpName in FoodGrp"
                           :key="grpName.name"
                           :value="grpName.name"
                           @click="filter = grpName.name">{{ grpName.name }}
          </b-dropdown-item>
        </b-dropdown>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <div>
      <b-table
        striped
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        @filtered="onFiltered"
        @row-clicked="rowClick"
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

var $ = require('jquery');

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
      filterOn: ['Group'],
      FoodGrp: [
        {name: 'Grains, roots and tubers'},
        {name: 'Legumes and nuts'},
        {name: 'Vitamin A rich fruits and Vegetable'},
        {name: 'Other fruits and vegetables'},
        {name: 'Flesh foods'},
        {name: 'Dairy products'},
        {name: 'Eggs'},
        {name: 'non-category'}
      ]
    }
  },
  mounted() {
    const fct = new PouchDB('fct');
    const vm = this;
    fct.info().then(function (info) {
      console.log(info);
      if (!(info.doc_count)) {
        vm.$bvModal.msgBoxConfirm('your dataset is currently empty.' +
          ' the application will try to getch data from server!').then(val =>{
            console.log(val)
          vm.sync(['fct'])
        }).catch(err => {
          console.log(err)
        })
      }
    })
    fct.allDocs({include_docs: true})
      .then(function (docs) {
        $.each(docs.rows, function (index, val) {
          vm.items.push({
            'Group': val.doc.food_group_unicef,
            'Name': val.doc.Food_name,
            'En': val.doc.Energy,
            'Pr': val.doc.Protein,
            'Va': val.doc.VITA_RAE,
            'Fe': val.doc.FE
          })
        })
        // Set the initial number of items
        vm.totalRows = vm.items.length
        console.log(vm.items);
      })
      .catch(function (err) {
        console.log(err)
      })
  },
  methods: {
    sync(dbs) {
      const vm = this;
      //const dbs = ['fct', 'dri', 'crop_name']
      //const username = "82e081b0-8c7a-44fe-bb89-b7330ba202a2-bluemix"
      //const password = "f8dabca0c2ed8c226f6a794ceaa65b625ae642f86ee0afcedf093d7e153edbd6"
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
            if (sync_count === 3) {
              //location.reload();
              console.log('all sync done!')
              vm.$bvModal.msgBoxConfirm('sync complete')
            }
          })
          .on('error', function (err) {
            console.log(err)
            vm.$bvModal.msgBoxConfirm('sync failed')
          })
      })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
      console.log('filtered!!')
    },
    rowClick(record){
      console.log(record)
      this.$emit('fctClick', record)
    }
  },
}
</script>
