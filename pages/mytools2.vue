<template>
  <b-container class="my-0">
    <div>helo-------------------</div>
    <button v-on:click="fetchDB(fname[3])">fetch csv!</button>
    <button v-on:click="update_db(0)">update fct from CSV!</button>
    <button v-on:click="update_db_local_name()">update local_name from CSV!</button>
    <button v-on:click="update_db_dri()">update dri from csv!</button>
    <button v-on:click="syncCloudant(['dri'])">sync dri!</button>
  </b-container>
</template>

<script>
  //  import PouchDB from '@/plugins/pouchdb'
  import PouchDB from 'pouchdb'

  export default {
    data() {
      return {
        title: [],
        posts: [],
        fname: [
          '/dbs/fct2.csv',
          '/dbs/dri_new.csv',
          '/dbs/crop_local_name.csv',
        ],
        db_names: [
          'fct',
          'dri',
          'crop_name',
        ]
      }
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
      async fetchDB(fname) {
        // 通常時は this.$axios でアクセスできる。
        const ip = await this.$axios.$get(fname)
        let res = ip.split('\n').map(function (item) {
          let sub_item = item.split(',').map(function (item2) {
            return item2.replace(/@/g, ',')
          });
          return sub_item
        })
        this.title = res
        console.log(res[0]);
        console.log(res[2]);
      },
      async update_db(db_num) {
        const myDB = new PouchDB(this.db_names[db_num])
        const mySource_tmp = await this.$axios.$get(this.fname[db_num])

        let mySource = mySource_tmp.split('\n').filter(function (item, index) {
          return index !== 0
        }).map(function (item) {
          let sub_item = item.split(',').map(function (item2) {
            return item2.replace(/@/g, ',')
          });
          return {
            _id: sub_item[2],
            food_item_id: sub_item[2],
            food_grp_id: sub_item[1],
            Food_grp: sub_item[3],
            Food_name: sub_item[4],
            Energy: sub_item[7],
            Protein: sub_item[9],
            Fat: sub_item[10],
            Carbohydrate: sub_item[11],
            VITA_RAE: sub_item[22],
            FE: sub_item[15],
            food_group_unicef: sub_item[34],
          }
        })
        console.log(mySource);
        console.log(myDB.allDocs());

        myDB.allDocs().then(function (result) {
          // Promise isn't supported by all browsers; you may want to use bluebird
          return Promise.all(result.rows.map(function (row) {
            return myDB.remove(row.id, row.value.rev);
          }));
        }).then(function () {
          // done!
          console.log('successfully deleted')
        }).catch(function (err) {
          // error!
          console.log(err)
        });
        console.log('step2');
        myDB.bulkDocs(mySource).then(function (result) {
          console.log(result)
        }).catch(function (err) {
          console.error(err);
        })
      },
      async update_db_local_name() {
        const myDB = new PouchDB('crop_name')
        const mySource_tmp = await this.$axios.$get(this.fname[2])

        let mySource = mySource_tmp.split('\n').filter(function (item, index) {
          return index !== 0
        }).map(function (item) {
          let sub_item = item.split(',').map(function (item2) {
            return item2.replace(/@/g, ',')
          });
          return {
            _id: sub_item[0],
            food_item_id: sub_item[0],
            country_code: sub_item[1],
            local_food_grp: sub_item[2],
            local_food_name: sub_item[3],
          }
        })
        console.log(mySource);
        console.log(myDB.allDocs());

        myDB.allDocs().then(function (result) {
          // Promise isn't supported by all browsers; you may want to use bluebird
          return Promise.all(result.rows.map(function (row) {
            return myDB.remove(row.id, row.value.rev);
          }));
        }).then(function () {
          // done!
          console.log('successfully deleted')
        }).catch(function (err) {
          // error!
          console.log(err)
        });
        console.log('step2');
        myDB.bulkDocs(mySource).then(function (result) {
          console.log(result)
        }).catch(function (err) {
          console.error(err);
        })
      },
      async update_db_dri() {
        const myDB = new PouchDB('dri')
        const mySource_tmp = await this.$axios.$get(this.fname[1])

        let mySource = mySource_tmp.split('\n').filter(function (item, index) {
          return index !== 0
        }).map(function (item) {
          let sub_item = item.split(',').map(function (item2) {
            return item2.replace(/@/g, ',')
          });
          return {
            _id: sub_item[0],
            nut_group: sub_item[1],
            energy: sub_item[2],
            protein: sub_item[3],
            vita: sub_item[4],
            fe: sub_item[5],
            max_vol: sub_item[6],
          }
        })
        console.log(mySource);
        console.log(myDB.allDocs());

        myDB.allDocs().then(function (result) {
          // Promise isn't supported by all browsers; you may want to use bluebird
          return Promise.all(result.rows.map(function (row) {
            return myDB.remove(row.id, row.value.rev);
          }));
        }).then(function () {
          // done!
          console.log('successfully deleted')
        }).catch(function (err) {
          // error!
          console.log(err)
        });
        console.log('step2');
        myDB.bulkDocs(mySource).then(function (result) {
          console.log(result)
        }).catch(function (err) {
          console.error(err);
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
