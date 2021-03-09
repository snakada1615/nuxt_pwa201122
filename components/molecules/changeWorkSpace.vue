<template>
  <b-modal
    :id="dialogId"
    :title="myModalHeader"
    body-bg-variant="light"
    header-bg-variant="info"
    header-text-variant="white"
    hide-footer
  >
    <div>current user: <span class="text-danger">{{ currentUser }}</span></div>
    <div class="mt-0 mb-2">current workspace: <span class="text-danger">{{ currentWorkspace }}</span></div>
    <b-card>
      <b-card-body class="px-0 py-0">
        <b-table
          id="my-table"
          small striped
          :items="items"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          head-row-variant="primary"
          @row-clicked="onWorkSpaceNameClicked"
        ></b-table>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          size="sm"
          aria-controls="my-table"
        ></b-pagination>
        <div>
          select workspace from table above, or just type new name
        (workspace name must be unique)
        </div>
        <vee-input
          name="input-workspace"
          rules="required|min:6"
          placeholder="workspace name"
          :value="workSpaceName"
          @input="onInputWorkSpace"
        ></vee-input>
        <div class="float-right">
          <b-button @click="changeCaseId(workSpaceName)" class="mt-2" size="sm" variant="primary">open or create</b-button>
          <b-button @click="$bvModal.hide(dialogId)" class="mt-2" size="sm" variant="gray-500">cancel</b-button>
        </div>
      </b-card-body>
    </b-card>
  </b-modal>
</template>

<script>
  import veeInput from "@/components/atoms/veeInput";
  import DietCalkComp from "../organisms/dietCalkComp";
  import PouchDB from "pouchdb";
  import {pouchGetDoc, pouchPutNewOrUpdate} from "../../plugins/pouchHelper";

  export default {
    components: {
      DietCalkComp,
      veeInput,
    },
    data() {
      return {
        fields: [
          {key: 'User', sortable: false},
          {key: 'Workspace', sortable: true},
          {key: 'date', sortable: true},
        ],
        perPage: 5,
        currentPage: 1,
        totalRows: 1,
        workSpaceName:'',
      }
    },
    props: {
      currentUser:{
        type: String,
        required: true
      },
      currentWorkspace:{
        type: String,
        required: true
      },
      dialogId: {
        type: String,
        required: true
      },
      myModalHeader: {
        type: String,
        default: 'Change WorkSpace'
      },
      caseIds: {
        type: Array,
        default: () => ([
          {User: 'user01', Workspace: 'case01', date: '2020/01/23'},
        ])
      },
    },
    computed:{
      items(){
        let res = []
        let vm = this
        vm.caseIds.forEach(function (value, index) {
          res.push({
            User: vm.$store.state.user.email,
            Workspace: value.workspace,
            date: value.saveDate,
          })
        })
        return res
      },
    },
    mounted() {
      this.totalRows = this.caseIds.length
    },
    methods: {
      onInputWorkSpace(value){
        this.workSpaceName = value
      },
      onWorkSpaceNameClicked(value){
        this.workSpaceName = value.Workspace
        console.log(value.Workspace)
      },
      addNewCaseid(value){
        const lastUser = 'lastUser'
        let db = new PouchDB(this.$store.state.userDB)
        let promise = new Promise((resolve, reject) => {
          pouchPutNewOrUpdate(db, value).then(function () {
            resolve(true)
          }).catch(function (err){
            console.log(err)
            reject(false)
          })
        })
        return promise
      },
      changeCaseId(value){
        console.log('caseid: ' + value)
        if (this.$store.caseIdList.includes(value)) {
          this.$store.dispatch('setCaseId', dat)
          this.$store.dispatch('saveUserToLastuser', {user: this.$store.state.user, caseId: this.$store.state.caseId})
          this.$store.dispatch('autoLogin')
        } else {
          this.addNewCaseid({user: this.$store.state.user, caseId: value}).then(function () {
            this.$store.dispatch('setCaseId', dat)
            this.$store.dispatch('saveUserToLastuser', {user: this.$store.state.user, caseId: this.$store.state.caseId})
            this.$store.dispatch('autoLogin')
          })
        }
        this.workSpaceName = ''
        this.$bvModal.hide(this.dialogId)
      }
    }
  }
</script>
