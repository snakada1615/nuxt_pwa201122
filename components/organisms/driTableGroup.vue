<template>
  <b-container class="my-0 px-0">
    <b-table
      striped
      bordered
      head-row-variant="success"
      table-variant="light"
      :items="tableItems"
      :fields="fieldDRI"
      :sort-by.sync="sortBy"
      small
    >

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
      bordered
      small
      head-row-variant="success"
      table-variant="light"
      :items="total"
      :fields="fieldTotal"
    ></b-table>
  </b-container>
</template>

<script>
  import veeInput from "../atoms/veeInput";
  const formatRound = new Intl.NumberFormat('ja', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  export default {
    components: {
      veeInput
    },
    model: {
      prop: 'items',
      event: 'input'
    },
    data() {
      return {
        selectedData: [],
        selectedValue: null,
        fieldDRI: [
          {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: false},
          {key: 'number', sortable: false},
        ],
        sortBy: 'id',
        fieldTotal: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
//        tableItems:[],
      }
    },
    props: {
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
      tableItems: function(){
        const vm = this
        return vm.items.map(function (value, index) {
          value.number = vm.populationNumber[index]
          return value
        })
      },
      populationNumber: function () {
        return this.items.map(a => a.number)
      },
      total: function () {
        let result = {}
        result.En = 0
        result.Pr = 0
        result.Va = 0
        result.Fe = 0
        this.items.forEach(function (value) {
          result.En += Number(value.En) * Number(value.number)
          result.Pr += Number(value.Pr) * Number(value.number)
          result.Va += Number(value.Va) * Number(value.number)
          result.Fe += Number(value.Fe) * Number(value.number)
        })
        return [
          {Item: 'target', Value: 'mixed'},
          {Item: 'Energy', Value: formatRound.format(result.En)},
          {Item: 'Protein', Value: formatRound.format(result.Pr)},
          {Item: 'Vita-A', Value: formatRound.format(result.Va)},
          {Item: 'Iron', Value: formatRound.format(result.Fe)}
        ]
      }
    },
    methods: {
      onPopulationChange(event, index) {
        const vm = this
        const result = vm.items.map(function (value, i) {
          if (i === index) {
            value.number = event
          }
          return value
        })
        this.$emit('input', result)
      },
    }
  }
</script>
