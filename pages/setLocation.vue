<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2">
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
        <b-form-select v-if="fctList" v-model="selectedFct" :options="fctList" class="mb-1 mt-0"/>
      </b-form-group>

      <b-form-group
        label="Workspace"
        class="my-0"
      >
        <b-form-input
          placeholder="type new workspace name"
          v-model="workSpaceName"
          size="sm"
          :state="wsNameState"
          aria-describedby="input-live-help input-live-feedback"
        ></b-form-input>

        <!-- This will only be shown if the preceding input has an invalid state -->
        <b-form-invalid-feedback id="input-live-feedback">
          Name should be length in 4-30 character using alphabet and number, no space.
        </b-form-invalid-feedback>

        <!-- This is a form text block (formerly known as help block) -->
        <b-form-text id="input-live-help">you need to create new workspace to change FCT</b-form-text>
      </b-form-group>

      <b-button
        variant="warning"
        class="mt-2"
        @click="selectFct({fct: selectedFctDbName, workSpace: workSpaceName})"
        :disabled="!selectedRegion || !selectedWoreda || !selectedZone || !selectedFct || !wsNameState"
      >save</b-button>
    </b-card>
    <div>{{selectedFct}}</div>
    <div>{{selectedFctDbName}}</div>
  </b-container>
</template>

<script>

  export default {
    data() {
      return {
        selectedCountry: null,
        selectedRegion: null,
        selectedZone: null,
        selectedWoreda: null,
        selectedVillage: null,
        selectedFct: null,
        workSpaceName: '',
        fctList_org: null,
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
      fctList(){
        if (this.fctList_org){
          return this.fctList_org.filter(function(val,index,arr){
            return (/^(?=.*eth_aez).*$/).test(val.dbId)
          }).map(function (val2) {
            return val2.description
          })
        } else {
          return ''
        }
      },
      selectedFctDbName(){
        if (this.fctList_org){
          let vm = this
          const res = vm.fctList_org.filter(function (val, index, arr) {
            console.log(val.dbId)
            console.log(vm.selectedFct)
            return val.description === vm.selectedFct
          })
          return res[0]? res[0].dbId:''
        } else {
          return ''
        }
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
      wsNameState() {
        return (/[!-~]{4,30}/).test(this.workSpaceName)
      },
      fileState(){
        return !!this.file1
      },
    },
    mounted() {
      console.log('start')
      this.getFctList()
      console.log('done')
    },
    methods: {
      async getFctList(){
        const res = await this.$store.dispatch('getFctList')
        this.fctList_org = res.rows.map(function (res) {
          return {
            dbId: res.doc.dbId,
            dbName: res.doc.dbName,
            description: res.doc.description,
            creator: res.doc.creator,
            saveDate: res.doc.saveDate
          }
        })
      },
      async selectFct(val){
        const vm = this

        console.log('setWorkspace01')
        //update $store
        vm.$store.dispatch('setCaseId', val.workSpace)

        //update $store fro fctDb
        vm.$store.dispatch('setFctDb', val.fct)

        //update PouchDB-lastUser
        await vm.$store.dispatch('saveUserToLastuser', {user: vm.$store.state.user, caseId: val.workSpace})

        //initialieze user workspace
        await vm.$store.dispatch('initPouch', {user: vm.$store.state.user, caseId: val.workSpace, fctDb: val.fct})

        //move to top page
        console.log('fct selected')
        await vm.$router.push('/')
      }
    }
  }
</script>
