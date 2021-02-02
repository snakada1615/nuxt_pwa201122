<template>
  <div>
    <b-button class="my-2 mx-2" size="sm" variant="primary" @click="getDiet">push</b-button>
    <b-card>
      <b-card-body body-bg-variant="success" body-text-variant="light">
        <div>user:{{$store.state.user}}</div>
        <div>workspace:{{$store.state.caseId}}</div>
      </b-card-body>
    </b-card>
    <b-card>
      <b-card-body body-bg-variant="success" body-text-variant="light">
        <div>wsList: {{$store.state.caseIdList}}</div>
      </b-card-body>
    </b-card>
    <b-card>
      <b-card-body body-bg-variant="success" body-text-variant="light">
        <div>dietList: {{dietList[0]}}</div>
      </b-card-body>
    </b-card>
    <b-card>
      <b-card-body body-bg-variant="success" body-text-variant="light">
        <b-input name="query" v-model="searchQuery" size="sm"/>
        <v-json-tree :json-data="totalData" :filter-key="searchQuery"></v-json-tree>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import vJsonTree from 'v-json-tree'
  import {pouchGetDb} from "../plugins/pouchHelper";

  export default {
    components: {
      vJsonTree,
    },
    data() {
      return {
        dietList: [],
        searchQuery: '',
        jsonData: {},
        totalData: [],
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.user.email
      },
    },
    watch: {
      currentUser: function () {
        const vm = this
        this.getDiet().then(function (docs) {
          vm.totalData = docs
        })
      }
    },
    methods: {
      async getDiet() {
        const vm = this
        vm.dietList = await vm.$store.dispatch('loadDietInfoFromPouch').catch((err) => err)
        const db = pouchGetDb(vm.$store.state.dbUser)
        db.allDocs({include_docs: true}).then(function (docs) {
          console.log(docs)
          vm.totalData = docs
        })
      },
      setDiet(){
        const vm = this
        this.getDiet().then(function (docs) {
          vm.totalData = docs
        })
      },
    },
  }
</script>

