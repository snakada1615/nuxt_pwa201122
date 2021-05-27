<template>
  <div>
    <b-container class="mt-2">
      <b-table class="mt-4" :items="myDat.items" :fields="myDat.fields">
        <template #cell(index)="myDat">
          {{ myDat.index + 1 }}
        </template>
        <template #cell(name)="myDat">
          <b-form-input
            type="text"
            v-model="myDat.item.name"
          />
        </template>
        <template #cell(qty)="myDat">
          <b-form-input
            type="number"
            v-model="myDat.item.qty"
          />
        </template>
        <template #cell(action)="myDat">
          <b-button @click="saveFruit(myDat.item.name)" variant="success">
            Save
          </b-button>
        </template>
      </b-table>
    </b-container>
    {{ myDat.items }}
  </div>
</template>

<style scope>
  .red {
    color: red;
  }
</style>

<script>
  export default {
    data() {
      return {
        myDat:{
          items: [
            {name: 'Apple', qty: 5},
            {name: 'Banana', qty: 10},
          ],
          fields: [
            {
              key: 'index',
              label: '#',
            },
            {
              key: 'name',
              label: 'fruit',
            },
            {
              key: 'qty',
              label: 'quantity',
              thClass: 'red',
            },
            {
              key: 'action',
            },
          ],
        }
      }
    },
    methods: {
      saveFruit(fruit) {
        console.log(`Saving fruit: ${fruit}`);
      },
    },
  }
</script>
