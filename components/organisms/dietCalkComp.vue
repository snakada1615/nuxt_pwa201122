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
            :value="driId"
            :items="itemsDRI"
            @change="$emit('update:driId', $event)"
            @changeDri="onTargetChanged($event, pageId)"
            head-row-variant="success"
            table-variant="light"
          />
          <dri-table-group
            ref="table"
            v-show="targetSwitch"
            v-model="itemsDRI"
            input-name='myDri'
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
            :items="foodItems"
            @delItem="$emit('update:foodItems', $event)"
            @rowClick="onRecepiclick($event, pageId)"
            @totalChanged="onTotalChanged($event, pageId)"
            head-row-variant="success"
            table-variant="light"
            foot-row-variant="light"
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
              :nutritionTarget="nutritionTarget.En"
              :rating="nutritionRating.En"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Protain"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.Pr"
              :rating="nutritionRating.Pr"
            ></nutrition-bar>
          </b-row>
          <b-row>
            <nutrition-bar
              cropName="Vit-A"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.Va"
              :rating="nutritionRating.Va"
            ></nutrition-bar>
          </b-row>
          <b-row class="mb-2">
            <nutrition-bar
              cropName="Iron"
              :iconNum=iconNum
              :max="10"
              :nutritionTarget="nutritionTarget.Fe"
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
      nutritionRating: function () {
        if (!this.nutritionTarget) {
          return []
        }
        let En = this.nutritionTarget[1] ?
          Math.round(100 * this.nutritionSum.En * this.driRange / this.nutritionTarget[1]['Value']) / 10 : 0
        let Pr = this.nutritionTarget[2] ?
          Math.round(100 * this.nutritionSum.Pr * this.driRange / this.nutritionTarget[2]['Value']) / 10 : 0
        let Va = this.nutritionTarget[3] ?
          Math.round(100 * this.nutritionSum.Va * this.driRange / this.nutritionTarget[3]['Value']) / 10 : 0
        let Fe = this.nutritionTarget[4] ?
          Math.round(100 * this.nutritionSum.Fe * this.driRange / this.nutritionTarget[4]['Value']) / 10 : 0
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
        //TODO: fix unique group extraxtion error
        let uniqueGroup = []
        let result = []
        this.items.forEach(function (elem, index) {
          if (uniqueGroup.indexOf(elem.Group) === -1) {
            uniqueGroup.push(elem.Group)
            result.push({
              text: elem.Group,
              value: elem.Group,
              disabled: true,
            })
          }
        })
        result.pop() // there are some bug in above code, which i cannot figure out
        return result
      },
      selectedCrops: {
        get: function () {
          if (!this.foodItems) {
            return []
          }
          let uniqueGroup = []
          this.foodItems.forEach(function (elem) {
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
       * information for combination of diet (foodItems) plus
       *
       * aaaaaaaaaa
       *
       */
      _id: {
        type: String,
        default: '3'
      },
      driId: {
        default: 2
      },
      pageId: {
        default: 1
      },
      foodItems: {
        default: () => ([])
      },
      targetName: {
        default: ''
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
        nutritionTarget: [],
        nutritionSum: {}
      }
    },
    methods: {
      onTotalChanged(value, pageId) {
        if (pageId !== this.pageId) {
          return
        }
        if (this.nutritionSum) {
          this.nutritionSum = {...value}
        }
      },
      onTargetChanged(value, pageId) {
        console.log('onTargetChanged')
        if (pageId !== this.pageId || !value.length) {
          return
        }
        if (this.nutritionTarget) {
          this.nutritionTarget = [...value]
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
        vm.foodItems.forEach(function (item) {
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
        console.log('onCropWeightSet')
        console.log(dat)
        let modifiedData = JSON.parse(JSON.stringify(this.foodItems))
        modifiedData.forEach(function (val) {
          if (val.id === dat.item[0].id) {
            val.En = Math.round(dat.item[0].En * dat.Wt)
            val.Pr = Math.round(dat.item[0].Pr * dat.Wt)
            val.Va = Math.round(dat.item[0].Va * dat.Wt)
            val.Fe = Math.round(dat.item[0].Fe * dat.Wt)
            val.Wt = dat.Wt
            res = true
          }
        })
        if (!res) {
          modifiedData.push({
            'id': dat.item[0].id || 0,
            'Name': dat.item[0].Name || 0,
            'Group': dat.item[0].Group || 0,
            'En': Math.round(dat.item[0].En * dat.Wt) || 0,
            'Pr': Math.round(dat.item[0].Pr * dat.Wt) || 0,
            'Va': Math.round(dat.item[0].Va * dat.Wt) || 0,
            'Fe': Math.round(dat.item[0].Fe * dat.Wt) || 0,
            "Wt": dat.Wt || 0
          })
        }
        console.log(modifiedData)
        this.$emit('changeRecepi', {pageId: this.pageId, foodItems: dat})
        this.$emit('update:foodItems', modifiedData)
      },
    },
  }
</script>
