<template>
  <b-container>
    <vue-csv-import
      v-model="csv"
      url="/hello"
      :map-fields=fields>

      <template slot="hasHeaders" slot-scope="{headers, toggle}">
        <label>
          <input type="checkbox" id="hasHeaders" :value="headers" @change="toggle">
          do you have header in your file?
        </label>
      </template>

      <template slot="error">
        File type is invalid
      </template>

      <template slot="thead">
        <tr>
          <th>My Fields</th>
          <th>Column</th>
        </tr>
      </template>

      <template slot="next" slot-scope="{load}">
        <button @click.prevent="load">import!</button>
      </template>

      <template slot="submit" slot-scope="{submit}">
        <button @click.prevent="submit">extract!</button>
      </template>
    </vue-csv-import>
    <b-card>
      <fct-table
        v-if="csvState"
        :items="csv"
        head-row-variant="success"
        table-variant="light"
      />
    </b-card>
    <b-card>
      <b-row class="my-1">
        <b-col cols="3">
          Name:
        </b-col>
        <b-col cols="9">
          <b-form-input
            placeholder="database name"
            v-model="dbName"
            :disabled="!csvState"
            size="sm"
            :state="dbNameState"
          ></b-form-input>
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
          >save to server</b-button>
        </b-col>
      </b-row>
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
