<template>
  <b-container class="my-0 px-0">
    <div>
      <b-form-select v-model="selectedValue" :options="menuOptions" @change="changeSelection"></b-form-select>
    </div>
    <b-table
      striped
      ref="table"
      :items="selectedData"
      :fields="fields"
      small
    ></b-table>
  </b-container>
</template>

<script>
  import PouchDB from 'pouchdb'

  var $ = require('jquery');

  export default {
    data() {
      return {
        selectedData: [],
        selectedValue: null,
        fields: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
      }
    },
    props: {
      mySelection: null,
      items: {
        type: Array,
        default: () => [
        ],
      },
    },
    watch: {
      mySelection: { // 外からプロパティの中身が変更になったら実行される
        immediate: true,
        handler(value) {
          console.log('watching...' + value)
          this.selectedValue = String(value);
          this.changeSelection()
          console.log('working?...')
        }
      }
    },
    computed: {
      menuOptions: function () {
        let result = this.items.map(function (value) {
          return {
            'value': value.id,
            'text': value.Name
          }
        })
        return result
      }
    },
    methods: {
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
