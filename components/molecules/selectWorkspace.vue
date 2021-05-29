<template>
  <b-modal
    :id="id"
    :title="myModalHeader"
    body-bg-variant="light"
    header-bg-variant="info"
    header-text-variant="white"
    hide-footer
  >
    <validation-observer>
      <b-form @submit.prevent>
        <b-row class="my-2">
          <b-col>
            <b-input-group size="sm">
              <b-form-input
                v-model="fileName"
                type="text"
                id="input_filename"
                placeholder="file name"
                :state="fileNameValidator"
              ></b-form-input>
              <template #append>
                <b-dropdown text="Dropdown" variant="info" size="sm">
                  <b-dropdown-item
                    v-for="item in workspaceList"
                    :key="item.caseId"
                    :value="item.caseId"
                    @click="fileName = item.caseId"
                  >{{ item.caseId }}
                  </b-dropdown-item>
                </b-dropdown>
                <b-button variant="warning" :disabled="!fileName" @click="fileName = ''">clear</b-button>
              </template>
            </b-input-group>
            <p>please specify file name to store your work record</p>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
    <b-row class="my-2">
      <b-col>
        <b-button @click="selectWorkspace()" variant="info" size="sm"
                  :disabled="!fileNameValidator">select / create</b-button>
        <b-button @click="cancel(id)" size="sm" variant="warning">cancel</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>

  export default {
    data() {
      return {
        fileName: '',
        myModalHeader: 'select workspace',
      }
    },
    computed:{
      fileNameValidator: function () {
        return (/^[a-zA-Z0-9][a-zA-Z0-9 _.,'-]{1,27}[a-zA-Z0-9]{1,3}$/).test(this.fileName)
      },
    },
    mounted() {
      if(this.workspace) {
        this.fileName = this.workspace
      }
    },
    props:{
      id: {
        type: String,
        required: true,
      },
      workspace: {
        type: String,
        default:'',
      },
      workspaceList: {
        type: Array,
        default: null,
      }
    },
    methods: {
      selectWorkspace(){
        let res = []
        const vm = this
        if (vm.workspaceList){
          res = vm.workspaceList.filter(function (WS) {
            return WS.caseId === vm.fileName
          })
        }
        if (res.length) {
          vm.$emit('workspaceSelected', vm.fileName)
        } else {
          vm.$emit('workspaceCreated', vm.fileName)
        }
        vm.$bvModal.hide(vm.id)
      },
      cancel(val){
        this.$emit('cancelLoginEmail')
        this.$bvModal.hide(val)
      },
    }
  }
</script>
