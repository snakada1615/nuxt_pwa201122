<template>
  <div class="page">
    <b-container>
      <div>
        <b-form-checkbox v-model="showFCT" name="FCT-button" switch>
          Show FCT
        </b-form-checkbox>
      </div>
      <b-row class="my-2" v-show="showFCT">
        <fct-table></fct-table>
      </b-row>
      <b-row class="my-2">
        <nutrition-bar
          :iconNum = iconNum
          :max = "12"
        ></nutrition-bar>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import fctTable from '~/components/FctTable'
  import nutritionBar from "~/components/nutritionBar";

  export default {
    components: {
      fctTable,
      nutritionBar,
    },
    data(){
      return {
        iconNum: 1,
        showFCT: true
      }
    },
    methods: {
      setIcon(){
        this.iconNum+=1
        console.log(this.iconNum)
      }
    }
  }
</script>
