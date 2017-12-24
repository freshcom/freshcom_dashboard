<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector @change="loadProduct(id)" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <div class="brief">
          <div class="avatar">
            <img :src="avatarUrl">
          </div>

          <div class="detail">
            <p>
              <span>Product {{$t(`fields.product.kind.${product.kind}`)}}</span>
              <span>{{product.code}}</span>
            </p>
            <h2>{{product.name}}</h2>
            <p class="id">{{product.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editProduct(product)" plain size="small">Edit</el-button>
        </div>
      </div>

      <div class="data">
        <div class="block-title">
          <h3>Details</h3>
        </div>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt>ID</dt>
              <dd>{{product.id}}</dd>

              <dt>Code</dt>
              <dd>{{product.code}}</dd>

              <dt>Status</dt>
              <dd>
                {{$t(`fields.product.status.${product.status}`)}}
              </dd>

              <dt>Kind</dt>
              <dd>
                {{$t(`fields.product.kind.${product.kind}`)}}
              </dd>

              <dt>Name Sync</dt>
              <dd>{{$t(`fields.product.nameSync.${product.nameSync}`)}}</dd>

              <dt>Name</dt>
              <dd>{{product.name}}</dd>

              <dt>Short Name</dt>
              <dd>{{product.shortName}}</dd>

              <dt>Print Name</dt>
              <dd>{{product.printName}}</dd>

              <dt>Sort Index</dt>
              <dd>{{product.sortIndex}}</dd>

              <dt>Source Quantity</dt>
              <dd>{{product.sourceQuantity}}</dd>

              <dt>Maximum Public OQ</dt>
              <dd>{{product.maximumPublicOrderQuantity}}</dd>

              <dt>Auto Fulfill</dt>
              <dd>{{product.autoFulfill}}</dd>

              <dt>Caption</dt>
              <dd>{{product.caption}}</dd>

              <dt>Description</dt>
              <dd>{{product.description}}</dd>
            </dl>
          </div>
        </div>

        <template v-if="product.kind === 'combo'">
          <div class="block-title">
            <h3>Items</h3>

            <span class="block-title-actions pull-right">
              <router-link :to="{ name: 'NewProduct', query: { parentId: product.id, callbackPath: currentRoutePath } }">
                <icon name="plus" scale="0.8" class="v-middle"></icon>
                <span>Add</span>
              </router-link>
            </span>
          </div>

          <div class="block">
            <div class="block-body full">
              <el-table :data="product.items" :show-header="false" class="block-table" style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }">
                      <span>{{scope.row.name}}</span>
                      <el-tag v-if="scope.row.status != 'active'" type="gray" size="mini">
                        {{$t(`fields.product.status.${scope.row.status}`)}}
                      </el-tag>
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column width="300">
                  <template slot-scope="scope">
                    <p class="text-right actions">
                      <el-button @click="editProduct(scope.row)" plain size="mini">
                        Edit
                      </el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="block-footer text-center">
              <a class="view-more" href="#">View More</a>
            </div>
          </div>
        </template>


        <template v-if="product.kind === 'withVariants'">
          <div class="block-title">
            <h3>Variants</h3>

            <span class="block-title-actions pull-right">
              <router-link :to="{ name: 'NewProduct', query: { parentId: product.id, kind: 'variant', callbackPath: currentRoutePath } }">
                <icon name="plus" scale="0.8" class="v-middle"></icon>
                <span>Add</span>
              </router-link>
            </span>
          </div>

          <div class="block">
            <div class="block-body full">
              <el-table :data="product.variants" :show-header="false" class="block-table" style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }">
                      <span>{{scope.row.name}}</span>
                      <el-tag v-if="scope.row.status != 'active'" type="gray" size="mini">
                        {{$t(`fields.product.status.${scope.row.status}`)}}
                      </el-tag>

                      <el-tag v-if="scope.row.primary" size="mini">
                        Primary
                      </el-tag>
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column width="150">
                  <template slot-scope="scope">
                    {{scope.row.defaultPrice | chargeDollar}}
                  </template>
                </el-table-column>

                <el-table-column width="300">
                  <template slot-scope="scope">
                    <p class="text-right actions">
                      <el-button v-if="scope.row.status == 'draft'" @click="markVariantActive(scope.row)" plain size="mini">
                        Mark Active
                      </el-button>

                      <el-button v-if="canMarkVariantPrimary(scope.row)" @click="markVariantPrimary(scope.row)" plain size="mini">
                        Mark Primary
                      </el-button>

                      <el-button @click="editProduct(scope.row)" plain size="mini">
                        Edit
                      </el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>


            <div class="block-footer text-center">
              <a class="view-more" href="#">View More</a>
            </div>
          </div>
        </template>

        <div class="clearfix"></div>

        <template v-if="canHavePrice(product)">
          <div class="block-title">
            <h3>Prices</h3>

            <span class="block-title-actions pull-right">
              <router-link :to="{ name: 'NewPrice', query: { productKind: product.kind, productId: product.id, callbackPath: currentRoutePath } }">
                <icon name="plus" scale="0.8" class="v-middle"></icon>
                <span>Add</span>
              </router-link>
            </span>
          </div>

          <div class="block">
            <div class="block-body full">
              <el-table :data="product.prices" class="block-table" :show-header="false" style="width: 100%">
                <el-table-column width="300">
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'ShowPrice', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }">
                      <span v-if="scope.row.name">{{scope.row.name}}</span>
                      <span v-if="!scope.row.name">{{scope.row.label}}</span>
                      <el-tag v-if="scope.row.status != 'active'" type="gray" size="mini">
                        {{$t(`fields.price.status.${scope.row.status}`)}}
                      </el-tag>
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.minimumOrderQuantity}}+</span>
                  </template>
                </el-table-column>

                <el-table-column width="150">
                  <template slot-scope="scope">
                    <span>${{scope.row.chargeAmountCents / 100}}/{{scope.row.chargeUnit}}</span>
                  </template>
                </el-table-column>

                <el-table-column>
                  <template slot-scope="scope">
                    <p class="text-right actions">
                      <el-button v-if="scope.row.status == 'draft'" @click="markPriceActive(scope.row)" plain size="mini">
                        Mark Active
                      </el-button>

                      <el-button @click="editPrice(scope.row)" plain size="mini">
                        Edit
                      </el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="block-footer text-center">
              <a class="view-more" href="#">View More</a>
            </div>
          </div>
        </template>

        <div class="block-title">
          <h3>File Collections</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewExternalFileCollection', query: { ownerId: product.id, ownerType: 'Product', callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="product.externalFileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="500">
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowExternalFileCollection', params: { id: scope.row.id } }">
                    <span>{{scope.row.name}}</span>
                    <span v-if="scope.row.name"> - </span>
                    <span>{{scope.row.label}}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.fileCount}} files</span>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <router-link :to="{ name: 'EditExternalFileCollection', params: { id: scope.row.id }}">
                      <icon name="pencil" scale="0.8" class="v-middle"></icon>
                      <span class="v-middle">Edit</span>
                    </router-link>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="block-footer text-center">
            <a class="view-more" href="#">View More</a>
          </div>
        </div>


        <div class="block-title">
          <h3>Custom Data</h3>
        </div>
        <div class="block">
          <div class="block-body">
            {{product.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="product.avatar">Avatar</dt>
              <dd v-if="product.avatar"><a href="#">{{product.avatar.id}}</a></dd>
            </dl>
            <dl>
              <dt v-if="product.parent">Parent</dt>
              <dd v-if="product.parent"><a href="#">{{product.parent.id}}</a></dd>
            </dl>
          </div>
        </div>

        <h3>Logs</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Events</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>
      </div>

      <div class="footer text-right">
        <confirm-button @confirmed="deleteProduct()" size="small">Delete</confirm-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/plus'
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Product from '@/models/product'
import ConfirmButton from '@/components/confirm-button'
import translateErrors from '@/helpers/translate-errors'
import { chargeDollar } from '@/helpers/filters'

export default {
  name: 'ShowProduct',
  mixins: [PageMixin],
  components: {
    ConfirmButton
  },
  filters: {
    chargeDollar
  },
  props: ['id'],
  data () {
    return {
      product: Product.objectWithDefaults(),
      isLoading: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.loadProduct(to.params.id)
    next()
  },
  created () {
    this.loadProduct(this.id)
  },
  computed: {
    avatarUrl () {
      if (this.product.avatar) {
        return this.product.avatar.url
      }

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadProduct (id) {
      this.isLoading = true

      freshcom.retrieveProduct(id, {
        include: 'prices,avatar,items,variants.defaultPrice,externalFileCollections'
      }).then(response => {
        this.product = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    editProduct (product) {
      this.$store.dispatch('pushRoute', {
        name: 'EditProduct',
        params: { id: product.id },
        query: { callbackPath: this.currentRoutePath }
      })
    },

    deleteProduct () {
      freshcom.deleteProduct(this.product.id).then(() => {
        this.$message({
          showClose: true,
          message: `Product deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    editPrice (price) {
      this.$store.dispatch('pushRoute', {
        name: 'EditPrice',
        params: { id: price.id },
        query: { callbackPath: this.currentRoutePath }
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    },

    canMarkVariantPrimary (product) {
      return this.product.kind === 'withVariants' && !product.primary
    },

    canHavePrice (product) {
      return product.kind !== 'withVariants'
    },

    markVariantActive (variant) {
      let variantDraft = _.cloneDeep(variant)
      variantDraft.status = 'active'

      freshcom.updateProduct(variantDraft.id, variantDraft).then((response) => {
        let updatedVariant = response.data

        _.each(this.product.variants, (variant) => {
          if (variant.id === updatedVariant.id) {
            variant.status = updatedVariant.status
          }
        })

        this.$message({
          showClose: true,
          message: 'Product variant updated successfully.',
          type: 'success'
        })
      }).catch(errors => {
        let translatedErrors = translateErrors(errors, 'product')
        this.$alert(translatedErrors.status, 'Error')
        throw errors
      })
    },

    markVariantPrimary (variant) {
      let variantDraft = _.cloneDeep(variant)
      variantDraft.primary = true

      freshcom.updateProduct(variantDraft.id, variantDraft).then((response) => {
        let updatedVariant = response.data

        _.each(this.product.variants, (variant) => {
          variant.primary = false

          if (variant.id === updatedVariant.id) {
            variant.primary = updatedVariant.primary
          }
        })

        this.$message({
          showClose: true,
          message: 'Product variant marked as primary successfully.',
          type: 'success'
        })
      }).catch(errors => {
        let translatedErrors = translateErrors(errors, 'product')
        this.$alert(translatedErrors.status, 'Error')
        throw errors
      })
    },

    markPriceActive (price) {
      let priceDraft = _.cloneDeep(price)
      priceDraft.status = 'active'

      freshcom.updatePrice(priceDraft.id, priceDraft).then((response) => {
        let updatedPrice = response.data

        _.each(this.product.prices, (price) => {
          if (price.id === updatedPrice.id) {
            price.status = updatedPrice.status
          }
        })

        this.$message({
          showClose: true,
          message: 'Price updated successfully.',
          type: 'success'
        })
      }).catch(errors => {
        let translatedErrors = translateErrors(errors, 'price')
        this.$alert(translatedErrors.status, 'Error')
        throw errors
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
