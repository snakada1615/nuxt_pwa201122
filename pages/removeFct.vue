<template>
  <b-container style="max-width: 540px; min-width: 530px;">
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
        <b-col cols="3" class="mx-0 px-1">
          <b-button variant="info" @click="removeFct({fct: selected})"
                    size="sm">remove</b-button>
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
      async removeFct(val){
        const vm = this
        console.log(val.fct)
        try {
          this.$store.dispatch('removeFctDb', val.fct).then(function () {
            console.log('remove success')
          })
        } catch (err) {
          alert(err)
        }
      }
    }
  }
</script>
