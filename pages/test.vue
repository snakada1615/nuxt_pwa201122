<template>
  <div>
    <vee-input2
      name="inputtest"
      type="number"
      :value="inputValueTemp"
      rules="min_value:0|max_value:500"
      @input="onInput"
    >
    </vee-input2>
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
  import veeInput2 from "../components/atoms/veeInput2";
  import driTableGroup from "../components/organisms/driTableGroup";
  export default {
    components:{
      veeInput2,
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
      onInput(value){
        console.log('inp' + value)
        this.inputValueTemp = value
      },
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
