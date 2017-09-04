<template>
<div class="main-col">
  <div class="content">
    <div class="secondary-nav">
      <el-menu :router="true" default-active="/product_items" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      </el-menu>
      <locale-selector @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">

            <div class="brief no-avatar">
              <div class="detail">
                <p>{{record.code}}</p>
                <h2>{{record.name}}</h2>
                <p class="id">{{record.id}}</p>
              </div>
            </div>

            <div class="header-actions">
              <el-button @click="editRecord()">Edit</el-button>
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
                    {{$t(`attributes.productItem.status.${record.status}`)}}
                    <el-button type="primary" size="mini" class="m-l-10">
                      Mark Active
                    </el-button>
                  </dd>

                  <dt>Name Sync</dt>
                  <dd>{{$t(`attributes.productItem.nameSync.${record.nameSync}`)}}</dd>

                  <dt>Name</dt>
                  <dd>{{record.name}}</dd>

                  <dt>Short Name</dt>
                  <dd>{{record.shortName}}</dd>

                  <dt>Sort Index</dt>
                  <dd>{{record.sortIndex}}</dd>

                  <dt>Source Quantity</dt>
                  <dd>{{record.sourceQuantity}}</dd>

                  <dt>Maximum Public OQ</dt>
                  <dd>{{record.maximumPublicOrderQuantity}}</dd>
                </dl>
              </div>
            </div>

            <div class="block-title">
              <h3>Prices</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewPrice', query: { productItemId: record.id, callbackPath: currentRoutePath } }">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </router-link>
              </span>
            </div>

            <div class="block">
              <div class="block-body full">
                <el-table :data="record.prices" stripe class="block-table" :show-header="false" style="width: 100%">
                  <el-table-column width="300">
                    <template scope="scope">
                      <router-link :to="{ name: 'ShowPrice', params: { id: scope.row.id } }">
                        <span>{{scope.row.name}}</span>
                        <span v-if="scope.row.name"> - </span>
                        <span>{{scope.row.label}}</span>
                        <el-tag v-if="scope.row.status != 'active'" type="gray">
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
                        <el-button v-if="scope.row.status != 'active'" type="primary" @click="makePriceActive(scope.row.id)" size="mini">
                          Mark Active
                        </el-button>

                        <el-button @click="goTo({ name: 'EditPrice', params: { id: scope.row.id } })" size="mini">
                          Edit
                        </el-button>
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>


              <div class="block-footer no-divider text-center">
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
                  <dt>Product</dt>
                  <dd>
                    <router-link :to="{ name: 'ShowProduct', params: { id: record.product.id }}">
                      {{record.product.id}}
                    </router-link>
                  </dd>

                  <dt v-if="record.sku">SKU</dt>
                  <dd v-if="record.sku">
                    <a href="#">{{record.sku.id}}</a>
                  </dd>

                  <dt v-if="record.unlockable">Unlockable</dt>
                  <dd v-if="record.unlockable">
                    <a href="#">{{record.unlockable.id}}</a>
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
            <delete-button @confirmed="deleteRecord">Delete</delete-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowProductItem',
  components: {
    DeleteButton
  },
  mixins: [ShowPage({ storeNamespace: 'productItem', name: 'Product Item', include: 'prices' })],
  computed: {
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditProductItem', params: { id: this.record.id } })
    },
    recordDeleted () {
      this.$store.dispatch('pushRoute', { name: 'ListProductItem' })
    },
    makePriceActive () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
