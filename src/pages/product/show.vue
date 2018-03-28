<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListProduct' }">Products</router-link>
    <router-link :to="{ name: 'ListProductCollection' }">Collections</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <img v-if="avatarUrl" :src="avatarUrl">
        <icon v-else name="tag" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Product {{$t(`fields.product.kind.${product.kind}`)}}</span>
          <span>{{product.code}}</span>
        </p>
        <h1>{{product.name}}</h1>
        <p class="id">{{product.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditProduct', params: { id: product.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
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

            <dt>Goods Quantity</dt>
            <dd>{{product.goodsQuantity}}</dd>

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

      <div v-if="canViewChildren" class="block">
        <div v-if="product.kind === 'withVariants'" class="header">
          <h2>Variants</h2>

          <div class="action-group">
            <router-link :to="{ name: 'NewProduct', query: { parentId: product.id, kind: 'variant', callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
              Add
            </router-link>
          </div>
        </div>
        <div v-if="product.kind === 'combo'" class="header">
          <h2>Items</h2>

          <div class="action-group">
            <router-link :to="{ name: 'NewProduct', query: { parentId: product.id, kind: 'item', callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
              Add
            </router-link>
          </div>
        </div>

        <div class="body full">
          <el-table :data="product.children" :show-header="false" class="data-table block-table">
            <el-table-column label="Name" width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }" class="primary" style="display: inline;">
                  {{scope.row.name}}
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="105">
              <template slot-scope="scope">
                <router-link v-if="scope.row.primary" :to="{ name: 'ShowProduct', params: { id: scope.row.id } }" class="primary" style="display: inline;">
                  <el-tag size="mini">
                    Primary
                  </el-tag>
                </router-link>

                <p v-if="canSetChildPrimary(scope.row)" class="action-group">
                  <el-button @click="setChildPrimary(scope.row)" plain size="mini">
                    Set Primary
                  </el-button>
                </p>
              </template>
            </el-table-column>

            <el-table-column label="Status" width="80">
              <template slot-scope="scope">
                <hover-button v-show="scope.row.status === 'active'" @click="deactivateChild(scope.row)" type="primary" hover-type="info">
                  <span slot="normal">{{$t(`fields.product.status.${scope.row.status}`)}}</span>
                  <span slot="hover">Deactive</span>
                </hover-button>

                <hover-button v-show="scope.row.status !== 'active'" @click="activateChild(scope.row)" type="info" hover-type="primary">
                  <span slot="normal">{{$t(`fields.product.status.${scope.row.status}`)}}</span>
                  <span slot="hover">Activate</span>
                </hover-button>
              </template>
            </el-table-column>

            <el-table-column width="100">
              <template slot-scope="scope">
                {{scope.row.defaultPrice | chargeDollar}}
              </template>
            </el-table-column>

            <el-table-column label="Added" align="right">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }">
                  <span>{{scope.row.updatedAt | moment}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <router-link :to="{ name: 'EditProduct', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                      Edit
                    </router-link>
                    <el-button @click="attemptDeleteChild(scope.row)" plain size="mini">
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="launchable">
          <el-dialog :show-close="false" :visible="isConfirmingDeleteChild" :title="`Delete ${childKindForDelete}`" width="600px">
            <p>
              Are you sure you want to delete this {{childKindForDelete}}?
              If you delete this {{childKindForDelete}}, all of the following
              related resources if any will also be deleted:

              <ul>
                <li>All prices that are associated with this {{childKindForDelete}}</li>
                <li>All file collections that are owned by this {{childKindForDelete}} and all files inside those collections</li>
                <li>File that is the avatar of this {{childKindForDelete}}</li>
              </ul>

              <b>This action cannot be undone.</b>
            </p>

            <div slot="footer">
              <el-button :disabled="isDeletingChild" @click="cancelDeleteChild()" plain size="small">Cancel</el-button>
              <el-button :loading="isDeletingChild" @click="deleteChild()" type="danger" size="small">Delete</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <div v-if="canViewPrice" class="block">
        <div class="header">
          <h2>Prices</h2>

          <div class="action-group">
            <router-link :to="{ name: 'NewPrice', query: { product: { id: product.id, type: 'Product', kind: product.kind, name: product.name }, callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
              Add
            </router-link>
          </div>
        </div>

        <div class="body full">
          <el-table :data="product.prices" class="data-table block-table" :show-header="false">
            <el-table-column width="240">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowPrice', params: { id: scope.row.id } }" class="primary">
                  <span>{{scope.row.name}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="120">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowPrice', params: { id: scope.row.id } }">
                  <span>{{scope.row.minimumOrderQuantity}} or more</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowPrice', params: { id: scope.row.id } }">
                  <span>{{scope.row.chargeAmountCents | dollar}}/{{scope.row.chargeUnit}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <router-link :to="{ name: 'EditPrice', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                      Edit
                    </router-link>
                    <el-button @click="attemptDeletePrice(scope.row)" plain size="mini">
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="launchable">
          <el-dialog :show-close="false" :visible="isConfirmingDeletePrice" title="Delete price" width="500px">
            <p>
              Are you sure you want to delete this price?
              If you delete this price, all of the following
              related resources if any will also be deleted:

              <ul>
                <li>All children of this price</li>
              </ul>

              <b>This action cannot be undone.</b>
            </p>

            <div slot="footer">
              <el-button :disabled="isDeletingPrice" @click="cancelDeletePrice()" plain size="small">Cancel</el-button>
              <el-button :loading="isDeletingPrice" @click="deletePrice()" type="danger" size="small">Delete</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <file-collection-block
        :owner="product"
        :records="fileCollections"
        @deleted="loadProduct()"
      >
      </file-collection-block>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{product.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="product.avatar">Avatar</dt>
            <dd v-if="product.avatar">
              <router-link :to="{ name: 'ShowFile', params: { id: product.avatar.id }}">
               {{product.avatar.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteProduct()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteProduct" title="Delete product" width="600px">
      <p>
        Are you sure you want to delete this product?
        If you delete this product, all of the following
        related resources if any will also be deleted:

        <ul>
          <li>All prices that are associated with this product</li>
          <li>All file collections that are owned by this product and all files inside those collections</li>
          <li>File that is the avatar of this product</li>
        </ul>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingProduct" @click="cancelDeleteProduct()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingProduct" @click="deleteProduct()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'

import Product from '@/models/product'
import FileCollectionBlock from '@/components/file-collection-block'
import ConfirmButton from '@/components/confirm-button'
import HoverButton from '@/components/hover-button'
import { dollar, chargeDollar } from '@/helpers/filters'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadProduct' })

export default {
  name: 'ShowProduct',
  mixins: [ResourcePageMixin],
  components: {
    FileCollectionBlock,
    ConfirmButton,
    HoverButton
  },
  filters: {
    dollar,
    chargeDollar
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      product: Product.objectWithDefaults(),
      isLoading: false,

      childForDelete: {},
      isConfirmingDeleteChild: false,
      isDeletingChild: false,

      isConfirmingDeleteProduct: false,
      isDeletingProduct: false,

      isConfirmingDeletePrice: false,
      isDeletingPrice: false
    }
  },
  watch: {
    id () {
      this.reload()
    }
  },
  computed: {
    avatarUrl () {
      if (this.product.avatar) {
        return this.product.avatar.url
      }

      return ''
    },

    canViewChildren () {
      return this.product.kind === 'withVariants' || this.product.kind === 'combo'
    },

    canViewPrice () {
      return this.product.kind === 'simple' || this.product.kind === 'combo' || this.product.kind === 'variant'
    },

    childKindForDelete () {
      return this.$t(`fields.product.kind.${this.childForDelete.kind}`).toLowerCase()
    },

    fileCollections () {
      if (!this.product.fileCollections) { return [] }

      return this.product.fileCollections
    }
  },
  methods: {
    //
    // MARK: Product
    //
    loadProduct () {
      this.isLoading = true

      return freshcom.retrieveProduct(this.id, {
        include: 'prices,avatar,children.defaultPrice,fileCollections'
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

    attemptDeleteProduct () {
      this.isConfirmingDeleteProduct = true
    },

    cancelDeleteProduct () {
      this.isConfirmingDeleteProduct = false
    },

    deleteProduct () {
      this.isDeletingProduct = true

      freshcom.deleteProduct(this.product.id).then(() => {
        this.$message({
          showClose: true,
          message: `Product deleted successfully.`,
          type: 'success'
        })

        this.isDeletingProduct = false
        this.cancelDeleteProduct()
        this.defaultBack()
      }).catch(() => {
        this.isDeletingProduct = false
      })
    },

    //
    // MARK: Child
    //
    canSetChildPrimary (child) {
      return child.kind === 'variant' && !child.primary
    },

    setChildPrimary (variant) {
      let variantDraft = _.cloneDeep(variant)
      variantDraft.primary = true

      freshcom.updateProduct(variantDraft.id, variantDraft).then((response) => {
        let updatedVariant = response.data

        _.each(this.product.children, (variant) => {
          variant.primary = false

          if (variant.id === updatedVariant.id) {
            variant.primary = updatedVariant.primary
          }
        })

        this.$message({
          showClose: true,
          message: 'Variant marked as primary successfully.',
          type: 'success'
        })
      }).catch(errors => {
        let translatedErrors = translateErrors(errors, 'product')
        this.$alert(translatedErrors.status, 'Error')
        throw errors
      })
    },

    activateChild (child) {
      let childDraft = _.cloneDeep(child)
      childDraft.status = 'active'

      freshcom.updateProduct(childDraft.id, childDraft).then((response) => {
        let updatedChild = response.data

        _.each(this.product.children, (child) => {
          if (child.id === updatedChild.id) {
            child.status = updatedChild.status
          }
        })

        let childKind = this.$t(`fields.product.kind.${child.kind}`)
        this.$message({
          showClose: true,
          message: `${childKind} activated successfully.`,
          type: 'success'
        })
      }).catch(response => {
        let translatedErrors = translateErrors(response.errors, 'product')
        this.$alert(translatedErrors.status, 'Error')
        throw response.errors
      })
    },

    deactivateChild (child) {
      let childDraft = _.cloneDeep(child)
      childDraft.status = 'draft'

      freshcom.updateProduct(childDraft.id, childDraft).then((response) => {
        let updatedChild = response.data

        _.each(this.product.children, (child) => {
          if (child.id === updatedChild.id) {
            child.status = updatedChild.status
          }
        })

        let childKind = this.$t(`fields.product.kind.${child.kind}`)
        this.$message({
          showClose: true,
          message: `${childKind} deactivated successfully.`,
          type: 'success'
        })
      }).catch(response => {
        let translatedErrors = translateErrors(response.errors, 'product')
        this.$alert(translatedErrors.status, 'Error')
        throw response.errors
      })
    },

    attemptDeleteChild (child) {
      this.childForDelete = child
      this.isConfirmingDeleteChild = true
    },

    cancelDeleteChild () {
      this.isConfirmingDeleteChild = false
    },

    deleteChild () {
      this.isDeletingChild = true

      freshcom.deleteProduct(this.childForDelete.id).then(() => {
        return this.loadProduct()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product deleted successfully.`,
          type: 'success'
        })

        this.isDeletingChild = false
        this.cancelDeleteChild()
      }).catch(() => {
        this.isDeletingChild = false
      })
    },

    //
    // MARK: Price
    //
    editPrice (price) {
      this.$store.dispatch('pushRoute', {
        name: 'EditPrice',
        params: { id: price.id },
        query: { callbackPath: this.currentRoutePath }
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
    },

    attemptDeletePrice (price) {
      this.priceForDelete = price
      this.isConfirmingDeletePrice = true
    },

    cancelDeletePrice () {
      this.isConfirmingDeletePrice = false
    },

    deletePrice () {
      this.isDeletingPrice = true

      freshcom.deletePrice(this.priceForDelete.id).then(() => {
        return this.loadPrice()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product deleted successfully.`,
          type: 'success'
        })

        this.isDeletingPrice = false
        this.cancelDeletePrice()
      }).catch(() => {
        this.isDeletingPrice = false
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
