<template>
  <div id="diversityCheck">
    <p v-for="val in vals">
      {{ val.name }}
      <input type="checkbox"  v-model="checkedVal" :value="val" >
    </p>
    <span>{{ checkedVal }}</span>
    <b-form-checkbox-group
      stacked
      :checked="propSelected"
      :options="propOptions"
      @change="onChecked"
    >
    </b-form-checkbox-group>
    <span>{{ propSelected }}</span>
  </div>
</template>

<script>
  export default {
    props:{
      propOptions:{
        type:Array,
        required:true
      },
      propSelected:{
        type: Array,
        required: true
      }
    },
    data(){
      return {
        vals: [
          {id: 1, name: "a", obj: {id2: 11}},
          {id: 2, name: "b", obj: {id2: 12}},
          {id: 3, name: "c", obj: {id2: 13}},
          {id: 4, name: "d", obj: {id2: 14}},
          {id: 5, name: "e", obj: {id2: 15}},
        ],
        checkedVal: [
          {id: 1, name: "a", obj: {id2: 11}},
        ],
        selectedOption:['a', 'c']
      }
    },
    methods: {
      onChecked(value){
        console.log(value)
        this.$emit('change', value)
      }
    }

  }

</script>
