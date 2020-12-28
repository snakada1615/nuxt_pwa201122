<template>
  <div>
    <vee-input3
      name="inputtest"
      type="number"
      v-model="inputValueTemp"
      rules="min_value:0|max_value:500"
    >
    </vee-input3>
    {{inputValueTemp}}
    <dri-table-group
      :items="itemDat"
      input-name="ahoaho"
      rules="min_value:0|max_value:500"
      head-row-variant="success"
      table-variant="light"
      @input="onTargetGroupChange"
    >
    </dri-table-group>
  </div>
</template>

<script>
  import veeInput3 from "../components/atoms/veeInput3";
  import driTableGroup from "../components/organisms/driTableGroup";
  export default {
    components:{
      veeInput3,
      driTableGroup,
    },
    data(){
      return {
        driID: "1",
        dat:0,
        itemDat: [
          {id:'1', name: 'nakada01', number: '7'},
          {id:'2', name: 'nakada02', number: '17'},
          {id:'3', name: 'nakada03', number: '37'},
          {id:'4', name: 'nakada04', number: '27'},
          {id:'5', name: 'nakada05', number: '75'},
        ],
        weight:10,
        inputValueTemp: 10
      }
    },
    methods: {
      onTargetGroupChange(value){
        console.log('population:' + value)
        this.itemDat = this.itemDat.map(function (element, index) {
          return {
            id: element.id,
            name:element.name,
            number:value[index]
          }
        })
      },
    }
  }
</script>
