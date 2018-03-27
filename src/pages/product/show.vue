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
          <el-table :data="product.variants" :show-header="false" class="data-table block-table">
            <el-table-column label="Name" width="240">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id } }" class="primary" style="display: inline;">
                  <span>{{scope.row.name}}</span>

                  <el-tag v-if="scope.row.primary" size="mini" class="m-l-10">
                    Primary
                  </el-tag>
                </router-link>

                <p v-if="canSetVariantPrimary(scope.row)" class="action-group" style="display: inline;">
                  <el-button @click="setVariantPrimary(scope.row)" plain size="mini" class="m-l-10">
                    Set Primary
                  </el-button>
                </p>
              </template>
            </el-table-column>

            <el-table-column label="Status" width="100">
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
            <router-link :to="{ name: 'NewPrice', query: { productId: product.id, productKind: 'item', callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
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
                    <el-button plain size="mini">
                      Edit
                    </el-button>
                    <el-button plain size="mini">
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

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
  </div>

</content-container>


<!-- <div class="page-wrapper">
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

                      <el-button v-if="canSetVariantPrimary(scope.row)" @click="setVariantPrimary(scope.row)" plain size="mini">
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

        <template v-if="canViewPrice(product)">
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
            <router-link :to="{ name: 'NewFileCollection', query: { ownerId: product.id, ownerType: 'Product', callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="product.fileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="500">
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id } }">
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
                    <router-link :to="{ name: 'EditFileCollection', params: { id: scope.row.id }}">
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
              <dt v-if="product.goods">Goods</dt>
              <dd v-if="product.goods"><a href="#">{{product.goods.id}}</a></dd>
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
</div> -->

</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'

import Product from '@/models/product'
import ConfirmButton from '@/components/confirm-button'
import HoverButton from '@/components/hover-button'
import { dollar, chargeDollar } from '@/helpers/filters'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadProduct' })

export default {
  name: 'ShowProduct',
  mixins: [ResourcePageMixin],
  components: {
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
      isDeletingChild: false
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
      return this.product.kind !== 'withVariants'
    },

    childKindForDelete () {
      return this.$t(`fields.product.kind.${this.childForDelete.kind}`).toLowerCase()
    }
  },
  methods: {
    //
    // MARK: Product
    //
    loadProduct () {
      this.isLoading = true

      return freshcom.retrieveProduct(this.id, {
        include: 'prices,avatar,items,variants.defaultPrice,fileCollections'
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

    //
    // MARK: Child
    //
    canSetVariantPrimary (variant) {
      return !variant.primary
    },

    setVariantPrimary (variant) {
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

        _.each(this.product.childs, (child) => {
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

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
