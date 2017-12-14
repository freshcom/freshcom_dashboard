<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/stockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">Stockables</el-menu-item>
    </el-menu>
    <locale-selector @change="loadStockable" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>
        <span style="line-height: 36px;">Edit stockable</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <stockable-form v-model="stockableDraft" :errors="errors"></stockable-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" type="primary" class="pull-right" size="small">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Stockable from '@/models/stockable'
import StockableForm from '@/components/stockable-form'

export default {
  name: 'EditStockable',
  mixins: [PageMixin],
  components: {
    StockableForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      stockable: Stockable.objectWithDefaults(),
      stockableDraft: Stockable.objectWithDefaults(),

      isUpdatingStockable: false,
      errors: {}
    }
  },
  created () {
    this.loadStockable()
  },
  methods: {
    loadStockable () {
      this.isLoading = true

      freshcom.retrieveStockable(this.id, {
        include: 'avatar,externalFileCollections'
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
      this.isUpdatingStockable = true

      freshcom.updateStockable(
        this.stockableDraft.id,
        this.stockableDraft
      ).then(stockable => {
        this.$message({
          showClose: true,
          message: `Stockable saved successfully.`,
          type: 'success'
        })

        this.isUpdatingStockable = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingStockable = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowStockable', params: { id: this.stockable.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
