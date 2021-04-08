<template>
  <b-container class="my-0 px-0">
    <div>
      <b-table
        striped
        bordered
        small
        ref="table"
        :items="items"
        :fields="fields"
        @input="onInput"
        @row-clicked="rowClick"
        foot-clone
        v-bind="$attrs">

        <!-- A custom formatted footer cell for field 'name' -->
        <template #cell(Name)="data">
          <span class="text-info">{{ data.value }}</span>
          <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="delClick(data.index)">
            <b-badge variant="gray-400" class="px-0 py-0">
              <b-icon icon="X"></b-icon>
            </b-badge>
          </b-button>
        </template>
        <template #foot(Name)="data">
          <span>total</span>
        </template>
        <template #foot(En)="data">
          <span class="text-info">{{ nutritionSum.En }}</span>
        </template>
        <template #foot(Pr)="data">
          <span class="text-info">{{ nutritionSum.Pr }}</span>
        </template>
        <template #foot(Va)="data">
          <span class="text-info">{{ nutritionSum.Va }}</span>
        </template>
        <template #foot(Fe)="data">
          <span class="text-info">{{ nutritionSum.Fe }}</span>
        </template>
        <template #foot(Wt)="data">
          <span class="text-info">{{ nutritionSum.Wt }}</span>
        </template>

      </b-table>
    </div>
  </b-container>
</template>

<script>

  export default {
    props: {
      items: {
        type: Array,
        default: () => [
          {id: "1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196"},
          {id: "2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"}
        ],
      },
      FoodGrp: {
        type: Array,
        default: () => [
          {name: 'Grains, roots and tubers'},
          {name: 'Legumes and nuts'},
          {name: 'Vitamin A rich fruits and Vegetable'},
          {name: 'Other fruits and vegetables'},
          {name: 'Flesh foods'},
          {name: 'Dairy products'},
          {name: 'Eggs'},
          {name: 'non-category'}
        ],
      }
    },
    watch:{
      items:{
        handler(value){
          console.log(value)
          this.nutritionSum = {...this.updateSum(value)}
          console.log(this.nutritionSum)
        }
      }
    },
    data() {
      return {
        nutritionSum:{},
        fields: [
          {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: true},
          {key: 'En', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Va', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Fe', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        ],
      }
    },
    methods: {
      updateSum(array){
          return array.reduce((accumulator, item) => {
            accumulator.En = (accumulator.En || 0) + item.En
            accumulator.Pr = (accumulator.Pr || 0) + item.Pr
            accumulator.Va = (accumulator.Va || 0) + item.Va
            accumulator.Fe = (accumulator.Fe || 0) + item.Fe
            return accumulator
          }, {})
      },
      onInput() {
        this.$emit('totalChanged', this.nutritionSum)
      },
      rowClick(record) {
        this.$emit('rowClick', record)
      },
      delClick(id) {
        let res = []
        this.items.forEach(function (val, index) {
          if (index !== id) {
            res.push(val)
          }
        })
        this.$emit('delItem', res)
      },
    }
  }
</script>
