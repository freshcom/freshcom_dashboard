<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/stockables" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">
        Stockables
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Edit stockable</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="24">
          <el-form @submit.native.prevent="submit()" label-position="top" size="small">
            <stockable-fieldset v-model="stockableDraft" :errors="errors"></stockable-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Stockable from '@/models/stockable'
import StockableFieldset from '@/components/stockable-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadStockable' })

export default {
  name: 'EditStockable',
  mixins: [ResourcePageMixin],
  components: {
    StockableFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      stockable: Stockable.objectWithDefaults(),
      stockableDraft: Stockable.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  created () {
    this.loadStockable()
  },
  methods: {
    loadStockable () {
      this.isLoading = true

      return freshcom.retrieveStockable(this.id, {
        include: 'avatar'
      }).then(response => {
        this.stockable = response.data
        this.stockableDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdating = true

      return freshcom.updateStockable(
        this.stockableDraft.id,
        this.stockableDraft
      ).then(stockable => {
        this.$message({
          showClose: true,
          message: `Stockable saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowStockable', params: { id: this.stockable.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
