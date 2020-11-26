<template>
  <div class="page">
    <div>{{ halo }}</div>
    <select id="example">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  </div>
</template>


<script>
  var $ = require('jquery')
  //var barRating = required('jquery-bar-rating')
  //import { jquery } from '@/plugins/myPlugin'
  //import { barRating } from '@/plugins/myPlugin'

  //import Vue from 'vue';
  //import barRating from 'jquery-bar-rating';
  //Vue.use(barRating);

  export default {
    data() {
      return {
        halo: "hello",
      }
    },
    mounted() {
      console.log("halo")
      $('body').html('Hell World!');
      $('#example').barRating({
        theme: 'fontawesome-stars'
      });
    }
  }
</script>
