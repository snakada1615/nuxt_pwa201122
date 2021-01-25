<template>
  <b-modal
    :id="myName"
    :title="myModalHeader"
    @ok="clickOk"
    @cancel="clickCancel"
    hide-header
  >
    <b-table
      small
      striped
      head-row-variant="success"
      :items="items"
      :fields="fields"
    ></b-table>
    <vee-input
      :value="value"
      @input="$emit('input', Number($event))"
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
      value: {
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
        fields: [
          {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: true, thStyle: {width: "290px"}},
          {key: 'Group', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'En', sortable: true, thStyle: {width: "50px"}},
          {key: 'Pr', sortable: true, thStyle: {width: "50px"}},
          {key: 'Va', sortable: true, thStyle: {width: "50px"}},
          {key: 'Fe', sortable: true, thStyle: {width: "50px"}},
        ],
      }
    },
    methods: {
      // ...
      clickOk() {
        let result = {}
        result.item = this.items
        result.Wt = this.value
        this.$emit('modalOk', result)
      },
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
