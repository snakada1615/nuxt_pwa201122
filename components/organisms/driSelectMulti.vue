<template>
  <b-container class="my-0 px-0">
    <b-table
      striped
      bordered
      head-row-variant="success"
      table-variant="light"
      :fixed=true
      :items="tableItems"
      :fields="fieldDRI"
      :sort-by.sync="sortBy"
      small
    >

      <template #cell(number)="data">
        <b-form-input
          :value="data.item.number"
          @input="onPopulationChange($event, data.index)"
          :state="statusPopulationNumber(data.item.number)"
          type="number"
          size="sm"
        ></b-form-input>
      </template>
    </b-table>
    {{tableItems}}
    <b-table
      striped
      bordered
      small
      :fixed=true
      head-row-variant="success"
      table-variant="light"
      :items="total"
      :fields="fieldTotal"
    >
      <template #cell(Value)="data">
        <span class="text-info">{{ formatNumber(data.value, data.index) }}</span>
      </template>
    </b-table>
    KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
  </b-container>
</template>

<script>
import { setDigit } from "@/plugins/helper"

export default {
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
      tableItems: [],
    }
  },
  props: {
    driPopulations: {
      type: Array,
      default: [{id: 0, count: 1}]
    },
    driItems: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 1000000,
    },
    inputName: '',
  },
  watch: {
    driPopulations: {
      deep: true,
      immediate: true,
      handler(val) {
        this.tableItems.length = 0
        this.tableItems = JSON.parse(JSON.stringify(
          this.updateTable(this.driItems, val)
        ))
        console.log(this.driItems)
        console.log(this.tableItems)
      },
    }
  },
  computed: {
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
      return [
        {Item: 'target', Value: 'mixed'},
        {Item: 'Energy', Value: result.En},
        {Item: 'Protein', Value: result.Pr},
        {Item: 'Vit_A', Value: result.Va},
        {Item: 'Iron', Value: result.Fe},
        {Item: 'id', Value: 0}
      ]
    },
  },
  mounted() {
    this.tableItems.length = 0
    this.tableItems = JSON.parse(JSON.stringify(
      this.updateTable(this.driItems, this.driPopulations)
    ))
  },
  methods: {
    formatNumber(val, index){
      if (index === 0){
        return 'mixed'
      }
      if (index === 5){
        return val
      }
      return setDigit(val, index)
    },
    statusPopulationNumber(val) {
      return (val >= 0 && val <= this.max)
    },
    updateTable(driValue, selectedValue) {
      return driValue.map(function (driItem) {
        const res = selectedValue.filter(
          item => Number(item.id) === Number(driItem.id)
        )
        driItem.number = res.length ? res[0].count : 0
        return driItem
      })
    },
    onPopulationChange(event, index) {
      /**
       * triggers when dri selection changed
       */

      console.log(this.tableItems)
      this.$emit('changeNutritionGroup', this.tableItems)
      /**
       * triggers when dri selection changed
       */
      console.log(this.total)
      this.$emit('changeNutritionTarget', this.total)
    },
  }
}
</script>
