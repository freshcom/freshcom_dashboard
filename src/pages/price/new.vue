<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListProduct' }">Products</router-link>
    <router-link :to="{ name: 'ListProductCollection' }">Collections</router-link>
  </div>

  <div slot="card-header">
    <h1>Create a price</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form @submit.native.prevent="submit()" label-width="180px" size="small">
            <price-fieldset v-model="priceDraft" :errors="errors"></price-fieldset>
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

<!-- <div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a price</span>

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
        <price-form v-model="priceDraft" :record="priceDraft" :errors="errors"></price-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div> -->
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Price from '@/models/price'
import PriceFieldset from '@/components/price-fieldset'
import PageMixin from '@/mixins/page'

export default {
  name: 'NewPrice',
  mixins: [PageMixin],
  components: {
    PriceFieldset
  },
  data () {
    return {
      priceDraft: Price.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  props: {
    product: {
      type: Object
    }
  },
  created () {
    if (this.product) {
      this.priceDraft.product = this.product
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createPrice(this.priceDraft.product.id, this.priceDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Price created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
