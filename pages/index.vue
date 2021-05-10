<template>
  <section class="container" style="max-width: 540px;">
    <div>
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        fade
        indicators
        img-width="1024"
        img-height="480"
      >
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro01.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro02.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro03.jpg"
        ></b-carousel-slide>
        <b-carousel-slide
          caption=""
          img-src="/img/NFA_intro04.jpg"
        ></b-carousel-slide>
      </b-carousel>
    </div>

    <b-row>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
            <b-card-body class="px-0 py-0">
              <b-card-text class="text-center font-weight-bold text-secondary bg-white">about NFA tool</b-card-text>
              <b-button class="btn-warning btn-block" to="/whatsNFA" Nuxt>What is this tool?</b-button>
            </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
            <b-card-body class="px-0 py-0">
              <b-card-text class="text-center font-weight-bold text-secondary bg-white">diet calculation</b-card-text>
              <b-button :disabled="!loginOk" class="btn btn-warning m-auto btn-block" to="/dietCalk" Nuxt>go</b-button>
            </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
            <b-card-body class="px-0 py-0">
              <b-card-text class="text-center font-weight-bold text-secondary bg-white">crop feasibility</b-card-text>
              <b-button :disabled="!loginOk" class="btn btn-warning m-auto btn-block" to="/feasibilityCheck" Nuxt>go</b-button>
            </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
            <b-card-body class="px-0 py-0">
              <b-card-text class="text-center font-weight-bold text-secondary bg-white">change user</b-card-text>
              <b-button class="btn btn-warning m-auto btn-block" to="/user_login" Nuxt>login / logout</b-button>
            </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="6" md="4" class="px-1">
        <b-card class="bg-info my-2">
            <b-card-body class="px-0 py-0">
              <b-card-text class="text-center font-weight-bold text-secondary bg-white">option</b-card-text>
              <b-button class="btn btn-warning m-auto btn-block" to="/updateSW" Nuxt>option</b-button>
            </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
  export default {
    computed:{
      loginOk:function () {
        if (this.$store.state.loginStatus === 1){
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
