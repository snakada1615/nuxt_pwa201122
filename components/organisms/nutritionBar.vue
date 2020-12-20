<template>
  <b-container class="my-0">
    <b-row class="my-0">
      <b-col cols="3" class="px-0 d-flex justify-content-center">
        <div>{{ cropName }}</div>
      </b-col>
      <b-col cols="2" class="px-0 d-flex justify-content-center">
        <div>{{ nutritionTarget }}</div>
      </b-col>
      <b-col class="px-0 d-flex justify-content-start">
        <div>
          <fa-rating :glyph="myicon"
                     :item-size="20"
                     :spacing="-1"
                     :border-width="0"
                     active-color="#FF3333"
                     inactive-color="#cfcfcf"
                     :increment="increment"
                     :max-rating="max"
                     v-model="rating">
          </fa-rating>
          <span v-show="showReset"><a href="#" @click.prevent="rating = 0">Reset Rating</a></span>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
  var $ = require('jquery')
  import {FaRating} from 'vue-rate-it';
  import ThumbsUp from 'vue-rate-it/glyphs/thumbs-up';
  import apple from 'vue-rate-it/glyphs/apple';
  import navicon from 'vue-rate-it/glyphs/navicon';

  export default {
    components: {
      FaRating
    },
    props: {
      showReset: {
        type: Boolean,
        default: false,
      },
      rating: {
        type: Number,
        default: 5
      },
      max: {
        type: Number,
        default: 10
      },
      increment: {
        type: Number,
        default: 0.1
      },
      iconNum: {
        type: Number,
        default: 1
      },
      activecol: {
        type: String,
        default: "red"
      },
      cropName: {
        type: String,
        required: true
      },
      nutritionTarget: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        halo: "hello",
        myicon: '', // declare the icon
      }
    },
    created() {
      console.log("halo")
      this.myicon = navicon
    },
    methods: {
      mybar() {
        console.log('haloooo')
      },
      setIcon(index) {
        switch (index) {
          case 1:
            this.myicon = navicon
            break;
          case 2:
            this.myicon = apple
            break;
          case 3:
            this.myicon = ThumbsUp
            break;
          default:
            this.myicon = navicon
            break;
        }
      }
    },
  }
</script>
