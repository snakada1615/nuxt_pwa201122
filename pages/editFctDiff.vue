<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <div v-if="$nuxt.isOffline">
      Sorry, this page works only online
    </div>
    <div v-if="$nuxt.isOnline">
      <b-card>
        <fct-table-edit
          v-if="csvState"
          :items="csv"
          head-row-variant="success"
          table-variant="light"
          @changeFct="onFctChange"
        />
      </b-card>
      <b-card>
        <b-row class="my-1">
          <b-col cols="3">
            Original data:
          </b-col>
          <b-col cols="9">
            {{dbName}}
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col cols="3">
            Description:
          </b-col>
          <b-col cols="9">
            {{dbDescription}}
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col cols="3">
            Creator:
          </b-col>
          <b-col cols="9">
            {{$store.state.user.name}}
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col cols="3">
            modified data:
          </b-col>
          <b-col cols="9">
            <b-form-input
              v-model = "dbName"
            />
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col class="mx-0">
            <b-button
              variant="info"
              size="sm"
              :disabled="!isSaveReady"
              @click="saveFct"
            >save to server
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </b-container>
</template>

<script>
  import vueCsvImport from 'vue-csv-import'
  import FctTableEdit from "@/components/organisms/FctTableEdit";

  export default {
    components: {
      FctTableEdit
    },
    computed: {
      dbNameState() {
        return (/^[a-zA-Z0-9][a-zA-Z0-9-_]{1,37}[a-zA-Z0-9]{1,2}$/).test(this.dbName)
      },
      dbDescriptionState() {
        return (/^[a-zA-Z][a-zA-Z -.,_]{1,99}[a-zA-Z]{1,3}$/).test(this.dbDescription)
      },
      csvState() {
        let res = false
        if (this.csv) {
          if (this.csv.length > 0) {
            res = true
          }
        }
        return res
      },
      isSaveReady() {
        return this.csvState && this.dbNameState && this.dbDescriptionState
      },
      dbUniqueName() {
        return (this.dbName + '_' + this.$store.state.user.uid).toLowerCase()
      },
      loginChecked: function () {
        return this.$store.state.loginStatus === 1
      },
    },
    watch: {
      loginChecked: function () {
        this.fetchData()
      }
    },
    data() {
      return {
        csv: null,
        csv_original: null,
        dbName: '',
        dbDescription: '',
      };
    },
    mounted() {
      if (this.loginChecked) {
        this.fetchData()
      }
    },
    methods: {
      async fetchData() {
        const res = await this.$store.dispatch('loadFctFromPouch',
          {dbName: this.$store.state.fctDb, url: this.$store.state.cloudantUrl})
          .catch(err => {
            this.$nuxt.error(err)
          })
        this.csv = res.map(function (val) {
          return {
            'id': val.doc.id,
            '_id': val.doc._id,
            '_rev': val.doc._rev,
            'Group': val.doc.Group,
            'Name': val.doc.Name,
            'En': val.doc.En,
            'Pr': val.doc.Pr,
            'Va': val.doc.Va,
            'Fe': val.doc.Fe,
          }
        })
        // replicate csv as original
        this.csv_original = JSON.parse(JSON.stringify(this.csv))

        const res2 = await this.$store.dispatch('getFctInfo').catch(err => {
          this.$nuxt.error(err)
        })
        this.dbName = res2.dbName
        this.dbDescription = res2.description
      },
      onFctChange(val) {
        this.csv = JSON.parse(JSON.stringify(val))
      },
      saveFct() {
        const csv_new = this.csv.map(item=>{
          return JSON.stringify(item)
        })
        const csv_old = this.csv_original.map(item=>{
          return JSON.stringify(item)
        })
        const diffPlus = csv_new.filter(item => {
          return !csv_old.includes(item)
        })
        const diffMinus = csv_old.filter(item => {
          return !csv_new.includes(item)
        })
        console.log({add: JSON.parse(diffPlus), del: JSON.parse(diffMinus)})
        return {add: JSON.parse(diffPlus), del: JSON.parse(diffMinus)}
      },
    }
  }
</script>
