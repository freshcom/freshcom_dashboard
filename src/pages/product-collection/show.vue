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
        <icon v-else name="tags" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Product Collection</span>
          <span>{{productCollection.code}}</span>
        </p>
        <h1>{{productCollection.name}}</h1>
        <p class="id">{{productCollection.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditProductCollection', params: { id: productCollection.id } }" class="el-button el-button--small is-plain">
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
            <dd>{{productCollection.id}}</dd>

            <dt>Name</dt>
            <dd>{{productCollection.name}}</dd>

            <dt>Label</dt>
            <dd>{{productCollection.label}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Products <small>({{productCollection.productCount}})</small></h2>

          <div class="action-group">
            <el-button @click="addProduct()" plain size="mini">
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="memberships" :show-header="false" class="data-table block-table">
            <el-table-column label="Name" width="240">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.product.id }, query: { callbackPath: currentRoutePath } }" class="primary">
                  <span>{{scope.row.product.name}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column label="Status" width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.product.id }, query: { callbackPath: currentRoutePath } }">
                  <el-tag v-if="scope.row.product.status === 'active'" :disable-transitions="true" size="mini">
                    {{$t(`fields.product.status.${scope.row.product.status}`)}}
                  </el-tag>
                  <el-tag v-else :disable-transitions="true" type="info" size="mini">
                    {{$t(`fields.product.status.${scope.row.product.status}`)}}
                  </el-tag>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column label="Sort" width="80">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.product.id }, query: { callbackPath: currentRoutePath } }">
                  {{scope.row.product.sortIndex}}
                </router-link>
              </template>
            </el-table-column>

            <el-table-column label="Added" align="right">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.product.id }, query: { callbackPath: currentRoutePath } }">
                  <span>{{scope.row.insertedAt | moment}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <el-button @click="editMembership(scope.row)" plain size="mini">
                      Edit
                    </el-button>
                    <el-button @click="attemptDeleteMembership(scope.row)" plain size="mini">
                      Remove
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="memberships.length >= 5" class="foot text-center">
            <router-link :to="{ name: 'ListProduct', query: { filter: { collectionId: productCollection.id } }}" class="view-more">View More</router-link>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{productCollection.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="productCollection.avatar">Avatar</dt>
            <dd v-if="productCollection.avatar">
              <router-link :to="{ name: 'ShowFile', params: { id: productCollection.avatar.id }}">
               {{productCollection.avatar.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import ProductCollection from '@/models/product-collection'
import ProductCollectionMembership from '@/models/product-collection-membership'
import ProductCollectionMembershipForm from '@/components/product-collection-membership-form'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadProductCollection' })

export default {
  name: 'ShowProductCollection',
  mixins: [ResourcePageMixin],
  components: {
    ProductCollectionMembershipForm
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
      productCollection: ProductCollection.objectWithDefaults(),
      errors: {},

      isAddingMembership: false,
      membershipForAdd: ProductCollectionMembership.objectWithDefaults(),
      isCreatingMembership: false
    }
  },
  computed: {
    memberships () {
      if (this.productCollection && this.productCollection.memberships) {
        return this.productCollection.memberships
      }

      return []
    },

    avatarUrl () {
      if (this.productCollection.avatar) {
        return this.productCollection.avatar.url
      }

      return ''
    }
  },
  methods: {
    loadProductCollection () {
      this.isLoading = true

      return freshcom.retrieveProductCollection(this.id, {
        include: 'memberships.product'
      }).then(response => {
        this.productCollection = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    // MARK: Memberships

    openAddMembershipDialog () {
      let membership = ProductCollectionMembership.objectWithDefaults()
      membership.collection = this.productCollection

      this.membershipForAdd = membership
      this.isAddingMembership = true
    },

    closeAddMembershipDialog () {
      this.isAddingMembership = false
      this.isCreatingMembership = false
    },

    createMembership () {
      this.isCreatingMembership = true

      freshcom.createProductCollectionMembership(this.productCollection.id, this.membershipForAdd).then(() => {
        this.$message({
          showClose: true,
          message: `Product add to collection successfully.`,
          type: 'success'
        })

        this.closeAddMembershipDialog()
        return this.loadMemberships()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingMembership = false
        return response
      })
    },

    openEditMembershipDialog () {

    },

    // MARK: Product

    deleteMembership (id) {
      freshcom.deleteProductCollectionMembership(id).then(() => {
        return this.loadMemberships()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product removed from collection successfully.`,
          type: 'success'
        })
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListProductCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
