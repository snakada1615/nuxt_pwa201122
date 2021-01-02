<template>
  <div>
    <dri-table-group
      v-model="itemDat"
      input-name='ahoaho'
      rules="min_value:0|max_value:500"
      head-row-variant="success"
      table-variant="light"
    >
    </dri-table-group>
    <b-button>dialog</b-button>
  </div>
</template>

<script>
  import driTableGroup from "../components/organisms/driTableGroup";
  export default {
    components:{
      driTableGroup,
    },
    data(){
      return {
        itemDat: [
          {id:'1', Name: 'nakada01', number: '7', En:'100', Pr:'80', Va:'80', Fe:'80'},
          {id:'2', Name: 'nakada02', number: '17', En:'100', Pr:'80', Va:'80', Fe:'80'},
          {id:'3', Name: 'nakada03', number: '37', En:'100', Pr:'80', Va:'80', Fe:'80'},
          {id:'4', Name: 'nakada04', number: '27', En:'100', Pr:'80', Va:'80', Fe:'80'},
          {id:'5', Name: 'nakada05', number: '75', En:'100', Pr:'80', Va:'80', Fe:'80'},
        ],
      }
    },
  }
</script>
