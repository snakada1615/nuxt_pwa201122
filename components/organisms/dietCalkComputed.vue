<template>
  <b-container style="max-width: 540px;">
    <b-row class="my-2">
      <b-col class="px-0 mb-2 mt-1">
        <b-card
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mr-1 ml-1 px-0">
          <template #header>
            <b-row>
              <b-col>
                <b class="py-0 my-0">Food Composition Table</b>
              </b-col>
              <b-col cols="4">
                <b-form-checkbox v-model="showFCT" name="FCT-button" switch>
                  Show FCT
                </b-form-checkbox>
              </b-col>
            </b-row>
          </template>
          <fct-table
            v-show="showFCT"
            :items="items"
            head-row-variant="success"
            table-variant="light"
            @fctClick="onFCTclick($event, pageId)"
          ></fct-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mb-2 mt-1">
        <b-card header-bg-variant="success" bg-variant="light"
                border-variant="success" class="mr-1 ml-1 px-0" style="min-width: 530px;">
          <template #header>
            <b-row class="my-0 py-0">
              <b-col class="mx-0 px-0">
                <b class="py-0 my-0 px-2">Nutrient requirement</b>
              </b-col>
              <b-col cols="4" class="mx-0 px-0">
                <left-right-switch
                  labelLeft="single"
                  labelRight="multiple"
                  name="check"
                  v-model="targetSwitch"
                ></left-right-switch>
              </b-col>
            </b-row>
          </template>
          <dri-table
            v-show="!targetSwitch"
            :value="driID"
            :items="itemsDRI"
            @change="$emit('update:driID', $event)"
            @changeDri="onChangeTarget($event, pageId)"
            head-row-variant="success"
            table-variant="light"
          />
          <dri-table-group
            ref="table"
            v-show="targetSwitch"
            v-model="itemsDRI"
            input-name='ahoaho'
            rules="min_value:0|max_value:500"
            head-row-variant="success"
            table-variant="light"
          />
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 py-2">
        <b-card header-bg-variant="success" bg-variant="light"
                border-variant="success" class="mr-1 ml-1 px-0" style="min-width: 530px;">
          <template #header>
            <b class="py-0 my-0">Crop combination</b>
          </template>
          <recepi-table
            @inputData="onChangeRecepi($event, pageId)"
            :items="itemsRecepi"
            head-row-variant="success"
            table-variant="light"
            foot-row-variant="light"
            @rowClick="onRecepiclick($event, pageId)"
            @delClick="delRecepiItem"
          >
          </recepi-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0">
        <b-card header-bg-variant="success" bg-variant="light"
                border-variant="success" class="mr-1 ml-1 px-0" style="min-width: 530px;">
          <template #header>
            <b class="py-0 my-0">Nutrition balance</b>
          </template>
          <b-row class="mt-0 bg-success">
            <b-col cols="3" class="text-center mr-2 font-weight-bold">Nutrition</b-col>
            <b-col cols="3" class="font-weight-bold">Balance</b-col>
            <b-col>
              <left-right-switch
                labelLeft="per meal"
                labelRight="per day"
                name="check"
                v-model="driSwitch"
              ></left-right-switch>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <nutrition-bar
              cropName="Energy"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTargetComputed.En"
              :rating="nutritionRating.En"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Protain"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTargetComputed.Pr"
              :rating="nutritionRating.Pr"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Vit-A"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTargetComputed.Va"
              :rating="nutritionRating.Va"
            ></nutrition-bar>
          </b-row>
          <b-row class="mb-2">
            <nutrition-bar
              cropName="Iron"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTargetComputed.Fe"
              :rating="nutritionRating.Fe"
            ></nutrition-bar>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col class="px-0">
        <b-card header-bg-variant="success" bg-variant="light"
                border-variant="success" class="mr-1 ml-1 px-0" style="min-width: 530px;">
          <template #header>
            <b class="py-0 my-0">Dietary diversity</b>
          </template>
          <b-form-checkbox-group
            stacked
            v-model="selectedCrops"
            :options="cropGroup"
          >
          </b-form-checkbox-group>
        </b-card>
      </b-col>
    </b-row>
    <food-modal
      v-model="initWeight"
      :items="itemSingleCrop"
      :my-name="'modalTest' + pageId"
      my-type="Number"
      rules="min_value:0|max_value:500"
      @modalOk="onCropWeightSet"
    ></food-modal>
  </b-container>
</template>

<script>
  /**
   * combination of fctTable, DRItble,
   *
   */

  import fctTable from '~/components/organisms/FctTable'
  import nutritionBar from "~/components/organisms/nutritionBar";
  import recepiTable from "~/components/organisms/recepiTable";
  import driTable from "@/components/organisms/driTable";
  import driTableGroup from "@/components/organisms/driTableGroup";
  import foodModal from '@/components/organisms/foodModal'
  import leftRightSwitch from "@/components/atoms/leftRightSwitch";

  export default {
    components: {
      fctTable,
      nutritionBar,
      recepiTable,
      driTable,
      foodModal,
      leftRightSwitch,
      driTableGroup,
    },
    computed: {
      nutritionTargetComputed: {
        get(){
          return this.nutritionTarget ? this.nutritionTarget : []
        },
        set(value){
          const res = this.dietCase
          res.nutritionTarget = value
        }
      },
      nutritionRating: function () {
        if (!this.nutritionTarget) {
          return []
        }
        let En = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.En * this.driRange / this.nutritionTarget.En) / 10 : 0
        let Pr = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Pr * this.driRange / this.nutritionTarget.Pr) / 10 : 0
        let Va = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Va * this.driRange / this.nutritionTarget.Va) / 10 : 0
        let Fe = this.nutritionTarget.En ?
          Math.round(100 * this.nutritionSum.Fe * this.driRange / this.nutritionTarget.Fe) / 10 : 0
        return {
          En: En,
          Pr: Pr,
          Va: Va,
          Fe: Fe,
        }
      },
      driRange: function () {
        let res = 1
        if (this.driSwitch) {
          res = 0.33
        }
        return res
      },
      cropGroup: function () {
        let uniqueGroup = []
        let result = []
        this.items.forEach(function (elem) {
          if (uniqueGroup.indexOf(elem.Group) === -1) {
            uniqueGroup.push(elem.Group)
            result.push({
              text: elem.Group,
              value: elem.Group,
              disabled: true,
            })
          }
        })
        return result
      },
      selectedCrops: {
        get: function () {
          if (!this.itemsRecepi) {
            return []
          }
          let uniqueGroup = []
          this.itemsRecepi.forEach(function (elem) {
            if (uniqueGroup.indexOf(elem.Group) === -1) {
              uniqueGroup.push(elem.Group)
            }
          })
          return uniqueGroup
        },
        set: function (value) {
          console.log(value)
        }
      },
      items: {
        get: function () {
          return this.fctOrg
        }
      },
      itemsDRI: {
        get: function () {
          return this.driOrg
        }
      },
    },
    props: {
      /**
       * information for combination of diet (itemsRecepi) plus
       *
       * aaaaaaaaaa
       *
       */
      _id: {
        type:String,
        default: ''
      },
      driID:{
        type: Number,
        default: 2,
      },
      pageId: 1,
      itemsRecepi: [],
      fctOrg: {
        type: Array
      },
      driOrg: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        itemSingleCrop: [],
        iconNum: 1,
        driSwitch: false,
        targetSwitch: false,
        showFCT: true,
        showFoodDialog: false,
        initWeight: 0,
        groupFlag: false,
      }
    },
    methods: {
      delRecepiItem(id){
        let res = []
        this.itemsRecepi.forEach(function (val, index) {
          if (index !== id) {
            res.push(val)
          }
        })
        this.itemsRecepi = res
        this.$emit('changeRecepi')
      },
      onChangeRecepi(value, pageId) {
        if (pageId !== this.pageId) {
          return
        }
        if (this.nutritionSum) {
          this.nutritionSum.En = value.En || 0
          this.nutritionSum.Pr = value.Pr || 0
          this.nutritionSum.Va = value.Va || 0
          this.nutritionSum.Fe = value.Fe || 0
          this.nutritionSum.Wt = value.Wt || 0
        }
      },
      onChangeTarget(value, pageId) {
        console.log('onChangeTarget')
        if (pageId !== this.pageId || !value.length) {
          return
        }
        if (this.nutritionTarget) {
          this.nutritionTarget.En = Number(value[1].Value) || 0
          this.nutritionTarget.Pr = Number(value[2].Value) || 0
          this.nutritionTarget.Va = Number(value[3].Value) || 0
          this.nutritionTarget.Fe = Number(value[4].Value) || 0
          this.driID  = Number(value[5].Value) || 0
          this.$emit('changeTarget', this.dietCase)
        }
      },
      onFCTclick(rec, pageId) {
        const vm = this
        if (pageId !== vm.pageId) {
          return
        }
        vm.itemSingleCrop.length = 0
        vm.itemSingleCrop.push({
          'id': rec.id,
          'Name': rec.Name,
          'Group': rec.Group,
          'En': rec.En,
          'Pr': rec.Pr,
          'Va': rec.Va,
          'Fe': rec.Fe,
        })
        vm.initWeight = 0
        vm.itemsRecepi.forEach(function (item) {
          if (item.id === rec.id) {
            vm.initWeight = Number(item.Wt)
          }
        })
        vm.$bvModal.show('modalTest' + String(pageId))
      },
      onRecepiclick(rec, pageId) {
        if (pageId !== this.pageId) {
          return
        }
        this.itemSingleCrop.length = 0
        this.itemSingleCrop.push({
          'id': rec.id,
          'Name': rec.Name,
          'Group': rec.Group,
          'En': rec.En,
          'Pr': rec.Pr,
          'Va': rec.Va,
          'Fe': rec.Fe,
        })
        this.initWeight = Number(rec.Wt)
        this.$bvModal.show('modalTest' + String(pageId))
      },
      onCropWeightSet(dat) {
        let res = false
        this.itemsRecepi.forEach(function (val) {
          if (val.id === dat.item[0].id) {
            val.Wt = dat.Wt
            res = true
          }
        })
        if (!res) {
          this.itemsRecepi.push({
            'id': dat.item[0].id || 0,
            'Name': dat.item[0].Name || 0,
            'Group': dat.item[0].Group || 0,
            'En': dat.item[0].En || 0,
            'Pr': dat.item[0].Pr || 0,
            'Va': dat.item[0].Va || 0,
            'Fe': dat.item[0].Fe || 0,
            "Wt": dat.Wt || 0
          })
        }
        this.$emit('changeRecepi', {pageId: this.pageId ,itemsRecepi: dat})
      },
    },
  }
</script>
