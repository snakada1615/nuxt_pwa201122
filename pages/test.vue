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
      {{csv}}
    </b-card>
    <b-card>
      <fct-table
        v-if="csv"
        :items="csv"
        head-row-variant="success"
        table-variant="light"
      />
    </b-card>
    <b-button
      variant="info"
      size="sm"
      class="my-2"
    >save to server</b-button>
  </b-container>
</template>

<script>
  import vueCsvImport from 'vue-csv-import'
  import FctTable from "@/components/organisms/FctTable";

  export default {
    components:{
      vueCsvImport,
      FctTable
    },
    computed:{
      cropGroup: function () {
        let uniqueGroup = []
        let result = []
        if (this.csv){
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
          'Fe'
        ]
      };
    }
  };
</script>
