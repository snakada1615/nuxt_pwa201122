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
    <food-modal2
      my-name="test"
      rules="min_value:0|max_value:500"
      :items="itemFCT"
      v-model="value"
    >
    </food-modal2>
    <b-button @click="$bvModal.show('test')">dialog</b-button>
  </div>
</template>

<script>
  import veeInput3 from "../components/atoms/veeInput3";
  import driTableGroup from "../components/organisms/driTableGroup";
  import foodModal2 from "../components/organisms/foodModal2";
  export default {
    components:{
      foodModal2,
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
        itemFCT: [
          {id:'1', Name: 'nakada01', En: '7', Pr: '7', Va: '7', Fe: '7'},
          {id:'2', Name: 'nakada02', En: '17', Pr: '47', Va: '27', Fe: '47'},
          {id:'3', Name: 'nakada03', En: '27', Pr: '27', Va: '17', Fe: '37'},
          {id:'4', Name: 'nakada04', En: '37', Pr: '37', Va: '37', Fe: '27'},
          {id:'5', Name: 'nakada05', En: '47', Pr: '17', Va: '47', Fe: '17'},
        ],
        value:10,
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
