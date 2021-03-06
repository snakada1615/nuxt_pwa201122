<template>
  <b-container class="my-0">
    <b-input-group>
      <b-form-input
        v-model="filter"
        type="search"
        id="filterInput"
        placeholder="Type to Search"
        size="sm"
      ></b-form-input>

      <template #append>
        <b-dropdown text="group" variant="primary" size="sm">
          <b-dropdown-item
            v-for="grpName in FoodGrp"
            :key="grpName.name"
            :value="grpName.name"
            @click="filter = grpName.name"
          >{{ grpName.name }}</b-dropdown-item>
        </b-dropdown>
        <b-button variant="info" :disabled="!filter" @click="filter = ''"  size="sm">clear</b-button>
      </template>
    </b-input-group>

    <b-form-checkbox v-model="showAll" name="showAllFlag" switch>
      Show all food items <b>(Checked: {{ showAll }})</b>
    </b-form-checkbox>

    <div class="mt-3">
      <b-table
        striped
        bordered
        border-variant="dark"
        responsive
        small
        ref="table"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        @filtered="onFiltered"
        @row-clicked="onFCTclick"
        @input="onInput"
        v-bind="$attrs">
        <!-- A custom formatted header cell for field 'name' -->
        <template #head(isShow)="data">
          <b-icon icon="bookmark-check"/>
        </template>
        <!-- A custom formatted cell for field 'name' -->
        <template #cell(isShow)="data">
          <b-form-checkbox
            v-model="data.item.isShow"
          />
        </template>
      </b-table>
      <b-form-group
        label="Per page"
        label-cols-sm="10"
        label-cols-md="10"
        label-cols-lg="10"
        label-align-sm="right"
        label-size="sm"
        label-for="perPageSelect"
        class="mb-1"
      >
        <b-form-select
          v-model="perPage"
          id="perPageSelect"
          size="sm"
          :options="pageOptions"
        ></b-form-select>
      </b-form-group>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
      ></b-pagination>

      <b-modal
        id="foodModal"
        title="Edit FCT record"
        header-bg-variant="info"
        @ok="clickOk(fctItem)"
        @cancel="clickCancel"
        v-if="fctItem"
      >
        <b-row class="my-2">
          <b-col cols="3">
            Group
          </b-col>
          <b-col cols="9">
            <b-form-input
              size="sm"
              :state="stateGroup"
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
              :state="stateName"
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
              :state="stateEn"
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
              :state="statePr"
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
              :state="stateVa"
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
              :state="stateFe"
              v-model="fctItem.Fe"
            />
          </b-col>
        </b-row>
      </b-modal>

    </div>
  </b-container>

</template>


<script>

  export default {
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
    computed:{
      FoodGrp: function () {
        let uniqueGroup = []
        let result = []
        if (this.items){
          this.items.forEach(function (elem, index) {
            if (uniqueGroup.indexOf(elem.Group) === -1) {
              uniqueGroup.push(elem.Group)
              result.push({
                name: elem.Group
              })
            }
          })
        }
        return result
      },
      stateGroup: function () {
        return (/^[a-zA-Z0-9][a-zA-Z0-9+\-_\\., ]{3,59}$/).test(this.fctItem.Group)
        && (typeof this.fctItem.Group !== 'undefined')
      },
      stateName: function () {
        return (/^[a-zA-Z0-9][a-zA-Z0-9+\-_\\., ]{3,59}$/).test(this.fctItem.Name)
        && (typeof this.fctItem.Name !== 'undefined')
      },
      stateEn: function () {
        return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.En) ||
          (this.fctItem.En === '')
      },
      statePr: function () {
        return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.Pr)||
          (this.fctItem.Pr === '')
      },
      stateVa: function () {
        return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.Va)||
          (this.fctItem.Va === '')
      },
      stateFe: function () {
        return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.Fe)||
          (this.fctItem.Fe === '')
      },
    },
    data() {
      return {
        fields: [
          {key: 'isShow', label:'',  sortable: false, thStyle: {width: "10px"}},
          {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: true, thStyle: {width: "290px"}},
          {key: 'En', sortable: true, thStyle: {width: "50px"}},
          {key: 'Pr', sortable: true, thStyle: {width: "50px"}},
          {key: 'Va', sortable: true, thStyle: {width: "50px"}},
          {key: 'Fe', sortable: true, thStyle: {width: "50px"}},
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, {value: 100, text: "Show a lot"}],
        sortBy: 'Name',
        sortDesc: false,
        filter: null,
        filterOn: ['Group', 'Name'],
        showAll: true,
        fctItem:{
          id:'',
          Group:'',
          Name:'',
          En:'',
          Pr:'',
          Va:'',
          Fe:'',
        },
      }
    },
    methods: {
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
        console.log('filtered!!')
      },
      onInput() {
        // Set the initial number of items
        this.totalRows = this.items.length
      },
      onFCTclick(val){
        this.fctItem.id = val.id
        this.fctItem.Group = val.Group
        this.fctItem.Name = val.Name
        this.fctItem.En = val.En
        this.fctItem.Pr = val.Pr
        this.fctItem.Va = val.Va
        this.fctItem.Fe = val.Fe
        this.$bvModal.show('foodModal')
      },
      clickOk(val){
        const res = this.items.map(function (doc) {
          if (doc.id === val.id){
            doc.Group = val.Group
            doc.Name = val.Name
            doc.En = val.En
            doc.Pr = val.Pr
            doc.Va = val.Va
            doc.Fe = val.Fe
            doc.id = val.id
          }
          return doc
        })
        this.$emit('changeFct', res)
        this.$bvModal.hide('foodModal')
      },
      clickCancel(val){
        console.log('cancel')
      },
    },
  }
</script>
