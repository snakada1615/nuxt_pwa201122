<template>
  <b-container class="py-2">
    <b-card bg-variant="gray-100">
      <h6 class="text-danger mt-0 mb-2">
        Sorry, application encountered an error. Please report to administrator
      </h6>

      <div v-if="typeof error !== 'object'">
        <b-row>
          <b-col cols="3">Error code</b-col>
          <b-col cols="9">{{ error.statusCode }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="3">Error message</b-col>
          <b-col cols="9">{{ error.message }}</b-col>
        </b-row>
      </div>
      <div v-if="typeof error === 'object'" class="mb-2">
        <b-row v-for="[key, value] of Object.entries(error)" :key="key">
          <b-col cols="3">{{key}}</b-col>
          <b-col cols="9">{{value}}</b-col>
        </b-row>
      </div>
      <NuxtLink to="/"><b-icon icon="house-fill"/> Back to home</NuxtLink>
    </b-card>
  </b-container>
</template>

<script>
  export default {
    props: ['error'],
  }
</script>
