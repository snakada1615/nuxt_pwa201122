<template>
  <b-container>
    <FctTableModal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :items="items"
    ></FctTableModal>
    <b-button @click="showDialogue">click</b-button>
    <p>login user: {{ $store.state.user.email }}</p>
    <b-button @click="getLocalDB">localdata</b-button>
    <p>localDB: {{ localdata }}</p>
  </b-container>
</template>

<script>
  import FctTableModal from "../components/organisms/FctTableModal";
  import PouchDB from "pouchdb";

  export default {
    components: {
      FctTableModal,
    },
    data() {
      return {
        items: [],
        localdata: '',
      }
    },
    mounted() {
      console.log(('yes mounted'))
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
          console.log(('yes'))
          vm.setPouchData(fct)
        }
      })
    },
    methods: {
      getLocalDB() {
        this.localdata = localStorage.getItem('_pouch_fct')
        console.log(this.localdata)
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
    }
  }
</script>
