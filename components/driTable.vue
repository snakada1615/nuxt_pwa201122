<template>
  <b-container class="my-0 px-0">
    <div>
      <b-form-select v-model="selectedValue" :options="menuOptions" @change="changeSelection"></b-form-select>
    </div>
    <b-table
      striped
      ref="table"
      :items="selectedData"
      :fields="fields"
      small
    ></b-table>
  </b-container>
</template>

<script>
  import PouchDB from 'pouchdb'

  var $ = require('jquery');

  export default {
    mounted() {
      const dri = new PouchDB('dri');
      const vm = this;
      this.makeToast('start fetching')
      dri.info().then(function (info) {
        console.log(info);
        if (!(info.doc_count)) {
          vm.makeToast('your dataset is currently empty. the application will try to fetch data from server!')
          vm.syncCloudant(['dri'])
            .catch(err => {
              console.log(err)
            })
        }
      })
      this.setPouchData(dri)
    },
    data() {
      return {
        items: [],
        selectedData: [],
        menuOptions: [],
        selectedValue: null,
        dropButton: 'menu',
        fields: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
      }
    },
    props: {
      mySelection: null
    },
    watch: {
      mySelection: { // 外からプロパティの中身が変更になったら実行される
        immediate: true,
        handler(value) {
          console.log('watching...' + value)
          this.selectedValue = String(value);
          this.changeSelection()
          console.log('working?...')
        }
      }
    },
    computed: {
      menuOptions: function () {
        let result = this.items.map(function (value) {
          return {
            'value': value.id,
            'text': value.Name
          }
        })
        return result
      }
    },
    methods: {
      changeSelection() {
        const vm = this
        vm.selectedData.length = 0
        console.log('selectedValue=' + vm.selectedValue)
        console.log('type=' + typeof vm.selectedValue)
        const dat = vm.items.filter(function (item) {
          return item.id === vm.selectedValue
        })
        vm.makeToast('selectedValue=' + vm.selectedValue)
        vm.makeToast(typeof vm.selectedValue)
        vm.makeToast(String(dat.length))
        if (dat.length !== 1) {
          vm.makeToast('Error in dri dataset')
        } else {
          vm.selectedData.push(
            {Item: 'target', Value: dat[0].Name},
            {Item: 'Energy', Value: dat[0].En},
            {Item: 'Protein', Value: dat[0].Pr},
            {Item: 'Vita-A', Value: dat[0].Va},
            {Item: 'Iron', Value: dat[0].Fe}
          )
          vm.$emit('changeTarget', vm.selectedData)
        }
      },
      makeToast(mes, append = false) {
        this.$bvToast.toast(mes, {
          autoHideDelay: 5000,
          appendToast: append,
          variant: "info",
          noCloseButton: true
        })
      },
      setPouchData(dataset) {
        const vm = this;
        dataset.allDocs({include_docs: true})
          .then(function (docs) {
            $.each(docs.rows, function (index, val) {
              vm.items.push({
                'id': val.key,
                'Name': val.doc.nut_group,
                'En': val.doc.energy,
                'Pr': val.doc.protein,
                'Va': val.doc.vita,
                'Fe': val.doc.fe
              })
            })
            vm.makeToast('DRI dataset loaded')
          })
          .catch(function (err) {
            console.log(err)
          })
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
