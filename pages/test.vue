<template>
  <b-container>
    <div v-if="$nuxt.isOffline">
      Sorry, this page works only online
    </div>
    <div v-if="$nuxt.isOnline">
      <b-card>
        <fct-table
          v-if="csvState"
          :items="csv"
          head-row-variant="success"
          table-variant="light"
          @fctClick="onFCTclick"
        />
      </b-card>
      <b-card>
        <b-row class="my-1">
          <b-col cols="3">
            Name:
          </b-col>
          <b-col cols="9">
            {{dbName}}
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col cols="3">
            Description:
          </b-col>
          <b-col cols="9">
            {{dbDescription}}
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col cols="3">
            Creator:
          </b-col>
          <b-col cols="9">
            {{$store.state.user.name}}
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col class="mx-0">
            <b-button
              variant="info"
              size="sm"
              :disabled="!isSaveReady"
              @click="saveFct"
            >save to server</b-button>
          </b-col>
        </b-row>
      </b-card>
    </div>

    <b-modal
      id="foodModal"
      title="Edit FCT record"
      header-bg-variant="info"
      @ok="clickOk(fctItem)"
      @cancel="clickCancel"
    >
      <b-row class="my-2">
        <b-col cols="3">
          Group
        </b-col>
        <b-col cols="9">
          <b-form-input
            size="sm"
            v-model="fctItem.Group"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          Name
        </b-col>
        <b-col cols="9">
          <b-form-input
            size="sm"
            v-model="fctItem.Name"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          En
        </b-col>
        <b-col cols="9">
          <b-form-input
            size="sm"
            v-model="fctItem.En"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          Pr
        </b-col>
        <b-col cols="9">
          <b-form-input
            size="sm"
            v-model="fctItem.Pr"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          Va
        </b-col>
        <b-col cols="9">
          <b-form-input
            size="sm"
            v-model="fctItem.Va"
          />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="3">
          Fe
        </b-col>
        <b-col cols="9">
          <b-form-input
            size="sm"
            v-model="fctItem.Fe"
          />
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
  import vueCsvImport from 'vue-csv-import'
  import FctTable from "@/components/organisms/FctTable";

  export default {
    components: {
      FctTable
    },
    computed: {
      cropGroup: function () {
        let uniqueGroup = []
        let result = []
        if (this.csv) {
          this.csv.forEach(function (elem, index) {
            if (uniqueGroup.indexOf(elem.Group) === -1) {
              uniqueGroup.push(elem.Group)
              result.push({
                name: elem.Group
              })
            }
          })
        }
        //result.pop() // there are some bug in above code, which i cannot figure out
        return result
      },
      dbNameState() {
        return (/^[a-zA-Z0-9][a-zA-Z0-9-_]{1,37}[a-zA-Z0-9]{1,2}$/).test(this.dbName)
      },
      dbDescriptionState() {
        return (/^[a-zA-Z][a-zA-Z -.,_]{1,99}[a-zA-Z]{1,3}$/).test(this.dbDescription)
      },
      csvState(){
        let res = false
        if (this.csv){
          if (this.csv.length>0){
            res = true
          }
        }
        return res
      },
      isSaveReady(){
        return this.csvState && this.dbNameState && this.dbDescriptionState
      },
      dbUniqueName(){
        return (this.dbName + '_' + this.$store.state.user.uid).toLowerCase()
      },
      loginChecked: function () {
        return this.$store.state.loginStatus === 1
      },
    },
    watch:{
      loginChecked: async function () {
        const vm  = this
        const res = await vm.$store.dispatch('loadFctFromPouch', vm.$store.state.fctDb)
        vm.csv = res.map(function (val) {
          return {
            'id': val.doc.id,
            '_id': val.doc._id,
            '_rev': val.doc._rev,
            'Group':val.doc.Group,
            'Name':val.doc.Name,
            'En':val.doc.En,
            'Pr':val.doc.Pr,
            'Va':val.doc.Va,
            'Fe':val.doc.Fe,
          }
        })
        const res2 = await this.$store.dispatch('getFctInfo')
        this.dbName = res2.dbName
        this.dbDescription = res2.description
      }
    },
    data() {
      return {
        csv: null,
        fields: [
          'id',
          'Group',
          'Name',
          'En',
          'Pr',
          'Va',
          'Fe',
        ],
        dbName:'',
        dbDescription:'',
        deCreator:'',
        fctItem:{
          id:'',
          Group:'',
          Name:'',
          En:'',
          Pr:'',
          Va:'',
          Fe:'',
        },
      };
    },
    async mounted() {
      if (this.loginChecked){
        const res = await this.$store.dispatch('loadFctFromPouch', this.$store.state.fctDb)
        this.csv = res.map(function (val) {
          return {
            'id': val.doc.id,
            '_id': val.doc._id,
            '_rev': val.doc._rev,
            'Group':val.doc.Group,
            'Name':val.doc.Name,
            'En':val.doc.En,
            'Pr':val.doc.Pr,
            'Va':val.doc.Va,
            'Fe':val.doc.Fe,
          }
        })
        const res2 = await this.$store.dispatch('getFctInfo')
        this.dbName = res2.dbName
        this.dbDescription = res2.description
      }
    },
    methods:{
      clickOk(val){
        console.log(this.csv)
        this.csv.forEach(function (doc) {
          if (doc.id === val.fctId){
            doc.Group = val.Group
            doc.Name = val.Name
            doc.En = val.En
            doc.Pr = val.Pr
            doc.Va = val.Va
            doc.Fe = val.Fe
            doc.id = val.id
            doc._id = val._id
            console.log(doc)
          }
        })
      },
      clickCancel(val){
        console.log('cancel')
      },
      onFCTclick(val){
        this.fctItem._id = val._id
        this.fctItem.id = val.id
        this.fctItem.Group = val.Group
        this.fctItem.Name = val.Name
        this.fctItem.En = val.En
        this.fctItem.Pr = val.Pr
        this.fctItem.Va = val.Va
        this.fctItem.Fe = val.Fe
        this.$bvModal.show('foodModal')
      },
      saveFct(){
        this.$store.dispatch('saveFctToPouch_replace',{
          _id: this.dbName,
          dbName: this.dbUniqueName,
          description: this.dbDescription,
          creator: this.$store.state.user.name,
          data: this.csv,
        })
      }
    }
  };
</script>
