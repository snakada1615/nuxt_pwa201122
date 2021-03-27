driTable example:

```vue
<template>
    <b-container> 
      <dri-table
        v-model="driID"
        :items="DRI"
        @changeDri="(val)=>selectedDRI=val"
        head-row-variant="success"
        table-variant="light"
      />
       {{selectedDRI}}
    </b-container>
</template>
<script>
export default{
    data(){
      return {
        driID: 2,
        selectedDRI: {},
        DRI: [
          {
            En: "1088.0",
            Fe: "5.8",
            max_vol: "900",
            Name: "child 6-23 month",
            Pr: "11.65",
            Va: "400.0",
            id: 0
          },
          {
            En: "3066.0",
            Fe: "44.4",
            max_vol: "2500",
            Name: "lactating",
            Pr: "61.0",
            Va: "850.0",          
            id: 1
          },
          {
            En: "2913.0",
            Fe: "24.9",
            max_vol: "2600",
            Name: "adolescent all",
            Pr: "52.65",
            Va: "600.0" ,         
            id: 2
          } 
        ]            
      } 
    },  
    methods:{
      onInput(val){
        alert(val)
      },
    }
}
</script>
```









```
