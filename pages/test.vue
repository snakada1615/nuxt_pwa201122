<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2">
    test for registration
    <b-card bg-variant="info">
      <b-form-group
        label="Region"
        class="my-0"
      >
        <b-form-select v-model="selectedRegion" :options="dat1" class="mb-1 mt-0"/>
      </b-form-group>
      <b-form-group
        label="Zone"
        class="my-0"
      >
        <b-form-select v-model="selectedZone" :options="dat2" class="mb-1 mt-0"/>
      </b-form-group>
      <b-form-group
        label="Woreda"
        class="my-0"
      >
        <b-form-select v-model="selectedWoreda" :options="dat3" class="mb-1 mt-0"/>
      </b-form-group>
      <b-form-group
        label="Village or Other"
        class="my-0"
      >
        <b-form-input v-model="selectedVillage" class="mb-1 mt-0"/>
      </b-form-group>
      <b-form-group
        label="Agro-Ecological Zone"
        class="my-0"
      >
        <b-form-select v-model="selectedWoreda" :options="dat3" class="mb-1 mt-0"/>
      </b-form-group>
      <div>{{selectedWoreda}}</div>
      <b-button
        variant="warning"
        class="mt-2"
        :disabled="!selectedRegion || !selectedWoreda || !selectedZone"
      >save</b-button>
    </b-card>
  </b-container>
</template>

<script>

  import PouchDB from "pouchdb";

  export default {
    data() {
      return {
        selectedCountry: null,
        selectedRegion: null,
        selectedZone: null,
        selectedWoreda: null,
        selectedVillage: null,
      }
    },
    computed: {
      countryData(){
        return this.$store.state.countryStates
      },
      dat1(){
        return this.countryData.map(function(val){
          if (val.doc.GID_0 === "ETH") {
            return val.doc.NAME_1
          }
        }).filter(function(val2, index2, arr2){
          // val2 == undefined の値も除く
          return arr2.indexOf(val2) === index2 && !!val2
        })
      },
      dat2(){
        let vm = this
        return this.countryData.map(function(val){
          if (val.doc.NAME_1 === vm.selectedRegion) {
            return val.doc.NAME_2
          }
        }).filter(function(val2, index2, arr2){
          // val2 == undefined の値も除く
          return arr2.indexOf(val2) === index2 && !!val2
        })
      },
      dat3(){
        let vm = this
        return this.countryData.map(function(val){
          if (val.doc.NAME_2 === vm.selectedZone) {
            return val.doc.NAME_3
          }
        }).filter(function(val2, index2, arr2){
          // val2 == undefined の値も除く
          return arr2.indexOf(val2) === index2 && !!val2
        })
      },
      nameState() {
        return (/^[a-z._]{4,20}$/).test(this.dbName)
      },
      fileState(){
        return !!this.file1
      },
    },
    methods: {

    }
  }
</script>
