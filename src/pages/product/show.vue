<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector @change="loadRecord" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief">
          <div class="avatar">
            <img :src="avatarUrl">
          </div>

          <div class="detail">
            <p>
              <span>Product {{$t(`attributes.product.kind.${record.kind}`)}}</span>
              <span>{{record.code}}</span>
            </p>
            <h2>{{record.name}}</h2>
            <p class="id">{{record.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editRecord()" size="medium">Edit</el-button>
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
              <dd>{{record.id}}</dd>

              <dt>Code</dt>
              <dd>{{record.code}}</dd>

              <dt>Status</dt>
              <dd>
                {{$t(`attributes.product.status.${record.status}`)}}
              </dd>

              <dt>Kind</dt>
              <dd>
                {{$t(`attributes.product.kind.${record.kind}`)}}
              </dd>

              <dt>Name Sync</dt>
              <dd>{{$t(`attributes.product.nameSync.${record.nameSync}`)}}</dd>

              <dt>Name</dt>
              <dd>{{record.name}}</dd>

              <dt>Short Name</dt>
              <dd>{{record.shortName}}</dd>

              <dt>Print Name</dt>
              <dd>{{record.printName}}</dd>

              <dt>Sort Index</dt>
              <dd>{{record.sortIndex}}</dd>

              <dt>Source Quantity</dt>
              <dd>{{record.sourceQuantity}}</dd>

              <dt>Maximum Public OQ</dt>
              <dd>{{record.maximumPublicOrderQuantity}}</dd>

              <dt>Caption</dt>
              <dd>{{record.caption}}</dd>

              <dt>Description</dt>
              <dd>{{record.description}}</dd>
            </dl>
          </div>
        </div>

        <template v-if="record.kind === 'combo'">
          <div class="block-title">
            <h3>Items</h3>

            <span class="block-title-actions pull-right">
              <router-link :to="{ name: 'NewProduct', query: { parentId: record.id, callbackPath: currentRoutePath } }">
                <icon name="plus" scale="0.8" class="v-middle"></icon>
                <span>Add</span>
              </router-link>
            </span>
          </div>

          <div class="block">
            <div class="block-body full">
              <el-table :data="record.items" :show-header="false" class="block-table" style="width: 100%">
                <el-table-column>
                  <template scope="scope">
                    <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }">
                      <span>{{scope.row.name}}</span>
                      <el-tag v-if="scope.row.status != 'active'" type="gray" size="mini">
                        {{$t(`attributes.product.status.${scope.row.status}`)}}
                      </el-tag>
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column width="300">
                  <template scope="scope">
                    <p class="text-right actions">
                      <el-button @click="goTo({ name: 'EditProduct', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } })" size="mini">
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


        <template v-if="record.kind === 'withVariants'">
          <div class="block-title">
            <h3>Variants</h3>

            <span class="block-title-actions pull-right">
              <router-link :to="{ name: 'NewProduct', query: { parentId: record.id, kind: 'variant', callbackPath: currentRoutePath } }">
                <icon name="plus" scale="0.8" class="v-middle"></icon>
                <span>Add</span>
              </router-link>
            </span>
          </div>

          <div class="block">
            <div class="block-body full">
              <el-table :data="record.variants" :show-header="false" class="block-table" style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }">
                      <span>{{scope.row.name}}</span>
                      <el-tag v-if="scope.row.status != 'active'" type="gray" size="mini">
                        {{$t(`attributes.product.status.${scope.row.status}`)}}
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
                      <el-button v-if="isMarkVariantPrimaryVisible(scope.row)" @click="markVariantPrimary(scope.row)" size="mini">
                        Mark Primary
                      </el-button>

                      <el-button v-if="scope.row.status == 'draft'" type="primary" @click="markVariantActive(scope.row)" size="mini">
                        Mark Active
                      </el-button>

                      <el-button @click="goTo({ name: 'EditProduct', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } })" size="mini">
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

        <template v-if="canHavePrice(record)">
          <div class="block-title">
            <h3>Prices</h3>

            <span class="block-title-actions pull-right">
              <router-link :to="{ name: 'NewPrice', query: { productKind: record.kind, productId: record.id, callbackPath: currentRoutePath } }">
                <icon name="plus" scale="0.8" class="v-middle"></icon>
                <span>Add</span>
              </router-link>
            </span>
          </div>

          <div class="block">
            <div class="block-body full">
              <el-table :data="record.prices" class="block-table" :show-header="false" style="width: 100%">
                <el-table-column width="300">
                  <template scope="scope">
                    <router-link :to="{ name: 'ShowPrice', params: { id: scope.row.id } }">
                      <span v-if="scope.row.name">{{scope.row.name}}</span>
                      <span v-if="!scope.row.name">{{scope.row.label}}</span>
                      <el-tag v-if="scope.row.status != 'active'" type="gray" size="mini">
                        {{$t(`attributes.price.status.${scope.row.status}`)}}
                      </el-tag>
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column width="100">
                  <template scope="scope">
                    <span>{{scope.row.minimumOrderQuantity}}+</span>
                  </template>
                </el-table-column>

                <el-table-column width="150">
                  <template scope="scope">
                    <span>${{scope.row.chargeCents / 100}}/{{scope.row.chargeUnit}}</span>
                  </template>
                </el-table-column>

                <el-table-column>
                  <template scope="scope">
                    <p class="text-right actions">
                      <el-button v-if="scope.row.status == 'draft'" type="primary" @click="markPriceActive(scope.row)" size="mini">
                        Mark Active
                      </el-button>

                      <el-button @click="goTo({ name: 'EditPrice', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } })" plain size="mini">
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
            <router-link :to="{ name: 'NewExternalFileCollection', query: { productId: record.id, callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="record.externalFileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="500">
                <template scope="scope">
                  <router-link :to="{ name: 'ShowExternalFileCollection', params: { id: scope.row.id } }">
                    <span>{{scope.row.name}}</span>
                    <span v-if="scope.row.name"> - </span>
                    <span>{{scope.row.label}}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template scope="scope">
                  <span>{{scope.row.fileCount}} files</span>
                </template>
              </el-table-column>

              <el-table-column>
                <template scope="scope">
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
            {{record.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="record.avatar">Avatar</dt>
              <dd v-if="record.avatar"><a href="#">{{record.avatar.id}}</a></dd>
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
        <delete-button @confirmed="deleteRecord" size="medium">Delete</delete-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

import _ from 'lodash'
import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'
import translateErrors from '@/helpers/translate-errors'
import { chargeDollar } from '@/helpers/filters'

export default {
  name: 'ShowProduct',
  components: {
    DeleteButton
  },
  filters: {
    chargeDollar
  },
  mixins: [ShowPage({ storeNamespace: 'product', name: 'Product', include: 'prices,avatar,items,variants.defaultPrice,externalFileCollections' })],
  computed: {
    avatarUrl () {
      if (this.record.avatar) {
        return this.record.avatar.url
      }

      return 'http://placehold.it/80x80'
    }
  },
  methods: {
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditProduct', params: { id: this.record.id } })
    },
    recordDeleted () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    },
    isMarkVariantPrimaryVisible (product) {
      return this.record.kind === 'withVariants' && !product.primary
    },
    canHavePrice (record) {
      return record.kind !== 'withVariants'
    },
    markVariantActive (variant) {
      let variantDraft = _.cloneDeep(variant)
      variantDraft.status = 'active'
      this.$store.dispatch('product/updateVariant', { id: variantDraft.id, recordDraft: variantDraft }).then(updatedVariant => {
        this.$message({
          showClose: true,
          message: 'Product Variant updated successfully.',
          type: 'success'
        })

        return updatedVariant
      }).catch(errors => {
        let translatedErrors = translateErrors(errors, 'product')
        this.$alert(translatedErrors.status, 'Error')
        throw errors
      })
    },
    markVariantPrimary (item) {
      let variantDraft = _.cloneDeep(item)
      variantDraft.primary = true
      this.$store.dispatch('product/updateVariant', { id: variantDraft.id, recordDraft: variantDraft }).then(updatedItem => {
        let product = _.cloneDeep(this.record)
        _.each(product.items, (item) => {
          if (item.id === updatedItem.id) {
            item.primary = true
          } else {
            item.primary = false
          }
        })

        return this.$store.dispatch('product/setRecord', product)
      })
    },
    markPriceActive (price) {
      let priceDraft = _.cloneDeep(price)
      priceDraft.status = 'active'
      return this.$store.dispatch('price/updateRecord', { id: priceDraft.id, recordDraft: priceDraft }).then(updatedPrice => {
        let product = _.cloneDeep(this.record)
        _.each(product.prices, (price) => {
          if (price.id === updatedPrice.id) {
            price.status = updatedPrice.status
          }
        })

        this.$store.dispatch('product/setRecord', product)

        this.$message({
          showClose: true,
          message: 'Price updated successfully.',
          type: 'success'
        })

        return updatedPrice
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
