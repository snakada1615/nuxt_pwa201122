driTableGroup example:

```vue
<template>
    <b-jumbotron border-variant="primary" bg-variant="light"> 
        <dri-table-group
          v-model="itemsDRI"
          input-name='inputForm'
          rules="min_value:0|max_value:500"
          head-row-variant="success"
          table-variant="light"
        />
    </b-jumbotron>
</template>
<script>
export default{
    data(){
      return {
        itemsDRI: [
          {
            En: "1088.0",
            Fe: "5.8",
            max_vol: "900",
            Name: "child 6-23 month",
            Pr: "11.65",
            Va: "400.0",
            number: 0,
            id: 0
          },
          {
            En: "3066.0",
            Fe: "44.4",
            max_vol: "2500",
            Name: "lactating",
            Pr: "61.0",
            Va: "850.0",          
            number: 0,
            id: 1
          },
          {
            En: "2913.0",
            Fe: "24.9",
            max_vol: "2600",
            Name: "adolescent all",
            Pr: "52.65",
            Va: "600.0" ,         
            number: 0,
            id: 2
          } 
        ]            
      } 
    },  
    methods:{
    }
}
</script>
```









```
