<template>
  <div>
    <b-button @click="openModal">Launch demo modal</b-button>
    <food-modal
      :init-weight="inputWeight"
      my-name="bakabaka"
      my-type="Number"
      rules="min_value:0|max_value:500"
    ></food-modal>
    <b-button @click="inputWeight=8">change</b-button>
  </div>
</template>

<script>
  import foodModal from "~/components/organisms/foodModal";

  export default {
    components:{
      foodModal,
    },
    props:{
      items: {
        type: Array,
        default: () => [],
      },
    },
    data(){
      return{
        inputWeight: 30
      }
    },
    methods: {
      // ...
      openModal(){
        this.$bvModal.show('bakabaka')
      },
      clickOk(){
        let result = {}
        //result.item = this.items
        result.Wt = this.inputWeight
        console.log(this.inputWeight)
        this.$emit('modalOk', result)
      },
      clickCancel(){
        console.log('Cancel')
      },
    }
  }

</script>
