test component example

```vue
<template> 
   <b-container>
     <div>test</div>
     <test
       :name.sync="name"
     ></test>
     <b-form-input
       placeholder="Enter your name"
       v-model="name"
     ></b-form-input>
   </b-container>
</template>

<script>
  export default {
    data(){
      return{
        name: 'shunichi'
      }
    }
  }
</script>
```
