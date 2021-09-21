<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2"
               style="max-width: 540px; min-width: 530px;">
    <b-card>
      {{DRI}}
    </b-card>
    <b-table
      :items="DRI"
      :fields="fields2"
      striped
      head-row-variant="success"
      small
      @row-clicked="onClickRow"
    >
      <template #cell(Name)="data">
        <span class="text-info">{{ data.value }}</span>
        <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="delClick(data.index)">
          <b-badge variant="gray-400" class="px-0 py-0">
            <b-icon icon="X"></b-icon>
          </b-badge>
        </b-button>
      </template>
    </b-table>
    <b-button
      size="sm"
      variant="info"
      @click="addDri"
    >add new record
    </b-button>
    <b-button
      size="sm"
      variant="info"
      @click="saveDri"
    >save all dataset
    </b-button>

    <b-modal
      id="modalDri"
      title="modify DRI item"
      @ok="setDri(selectedDRI, addNew)"
      :ok-disabled="!validate_all()"
      @cancel="onclickCancel"
      body-bg-variant="gray-100"
    >
      <b-table
        striped
        small
        :items="selectedDRI"
        :fields="fields1"
        head-row-variant="info"
        bordered
      >
        <template #cell(Value)="data">
          <b-form-input
            v-model="data.item.Value"
            :state="validateResult[data.index]"
            :disabled="data.item.Item === 'id'"
          />
        </template>
      </b-table>
    </b-modal>
  </b-container>
</template>

<script>
  export default {
    computed: {
      loginChecked: function () {
        return this.$store.state.loginStatus === 1
      },
    },
    data() {
      return {
        driID: 2,
        addNew: false,
        dbName: '',
        dbDescription: '',
        selectedDRI: {},
        validateResult: [],
        fields1: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
        fields2: [
          'Name',
          'En',
          'Pr',
          'Va',
          'Fe',
        ],
        DRI: [
          {
            En: "1088.0",
            Fe: "5.8",
            max_vol: "900",
            Name: "child 6-23 month",
            Pr: "11.65",
            Va: "400.0",
            id: 0
          },
          {
            En: "3066.0",
            Fe: "44.4",
            max_vol: "2500",
            Name: "lactating",
            Pr: "61.0",
            Va: "850.0",
            id: 1
          },
          {
            En: "2913.0",
            Fe: "24.9",
            max_vol: "2600",
            Name: "adolescent all",
            Pr: "52.65",
            Va: "600.0",
            id: 2
          }
        ]
      }
    },
    watch: {
      selectedDRI: {
        deep: true,
        handler(val) {
          this.validateResult.length = 0
          this.validateResult = [...this.validator(val)]
        }
      },
      loginChecked: async function () {
        const vm = this
        const res = await vm.$store.dispatch('loadDriFromPouch',
          {dbName: vm.$store.state.driDb, url: vm.$store.state.cloudantUrl})
          .catch(err => {
            vm.$nuxt.error(err)
          })
        console.log(res)
        vm.DRI = res.map(function (val) {
          return {
            En: val.En,
            Fe: val.Fe,
            max_vol: val.max_vol,
            Name: val.Name,
            Pr: val.Pr,
            Va: val.Va,
            id: val.id
          }
        })
        const res2 = await this.$store.dispatch('getDriInfo').catch(err => {
          console.log(err)
        })
        this.dbName = res2.dbName
        this.dbDescription = res2.description
      }
    },
    methods: {
      onclickCancel() {

      },
      validate_all() {
        if (this.selectedDRI.length) {
          const res = this.validator(this.selectedDRI).reduce((a, b) => {
            return a * b
          })
          return (res === 1)
        } else {
          return true
        }
      },
      validator(val) {
        let res = []
        val.forEach(function (item, index) {
          switch (index) {
            case 0:
              res.push(
                (/^[a-zA-Z0-9][a-zA-Z0-9+\-_\\. ]{3,18}[a-zA-Z0-9]$/).test(item.Value)
                && (typeof item.Value !== 'undefined')
              )
              break;
            case 1:
              res.push(
                (/^[0-9]*\.?[0-9]+$/).test(item.Value)
              )
              break;
            case 2:
              res.push(
                (/^[0-9]*\.?[0-9]+$/).test(item.Value)
              )
              break;
            case 3:
              res.push(
                (/^[0-9]*\.?[0-9]+$/).test(item.Value)
              )
              break;
            case 4:
              res.push(
                (/^[0-9]*\.?[0-9]+$/).test(item.Value)
              )
              break;
          }
        })
        return res
      },
      setDri(val, addNew = false) {
        if (addNew) {
          this.DRI.push({
            Name: val[0].Value,
            En: val[1].Value,
            Pr: val[2].Value,
            Va: val[3].Value,
            Fe: val[4].Value,
            id: val[5].Value
          })
          console.log(this.DRI)
        } else {
          this.returnSelectedDri(val)
        }
      },
      setSelectedDri(val) {
        this.selectedDRI = [
          {Item: 'target', Value: val.Name},
          {Item: 'Energy', Value: val.En},
          {Item: 'Protein', Value: val.Pr},
          {Item: 'Vit_A', Value: val.Va},
          {Item: 'Iron', Value: val.Fe},
          {Item: 'id', Value: val.id}
        ]
      },
      returnSelectedDri(val) {
        this.DRI.forEach((item) => {
          if (item.id === val[5].Value) {
            item.Name = val[0].Value
            item.En = val[1].Value
            item.Pr = val[2].Value
            item.Va = val[3].Value
            item.Fe = val[4].Value
          }
        })
      },
      onClickRow(val) {
        this.setSelectedDri(val)
        this.addNew = false
        this.$bvModal.show('modalDri')
      },
      delClick(id) {
        const res = confirm('this will erase DRI record: [' + this.DRI[id].Name + ']. Are you sure?')
        if (res) {
          console.log(this.DRI)
          this.DRI.splice(id, 1)
        }
      },
      addDri() {
        const idMax = this.DRI.reduce((maxVal, p) => p.id > maxVal ? p.id : maxVal, 0)
        this.addNew = true
        this.setSelectedDri({id: idMax + 1})
        this.$bvModal.show('modalDri')
      },
      saveDri() {
        const res = confirm('this will modify current DRI record: Are you sure?')
        if (res) {

        }
      },
    }
  }
</script>
