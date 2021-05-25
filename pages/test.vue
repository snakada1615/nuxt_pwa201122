<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2">
    <dri-select-single
      :items="DRI"
      :target="nutritionTarget"
      @changeNutritionGroup="updateSelection"
      @changeNutritionTarget="updateNutrition"
    >
    </dri-select-single>
    <b-card>{{nutritionTarget}}</b-card>
    <b-card>{{info}}</b-card>
    <dri-select-multi
      :driItems="DRI"
      :driPopulations="nutritionTarget"
    >
    </dri-select-multi>
  </b-container>
</template>

<script>
  import driSelectSingle from "@/components/organisms/driSelectSingle";
  import driSelectMulti from "@/components/organisms/driSelectMulti";

  export default {
    components: {
      driSelectSingle,
      driSelectMulti
    },
    data() {
      return {
        info: [],
        nutritionTarget: [
          {
            id: 1,
            count: 1,
          },
        ],
        DRI: [
          {
            En: "1088.0",
            Fe: "5.8",
            max_vol: "900",
            Name: "child 6-23 month",
            Pr: "11.65",
            Va: "400.0",
            id: 0
          },
          {
            En: "3066.0",
            Fe: "44.4",
            max_vol: "2500",
            Name: "lactating",
            Pr: "61.0",
            Va: "850.0",
            id: 1
          },
          {
            En: "2913.0",
            Fe: "24.9",
            max_vol: "2600",
            Name: "adolescent all",
            Pr: "52.65",
            Va: "600.0",
            id: 2
          }
        ],
      }
    },
    methods: {
      updateSelection(val) {
        this.nutritionTarget.length = 0
        this.nutritionTarget.push(JSON.parse(JSON.stringify(val)))
      },
      updateNutrition(val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
</script>
