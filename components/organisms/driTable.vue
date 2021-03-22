<template>
  <b-container>
    <b-form-select
      :value="value"
      @change="onChange"
      :options="options"
      size="sm"
      class="mb-2">
    </b-form-select>
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
    data() {
      return {
        fields1: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
        selectedDRI: [],
      }
    },
    mounted() {
      this.onChange(this.value)
    },
    computed: {
      /**
       *
       * @returns {{text, value: *}[]}
       */
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
      value: null,
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
      onChange:function(val){
        this.selectedDRI = this.setDRI(val)
        this.$emit('change', val)
        this.$emit('changeDri', this.selectedDRI)
      },
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
            {Item: 'Iron', Value: dat[0].Fe},
            {Item: 'driId', Value: selectedId}
          )
          return tableItem
        }
      }
    }
  }
</script>
