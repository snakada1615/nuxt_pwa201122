<template>
  <b-container>
    halo music:
    <b-row>
      <b-tabs lazy pills justified disabled="$store.state.isLoginChecked" content-class="mt-3">
        <b-tab v-for="(feasibilityCase, index) in WS.feasibilityCases" :key="index" :title="String(index + 1)">
          <feasibility-check-component
            :dri-org="itemsDRI"
            :fct-org="items"
            :dri-id.sync="feasibilityCase.driID"
            :selected-item.sync="feasibilityCase.selectedItem"
            :ans-list="feasibilityCase.ansList"
          />
        </b-tab>
      </b-tabs>
    </b-row>
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
        items:[],
        itemsDRI: [],
        tabNumber: 10,
        driID: "0",
        selectedItem:{},
        ansList:[],
        WS: {
          feasibilityCases: [],
          caseId: 'case01',
          user: '',
          saveDate: '',
        },
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

