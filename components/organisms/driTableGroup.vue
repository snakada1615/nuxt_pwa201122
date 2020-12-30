<template>
  <b-container class="my-0 px-0">
    <b-table
      striped
      bordered
      head-row-variant="success"
      table-variant="light"
      :items="tableItems"
      :fields="fields1"
      :sort-by.sync="sortBy"
      small>

      <template #cell(number)="row">
        <vee-input
          mode="aggressive"
          type="number"
          :value="populationNumber[row.index]"
          :name="inputName"
          :rules="rules"
          @input="onPopulationChange($event, row.index)"
        ></vee-input>
      </template>
    </b-table>

    <b-table
      striped
      :items="selectedData"
      :fields="fields2"
      small
      v-bind="$attrs"
    ></b-table>
    {{ populationNumber }}
  </b-container>
</template>

<script>
  import veeInput from "../atoms/veeInput";

  export default {
    components: {
      veeInput
    },
    data() {
      return {
        selectedData: [],
        selectedValue: null,
        fields1: [
          {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'name', sortable: false},
          {key: 'number', sortable: false},
        ],
        sortBy: 'id',
        fields2: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
      }
    },
    props: {
      mySelection: null,
      items: {
        type: Array,
        default: () => [],
      },
      rules: {
        type: String,
      },
      inputName: '',
    },
    computed: {
      tableItems: function () {
        return this.items.map(function (value) {
          return {
            'id': value.id,
            'name': value.name,
            'number': value.number,
          }
        })
      },
      populationNumber: function () {
        return this.items.map(a => a.number)
      },
    },
    methods: {
      onPopulationChange(event, index) {
        this.populationNumber[index] = event
        this.$emit('input', this.populationNumber)
        console.log(this.populationNumber)
      },
      changeSelection() {
        const vm = this
        vm.selectedData.length = 0
        const dat = vm.items.filter(function (item) {
          return item.id === vm.selectedValue
        })
        if (dat.length !== 1) {
          console.log('Error in dri dataset')
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
    }
  }
</script>
