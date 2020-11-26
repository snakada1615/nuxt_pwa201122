<template>
  <div class="page">
    <fct-table></fct-table>
    <nutrition-bar></nutrition-bar>
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

  }
</script>
