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
  /**
   * this component is a combination of dropdown menu and table linked together.
   *
   * table shows DRI information to match with items selected from dropdown menu
   *
   */

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
      // to reflect property on initial loading
      this.onChange(this.value)
    },
    computed: {
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
      /**
       * value of selecetd item
       */
      value: null,
      /**
       * list of DRI information
       */
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
      onChange:function(val){
        if (val > 0) {
          this.selectedDRI = [...this.setDRI(val)]

          /**
           * triggers when dri selection changed
           * @property {Number} value selected DRI id
           */
          this.$emit('change', val)
          /**
           * triggers when dri selection changed
           * @property {Object} value set of DRI information
           */
          this.$emit('changeDri', this.selectedDRI)
        }
      },
      setDRI: function (selectedId) {
        const vm = this
        let tableItem = []
        //vm.selectedData.length = 0
        const dat = vm.items.filter(function (item) {
          return item.id === String(selectedId)
        })
        if (dat.length !== 1) {
          return []
        } else {
          tableItem.push(
            {Item: 'target', Value: dat[0].Name},
            {Item: 'Energy', Value: dat[0].En},
            {Item: 'Protein', Value: dat[0].Pr},
            {Item: 'Vit_A', Value: dat[0].Va},
            {Item: 'Iron', Value: dat[0].Fe},
            {Item: 'id', Value: selectedId}
          )
          return tableItem
        }
      }
    }
  }
</script>
