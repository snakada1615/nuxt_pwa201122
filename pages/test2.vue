<template>
  <b-container class="my-0 py-0">
    <div>hello</div>
    <div>data: {{exampleData}}</div>
    <div>computed: {{exampleComputed}}</div>
    <b-button @click="exampleData++">modify data</b-button>
    <b-button @click="exampleComputed++">modify computed</b-button>
  </b-container>
</template>

<script>
  export default {
    data(){
      return {
        exampleData: 3
      }
    },
    computed:{
      exampleComputed:{
        get: function () {
          return this.exampleData +100
        },
        set: function (val) {
          console.log(val)
          this.exampleData = val-100
        }
      }
    }

  }
</script>
