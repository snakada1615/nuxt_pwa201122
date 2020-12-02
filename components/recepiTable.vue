<template>
  <b-container class="my-0 px-0">
    <div>
      <b-table
        striped
        small
        ref="table"
        :items="items"
        :fields="fields"
        @input="inputData"
        foot-clone>

        <!-- A custom formatted footer cell for field 'name' -->
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
          {id:"1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196"},
          {id:"2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"}
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
    computed:{
      nutritionSum: function () {
        let sum_En = 0
        let sum_Pr = 0
        let sum_Va = 0
        let sum_Fe = 0
        let sum_Wt = 0
        this.items.forEach((value) =>{
          sum_En += Number(value.En)
          sum_Pr += Number(value.Pr)
          sum_Va += Number(value.Va)
          sum_Fe += Number(value.Fe)
          sum_Wt += Number(value.Wt)
        })
        sum_En = Math.round(sum_En)
        sum_Pr = Math.round(sum_Pr)
        sum_Va = Math.round(sum_Va)
        sum_Fe = Math.round(sum_Fe)
        sum_Wt = Math.round(sum_Wt)
        console.log('sum_Wt=' + sum_Wt)
        return {En: sum_En, Pr: sum_Pr, Va: sum_Va, Fe: sum_Fe, Wt: sum_Wt}
      }
    },
    data() {
      return {
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
      inputData() {
        this.$emit('inputData', this.nutritionSum)
      }
    }
  }
</script>
