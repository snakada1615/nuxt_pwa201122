<template>
  <b-modal :id="myName" :title="myModalHeader" @ok="clickOk" @cancel="clickCancel">
    <p class="my-4">Hello from modal!</p>
    <vee-input
      v-model="myWeight"
      :name="inputName"
      type="number"
      :rules="rules"
      v-bind="$attrs"
    ></vee-input>
  </b-modal>
</template>

<script>
  import veeInput from '~/components/atoms/veeInput';

  export default {
    components: {
      veeInput
    },
    props: {
      items: {
        type: Array,
        default: () => [],
      },
      initWeight: {
        type: Number,
        default: 0,
      },
      myName: {
        type: String,
        required: true,
      },
      myModalHeader: {
        type: String,
      },
      rules: {
        type: String,
      },
      myType: {
        type: String,
      },
    },
    computed: {
      inputName() {
        return this.myName + '_input'
      }
    },
    data() {
      return {
        myWeight: this.initWeight
      }
    },
    methods: {
      // ...
      clickOk() {
        console.log('OK')
        console.log(this.myWeight)
        this.$emit('input', this.myWeight)
      },
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
