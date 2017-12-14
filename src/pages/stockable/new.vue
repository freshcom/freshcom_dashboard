<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/stockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">Stockables</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <span style="line-height: 36px;">Create a stockable</span>

        <div class="pull-right">
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
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Stockable from '@/models/stockable'
import StockableForm from '@/components/stockable-form'

export default {
  name: 'NewStockable',
  mixins: [PageMixin],
  components: {
    StockableForm
  },
  data () {
    return {
      stockableDraft: Stockable.objectWithDefaults(),
      isCreatingStockable: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingStockable = true

      freshcom.createStockable(this.stockableDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Stockable created successfully.`,
          type: 'success'
        })

        this.isCreatingStockable = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingStockable = false
        throw response
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListStockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
