<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/product_collections" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
        Products
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">
        Collections
      </el-menu-item>
    </el-menu>
    <locale-selector @change="searchProductCollection()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief">
          <div class="avatar">
            <icon name="folder" class="avatar-icon"></icon>
          </div>

          <div class="detail">
            <p>{{productCollection.code}}</p>
            <h2>{{productCollection.name}}</h2>
            <p class="id">{{productCollection.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editProductCollection()" plain size="small">Edit</el-button>
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
              <dd>{{productCollection.id}}</dd>

              <dt>Name</dt>
              <dd>{{productCollection.name}}</dd>

              <dt>Label</dt>
              <dd>{{productCollection.label}}</dd>
            </dl>
          </div>
        </div>

        <div class="block-title">
          <h3>Products</h3>

          <span class="block-title-actions pull-right">
            <el-button @click="openAddMembershipDialog()" plain size="mini">
              Mark All Active
            </el-button>

            <el-button @click="openAddMembershipDialog()" plain size="mini">
              Add Product
            </el-button>
          </span>
        </div>
        <div class="block">
          <div class="block-body full">
            <el-table :data="productCollection.memberships" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.product.id } }">
                    {{scope.row.product.name}}
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-tag size="mini" type="info">
                    {{$t(`fields.product.status.${scope.row.product.status}`)}}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column width="80">
                <template slot-scope="scope">
                  <span>{{scope.row.sortIndex}}</span>
                </template>
              </el-table-column>

              <el-table-column width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.insertedAt | moment}}</span>
                </template>
              </el-table-column>

              <el-table-column width="220">
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <el-button @click="markProductActive(scope.row.product)" v-if="scope.row.product.status === 'draft'" plain size="mini">
                      Mark Active
                    </el-button>

                    <el-button @click="openEditMembershipDialog(scope.row)" plain size="mini">
                      Edit
                    </el-button>

                    <delete-button @confirmed="deleteMembership(scope.row.id)" size="mini">
                      Delete
                    </delete-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <h3>Custom Data</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="productCollection.product">Product</dt>
              <dd v-if="productCollection.product">
                <router-link :to="{ name: 'ShowProduct', params: { id: productCollection.product.id }}">
                  {{productCollection.product.id}}
                </router-link>
              </dd>
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
        <delete-button @confirmed="deleteEfc()" size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isAddingMembership" title="Add product to collection" width="500px">
      <product-collection-membership-form v-model="membershipForAdd" :errors="errors"></product-collection-membership-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingMembership" @click="closeAddMembershipDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingMembership" @click="createMembership()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/folder'
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import ProductCollection from '@/models/product-collection'
import ProductCollectionMembership from '@/models/product-collection-membership'
import ProductCollectionMembershipForm from '@/components/product-collection-membership-form'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowProductCollection',
  props: ['id'],
  components: {
    ProductCollectionMembershipForm,
    DeleteButton
  },
  data () {
    return {
      productCollection: ProductCollection.objectWithDefaults(),
      isLoading: false,
      errors: {},

      isAddingMembership: false,
      membershipForAdd: ProductCollectionMembership.objectWithDefaults(),
      isCreatingMembership: false
    }
  },
  created () {
    this.loadProductCollection()
  },
  methods: {
    loadProductCollection (options = { shouldShowLoading: true }) {
      if (options.shouldShowLoading) {
        this.isLoading = true
      }

      freshcom.retrieveProductCollection(this.id, {
        include: 'memberships.product'
      }).then(response => {
        this.productCollection = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },
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
        return this.loadProductCollection({ shouldShowLoading: false })
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingMembership = false
        return response
      })
    },

    openEditMembershipDialog () {

    },

    markProductActive (product) {
      let productDraft = _.cloneDeep(product)
      productDraft.status = 'active'

      freshcom.updateProduct(product.id, productDraft).then(() => {
        return this.loadProductCollection({ shouldShowLoading: false })
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product marked as active successfully.`,
          type: 'success'
        })
      })
    },

    deleteMembership (id) {
      freshcom.deleteProductCollectionMembership(id).then(() => {
        return this.loadProductCollection({ shouldShowLoading: false })
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product removed from collection successfully.`,
          type: 'success'
        })
      })
    },

    editProductCollection () {
      this.$store.dispatch('pushRoute', { name: 'EditProductCollection', params: { id: this.id } })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListProductCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
