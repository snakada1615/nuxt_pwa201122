<template>
  <b-container class="my-0">
    <div>helo</div>
    <button v-on:click="fetchDB(fname[3])">fetch csv!</button>
    <button v-on:click="update_db(0)">update fct!</button>
    <button v-on:click="update_db_local_name()">update local_name!</button>
    <button v-on:click="update_db_dri()">update dri!</button>
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
          return index != 0
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
          return index != 0
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
          return index != 0
        }).map(function (item) {
          let sub_item = item.split(',').map(function (item2) {
            return item2.replace(/@/g, ',')
          });
          return {
            _id: sub_item[0],
            nut_group: sub_item[1],
            energy: sub_item[2],
            protein: sub_item[3],
            fe: sub_item[4],
            max_vol: sub_item[5],
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
      }
    }
  }
</script>
