<template>
<content-container>
  <div slot="header">
    <el-menu :router="true" default-active="/stockables" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">
        Stockables
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Create a stockable</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form @submit.native.prevent="submit()" label-width="140px" size="small">
            <stockable-fieldset v-model="stockableDraft" :errors="errors"></stockable-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Stockable from '@/models/stockable'
import StockableFieldset from '@/components/stockable-fieldset'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewStockable',
  mixins: [PageMixin],
  components: {
    StockableFieldset
  },
  data () {
    return {
      stockableDraft: Stockable.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createStockable(this.stockableDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Stockable created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListStockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
