<template>
  <div>
    <b-button v-b-modal.modal-1>Launch demo modal</b-button>
    <b-modal id="modal-1" title="BootstrapVue" @ok="clickOk" @cancel="clickCancel">
      <p class="my-4">Hello from modal!</p>
      <vee-input
        v-model="inputWeight"
        placeholder="Weight of Food"
        name="sample-input"
        type="number"
        rules="min_value:0|max_value:500"
      ></vee-input>
    </b-modal>
  </div>
</template>

<script>
  import veeInput from "../components/atoms/veeInput";
  export default {
    components:{
      veeInput
    },
    props:{
      items: {
        type: Array,
        default: () => [],
      },
    },
    data(){
      return{
        inputWeight: 0
      }
    },
    methods: {
      // ...
      clickOk(){
        console.log('OK')
      },
      clickCancel(){
        console.log('Cancel')
      },
    }
  }

</script>
