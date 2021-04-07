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
            @fctClick="onFCTclick($event, dietCase.pageId)"
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
            :value="dietCase.driID"
            :items="itemsDRI"
            @change="$emit('update:driID', $event)"
            @changeDri="onChangeTarget($event, dietCase.pageId)"
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
            @inputData="onChangeRecepi($event, dietCase.pageId)"
            :items.sync="dietCase.itemsRecepi"
            head-row-variant="success"
            table-variant="light"
            foot-row-variant="light"
            @rowClick="onRecepiclick($event, dietCase.pageId)"
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
      :my-name="'modalTest' + dietCase.pageId"
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
          return this.dietCase.nutritionTarget ? this.dietCase.nutritionTarget : []
        },
        set(value){
          const res = this.dietCase
          res.nutritionTarget = value
        }
      },
      nutritionRating: function () {
        if (!this.dietCase.nutritionTarget) {
          return []
        }
        let En = this.dietCase.nutritionTarget.En ?
          Math.round(100 * this.dietCase.nutritionSum.En * this.driRange / this.dietCase.nutritionTarget.En) / 10 : 0
        let Pr = this.dietCase.nutritionTarget.En ?
          Math.round(100 * this.dietCase.nutritionSum.Pr * this.driRange / this.dietCase.nutritionTarget.Pr) / 10 : 0
        let Va = this.dietCase.nutritionTarget.En ?
          Math.round(100 * this.dietCase.nutritionSum.Va * this.driRange / this.dietCase.nutritionTarget.Va) / 10 : 0
        let Fe = this.dietCase.nutritionTarget.En ?
          Math.round(100 * this.dietCase.nutritionSum.Fe * this.driRange / this.dietCase.nutritionTarget.Fe) / 10 : 0
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
          if (!this.dietCase.itemsRecepi) {
            return []
          }
          let uniqueGroup = []
          this.dietCase.itemsRecepi.forEach(function (elem) {
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
      dietCase: {
        type: Object,
        default: () => ({
          _id: '',
          driID: 2,
          pageId: 1,
          itemsRecepi: [],
          targetName: '',
          nutritionTarget: {
            En: 10,
            Pr: 10,
            Va: 10,
            Fe: 10,
          },
          nutritionSum: {
            En: 10,
            Pr: 10,
            Va: 10,
            Fe: 10,
            Wt: 10,
          },
        })
      },
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
        this.dietCase.itemsRecepi.forEach(function (val, index) {
          if (index !== id) {
            res.push(val)
          }
        })
        this.dietCase.itemsRecepi = res
        this.$emit('changeRecepi')
      },
      onChangeRecepi(value, pageId) {
        if (pageId !== this.dietCase.pageId) {
          return
        }
        if (this.dietCase.nutritionSum) {
          this.dietCase.nutritionSum.En = value.En || 0
          this.dietCase.nutritionSum.Pr = value.Pr || 0
          this.dietCase.nutritionSum.Va = value.Va || 0
          this.dietCase.nutritionSum.Fe = value.Fe || 0
          this.dietCase.nutritionSum.Wt = value.Wt || 0
        }
      },
      onChangeTarget(value, pageId) {
        console.log('onChangeTarget')
        if (pageId !== this.dietCase.pageId || !value.length) {
          return
        }
        if (this.dietCase.nutritionTarget) {
          this.dietCase.nutritionTarget.En = Number(value[1].Value) || 0
          this.dietCase.nutritionTarget.Pr = Number(value[2].Value) || 0
          this.dietCase.nutritionTarget.Va = Number(value[3].Value) || 0
          this.dietCase.nutritionTarget.Fe = Number(value[4].Value) || 0
          this.dietCase.driID  = Number(value[5].Value) || 0
          this.$emit('changeTarget', this.dietCase)
        }
      },
      onFCTclick(rec, pageId) {
        const vm = this
        if (pageId !== vm.dietCase.pageId) {
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
        vm.dietCase.itemsRecepi.forEach(function (item) {
          if (item.id === rec.id) {
            vm.initWeight = Number(item.Wt)
          }
        })
        vm.$bvModal.show('modalTest' + String(pageId))
      },
      onRecepiclick(rec, pageId) {
        if (pageId !== this.dietCase.pageId) {
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
        //TODO:  currently violating Vue rule of property handling
        //　need to be fixed to emit modification signal to parent

        let res = false
        let modifiedData = JSON.parse(JSON.stringify(this.dietCase))
        modifiedData.itemsRecepi.forEach(function (val) {
          if (val.id === dat.item[0].id) {
            val.Wt = dat.Wt
            res = true
          }
        })
        if (!res) {
          modifiedData.itemsRecepi.push({
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
        this.$emit('changeRecepi', {pageId: this.dietCase.pageId ,itemsRecepi: dat})
        console.log('i send it now')
        this.$emit('update:dietCase', modifiedData)
        console.log('sending complete')
        console.log(modifiedData)
      },
    },
  }
</script>
