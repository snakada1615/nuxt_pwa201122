<template>
  <b-container>
    <b-button variant="success"
              class="mt-2"
              @click="$bvModal.show('WS')"
    >push WS</b-button>
    <select-workspace
      id="WS"
      :workspaceList="items"
      @workspaceCreated="test1"
      @workspaceSelected="test2"/>
  </b-container>
</template>

<script>
  import selectWorkspace from "@/components/molecules/selectWorkspace"

  export default {
    data () {
      return {
        items: [
          {caseId: 'homework'},
          {caseId: 'tonight'},
          {caseId: 'good morning'},
          {caseId: 'bye bye'},
        ],
      }
    },
    components:{
      selectWorkspace
    },
    methods:{
      test1(val){
        console.log('created')
        console.log(val)
      },
      test2(val){
        console.log('selected')
        console.log(val)
      },
    }
  }
</script>
