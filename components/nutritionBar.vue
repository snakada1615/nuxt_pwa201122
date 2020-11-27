<template>
  <div class="page">
    import { faMapMarkerAlt } from ‘@fortawesome/free-solid-svg-icons’
    <div>{{ halo }}</div>
    <select id="example">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <button @click="mybar">mybar</button>
    <span style="font-size: 3em; color: Tomato;">
      <i class="fas fa-camera"></i>
    </span>
    <font-awesome-icon :icon="['fa', 'angry']" />
  </div>
</template>


<script>
import { barrating } from '@/plugins/myPlugin'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

var $ = require('jquery')
//var barRating = required('jquery-bar-rating')
//import { jquery } from '@/plugins/myPlugin'

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
    //$('body').html('Hello World!');
  },
  methods: {
    mybar() {
      $('#example').barrating({
        theme: 'faMapMarkerAlt'
      });
    }
  }
}
</script>
