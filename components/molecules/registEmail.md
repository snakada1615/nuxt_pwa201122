registEmail example:

```vue
<template>
  <b-container>
    <div>user: {{user.uid}}</div>
    <div>email: {{user.email}}</div>
    <b-button variant="success" @click="$bvModal.show('registEmail')">register</b-button>
    <regist-email
      id="registEmail"
      @registSuccess="registSuccess"/>
  </b-container>
</template>

<script>
  import registEmail from "@/components/molecules/registEmail"

  export default {
    components:{
      registEmail
    },
    data(){
      return {
        user:'',
      }
    },
    methods:{
       registSuccess(myParam){
          user.id = myParam.id
          user.email = myParam.email
       }
    }
  }
</script>
```
