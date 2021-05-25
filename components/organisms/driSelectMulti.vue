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

      <template #cell(number)="data">
        <b-form-input
          :value="data.En"
          @input="onPopulationChange($event, data.index)"
          size="sm"
        ></b-form-input>
      </template>
    </b-table>
    {{tableItems}}
    <b-table
      striped
      bordered
      small
      head-row-variant="success"
      table-variant="light"
      :items="total"
      :fields="fieldTotal"
    >
      <template #cell(Value)="data">
        <span class="text-info">{{ setDigit(data.value, data.index) }}</span>
      </template>
    </b-table>
    KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
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
    data() {
      return {
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
        tableItems:[],
      }
    },
    props: {
      driPopulations:{
        type:Array,
        default:[{id: 0, count: 1}]
      },
      driItems: {
        type: Array,
        default: () => [],
      },
      rules: {
        type: String,
      },
      inputName: '',
    },
    watch:{
      driPopulations: {
        deep: true,
        immediate: true,
        handler(val) {
          this.tableItems.length=0
          this.tableItems = JSON.parse(JSON.stringify(
            this.updateTable(this.driItems, val)
          ))
        },
      }
    },
    computed: {
      statusDataSet: function(){
        return (this.driItems.length>0 && this.driPopulations.length>0)
      },
      total: function () {
        const vm = this
        let result = {}
        result.En = 0
        result.Pr = 0
        result.Va = 0
        result.Fe = 0
        this.tableItems.forEach(function (value) {
          result.En += Number(value.En) * Number(value.number)
          result.Pr += Number(value.Pr) * Number(value.number)
          result.Va += Number(value.Va) * Number(value.number)
          result.Fe += Number(value.Fe) * Number(value.number)
        })
        console.log(result)
        return [
          {Item: 'target', Value: 'mixed'},
          {Item: 'Energy', Value: result.En},
          {Item: 'Protein', Value: result.Pr},
          {Item: 'Vit_A', Value: result.Va},
          {Item: 'Iron', Value: result.Fe}
        ]
      },
    },
    methods: {
      updateTable(driValue, selectedValue){
        const vm = this
        return driValue.map(function (driItem) {
          const res = selectedValue.filter(
            item => Number(item.id) === Number(driItem.id)
          )
          driItem.number = res.length ? res[0].count : 0
          return driItem
        })

      },
      setDigit(val, unitKey) {
        let res = ''
        const units = [
          {1: ' KC', 2: ' MC', 3: ' GC'},   // for dietary energy
          {1: ' g', 2: ' kg', 3: ' t'},    // for protein
          {1: ' µg', 2: ' mg', 3: ' g'},    // for vit-A
          {1: ' mg', 2: ' g', 3: ' kt'},    // for iron
        ]
        if (val === 'mixed') {
          return "mixed"
        }
        const item = Number(val)
        switch (true) {
          case (item < 1000):
            res = String(item) + units[unitKey - 1]["1"]
            break;
          case (item >= 1000 && item < 1000000):
            res = String(Math.round(item / 1000)) + units[unitKey - 1]["2"]
            break;
          case (item >= 1000000):
            res = String(Math.round(item / 1000000)) + units[unitKey - 1]["3"]
            break;
          default:
            console.log('parameter not valid:setDigit')
            res = ''
            break;
        }
        return res
      },
      onPopulationChange(event, index) {
        console.log(event)
        console.log(index)
        const vm = this
        const result = vm.tableItems.map(function (value, i) {
          if (i === index) {
            value.number = event
          }
          return value
        })
        /**
         * triggers when dri selection changed
         * @property {Object} value set of DRI information
         */
        this.$emit('changeDri', this.total)
        this.$emit('input', result)
      },
    }
  }
</script>
