<template>
  <b-container>
    <b-card v-if="fctList">
      <b-form-group label="FCT list">
        <b-form-radio
          v-for="fct in fctList"
          :key="fct._id"
          v-model="selected"
          :name="fct.dbName"
          :value="fct.dbId"
        >
          <b-card class="my-1">
            <b-row>
              <b-col cols="3">name</b-col>
              <b-col cols="9">{{fct.dbName}}</b-col>
            </b-row>
            <b-row>
              <b-col cols="3">description</b-col>
              <b-col cols="9">{{fct.description}}</b-col>
            </b-row>
            <b-row>
              <b-col cols="3">created by</b-col>
              <b-col cols="9">{{fct.creator}}</b-col>
            </b-row>
            <b-row>
              <b-col cols="3">created at</b-col>
              <b-col cols="9">{{fct.saveDate}}</b-col>
            </b-row>
            <b-row class="my-0 py-0">
              <b-col cols="3" class="px-0 mx-0"></b-col>
              <b-col cols="9" class="px-0 mx-0">
                <div class="text-light">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
              </b-col>
            </b-row>
          </b-card>
        </b-form-radio>
      </b-form-group>
      selected: {{selected}}
    </b-card>
    <b-card>
      <b-row class="my-1">
        <b-col cols="3" class="mx-0 px-0">
          new workspace:
        </b-col>
        <b-col cols="6" class="mx-0 px-0">
          <b-form-input
            placeholder="type new workspace name"
            v-model="workSpaceName"
            size="sm"
            :state="dbNameState"
            aria-describedby="input-live-help input-live-feedback"
          ></b-form-input>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-live-feedback">
            Name should be length in 3-20 character using alphabet and number, no space.
          </b-form-invalid-feedback>

          <!-- This is a form text block (formerly known as help block) -->
          <b-form-text id="input-live-help">you need to create new workspace to change FCT</b-form-text>

        </b-col>
        <b-col cols="3" class="mx-0 px-1">
          <b-button variant="info" @click="selectFct({fct: selected, workSpace: workSpaceName})"
                    :disabled="isReadyforSelection" size="sm">select</b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
  export default {
    data(){
      return{
        fctList:[],
        selected:'',
        workSpaceName:'',
      }
    },
    computed:{
      dbNameState() {
        return (/^[a-zA-Z0-9][a-zA-Z0-9-_]{1,17}[a-zA-Z0-9]{1,2}$/).test(this.workSpaceName)
      },
      isReadyforSelection(){
        return (!this.dbNameState || !this.selected)
      }
    },
    mounted(){
      console.log('start')
      this.getFctList()
      console.log('done')
    },
    methods:{
      async getFctList(){
        const res = await this.$store.dispatch('getFctList')
        this.fctList = res.rows.map(function (res) {
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
