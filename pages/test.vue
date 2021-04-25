<template>
  <b-container>
    <b-card>
      <b-row class="my-1">
        <b-col cols="3">
          Name:
        </b-col>
        <b-col cols="9">
          {{this.$store.state.dbName}}
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col cols="3">
          Description:
        </b-col>
        <b-col cols="9">
          <b-form-input
            placeholder="description of database"
            v-model="dbDescription"
            :disabled="!csvState"
            size="sm"
            :state="dbDescriptionState"
          ></b-form-input>
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
        <b-col class="mx-0">
          <b-button
            variant="info"
            size="sm"
            :disabled="!isSaveReady"
            @click="saveFct"
          >save FCT</b-button>
        </b-col>
      </b-row>
      <b-button
        variant="info"
        size="sm"
        @click="openFct"
      >open FCT</b-button>
    </b-card>
    <b-card>
      <fct-table
        v-if="csvState"
        :items="csv"
        head-row-variant="success"
        table-variant="light"
      />
    </b-card>
  </b-container>
</template>

<script>
  import vueCsvImport from 'vue-csv-import'
  import FctTable from "@/components/organisms/FctTable";

  export default {
    components: {
      vueCsvImport,
      FctTable
    },
    computed: {
      cropGroup: function () {
        let uniqueGroup = []
        let result = []
        if (this.csv) {
          this.csv.forEach(function (elem, index) {
            if (uniqueGroup.indexOf(elem.Group) === -1) {
              uniqueGroup.push(elem.Group)
              result.push({
                name: elem.Group
              })
            }
          })
        }
        //result.pop() // there are some bug in above code, which i cannot figure out
        return result
      },
      dbNameState() {
        return (/^[a-zA-Z0-9][a-zA-Z0-9-_]{1,37}[a-zA-Z0-9]{1,2}$/).test(this.dbName)
      },
      dbDescriptionState() {
        return (/^[a-zA-Z][a-zA-Z -.,_]{1,99}[a-zA-Z]{1,3}$/).test(this.dbDescription)
      },
      csvState(){
        let res = false
        if (this.csv){
          if (this.csv.length>0){
            res = true
          }
        }
        return res
      },
      isSaveReady(){
        return this.csvState && this.dbNameState && this.dbDescriptionState
      },
      dbUniqueName(){
        return (this.dbName + '_' + this.$store.state.user.uid).toLowerCase()
      }
    },
    data() {
      return {
        csv: null,
        fields: [
          'id',
          'Group',
          'Name',
          'En',
          'Pr',
          'Va',
          'Fe',
        ],
        dbName:'',
        dbDescription:'',
        deCreator:'',
      };
    },
    methods:{
      async openFct(){
        console.log(this.$store.state.user.name)
        let res = []
        await this.$store.dispatch('loadFctFromPouch', this.$store.state.fctDb)
        .then(function(val){
          return val.forEach(function (item) {
            res.push(item.doc)
          })
        })
        this.csv = res
      },
      saveFct(){
        console.log(this.dbName)
        console.log(this.dbDescription)
        console.log(this.$store.state.user.name)
        this.$store.dispatch('saveFctToPouch',{
          _id: this.dbName,
          dbName: this.dbUniqueName,
          description: this.dbDescription,
          creator: this.$store.state.user.name,
          data: this.csv,
        })
      }
    }
  };
</script>
