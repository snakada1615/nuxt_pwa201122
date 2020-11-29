<template>
  <b-container>
    <b-row class="my-2" v-show="showFCT">
      <b-card bg-variant="light" border-variant="success" class="mx-1 px-0">
        <fct-table></fct-table>
      </b-card>
    </b-row>
    <b-row>
      <b-col>
        <b-form-checkbox v-model="showFCT" name="FCT-button" switch>
          Show FCT
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row><b-col class="px-0">
      <b-card bg-variant="light" border-variant="success" class="mx-1 px-2">
        <b-row class="mt-2">
          <nutrition-bar
            cropName="Energy"
            :iconNum=iconNum
            :max="10"
          ></nutrition-bar>
        </b-row>
        <b-row>
          <nutrition-bar
            cropName="Protain"
            :iconNum=iconNum
            :max="10"
          ></nutrition-bar>
        </b-row>
        <b-row>
          <nutrition-bar
            cropName="Vit-A"
            :iconNum=iconNum
            :max="10"
          ></nutrition-bar>
        </b-row>
        <b-row class="mb-2">
          <nutrition-bar
            cropName="Iron"
            :iconNum=iconNum
            :max="10"
          ></nutrition-bar>
        </b-row>
      </b-card>
    </b-col></b-row>
  </b-container>
</template>

<style>
  /* force rotate when screen width less than 450 */
  @media screen and (min-width: 320px) and (max-width: 450px) and (orientation: portrait) {
    html {
      transform: rotate(-90deg);
      transform-origin: left top;
      width: 100vh;
      overflow-x: hidden;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }

</style>

<script>
  import fctTable from '~/components/FctTable'
  import nutritionBar from "~/components/nutritionBar";

  export default {
    components: {
      fctTable,
      nutritionBar,
    },
    data() {
      return {
        iconNum: 1,
        showFCT: true
      }
    },
    methods: {
      setIcon() {
        this.iconNum += 1
        console.log(this.iconNum)
      }
    }
  }
</script>
