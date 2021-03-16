<template>
  <b-container>
    halo music:
    <feasibility-check-component
      :dri-org="itemsDRI"
      :fct-org="items"
      :dri-id.sync="driID"
      :selected-item.sync="selectedItem"
      :ans-list.sync="ansList"
    />
  </b-container>
</template>

<script>
  import feasibilityCheckComponent from "@/components/organisms/feasibilityCheckComponent";
  import {getDRI, getFCT} from "@/plugins/pouchHelper";

  export default {
    components:{
      feasibilityCheckComponent
    },
    data(){
      return{
        driID: "0",
        items:[],
        itemsDRI: [],
        selectedItem:{},
        ansList:[],
      }
    },
    mounted() {
      const vm = this
      getFCT().then(function (dat) {
        vm.items = dat
      })
      getDRI().then(function (dat) {
        vm.itemsDRI = dat
      })
    },
    methods: {

    },
  }
</script>

