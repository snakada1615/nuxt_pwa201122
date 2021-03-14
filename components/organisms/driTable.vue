<template>
  <b-container>
    <b-form-select v-model="selectedItem" :options="options" size="sm" class="mb-2"></b-form-select>
    <b-table
      striped
      small
      :items="selectedDRI"
      :fields="fields1"
      v-bind="$attrs"
    >
    </b-table>
  </b-container>
</template>

<script>
  export default {
    model: {
      prop: 'selected',
      event: 'change'
    },
    data() {
      return {
        fields1: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
        selectedDRI: [],
      }
    },
    computed: {
      selectedItem: {
        get: function () {
          return this.selected
        },
        set: function (selectedItem) {
          this.selectedDRI = this.setDRI(selectedItem)
          this.$emit('changeTarget', this.selectedDRI)
          this.$emit('change', selectedItem)
        }
      },
      options: function () {
        let result = this.items.map(function (value) {
          return {
            'value': value.id,
            'text': value.Name
          }
        })
        result.push({
          'value': '',
          'text': 'Please select target beneficiary',
          disabled: true,
          selected: true,
        })
        return result
      },
    },
    props: {
      selected: null,
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
      setDRI: function (selectedId) {
        const vm = this
        let tableItem = []
        //vm.selectedData.length = 0
        const dat = vm.items.filter(function (item) {
          return item.id === selectedId
        })
        if (dat.length !== 1) {
          return []
        } else {
          tableItem.push(
            {Item: 'target', Value: dat[0].Name},
            {Item: 'Energy', Value: dat[0].En},
            {Item: 'Protein', Value: dat[0].Pr},
            {Item: 'Vita-A', Value: dat[0].Va},
            {Item: 'Iron', Value: dat[0].Fe}
          )
          return tableItem
        }
      }
    }
  }
</script>
