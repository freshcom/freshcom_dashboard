<template>
<div class="main-col">
  <div class="content">
    <div class="secondary-nav">
      <el-menu :router="true" default-active="/products" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      </el-menu>
      <locale-selector @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">

            <div class="brief">
              <div class="avatar">
                <img :src="avatarUrl">
              </div>

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
                  <dd>{{record.status}}</dd>

                  <dt>Item Mode</dt>
                  <dd>{{record.itemMode}}</dd>

                  <dt>Name</dt>
                  <dd>{{record.name}}</dd>

                  <dt>Print Name</dt>
                  <dd>{{record.printName}}</dd>

                  <dt>Caption</dt>
                  <dd>{{record.caption}}</dd>

                  <dt>Description</dt>
                  <dd>{{record.description}}</dd>
                </dl>
              </div>
            </div>

            <div class="block-title">
              <h3>Items</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewProductItem', query: { productId: record.id, callbackPath: currentRoutePath } }">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </router-link>
              </span>
            </div>

            <div class="block">
              <div class="block-body full">
                <el-table :data="record.items" stripe class="block-table" :show-header="false" style="width: 100%">
                  <el-table-column width="320">
                    <template scope="scope">
                      <router-link :to="{ name: 'ShowProductItem', params: { id: scope.row.id } }">
                        <span>{{scope.row.name}}</span>
                        <el-tag v-if="scope.row.status != 'active'" type="gray">
                          {{$t(`attributes.productItem.status.${scope.row.status}`)}}
                        </el-tag>

                        <el-tag v-if="scope.row.primary">
                          Primary
                        </el-tag>
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column width="150">
                    <template scope="scope">
                      $19.99/EA
                    </template>
                  </el-table-column>

                  <el-table-column>
                    <template scope="scope">
                      <p class="text-right actions">
                        <el-button v-if="!scope.row.primary" @click="markItemPrimary(scope.row)" size="mini">
                          Mark Primary
                        </el-button>

                        <el-button v-if="scope.row.status != 'active'" type="primary" @click="makeItemActive(scope.row.id)" size="mini">
                          Mark Active
                        </el-button>

                        <el-button @click="goTo({ name: 'EditProductItem', params: { id: scope.row.id } })" size="mini">
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
              <h3>File Collections</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewExternalFileCollection', query: { skuId: record.id } }">
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
                  <dt v-if="record.avatar">Avatar</dt>
                  <dd><a href="#">{{record.avatar.id}}</a></dd>
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

import _ from 'lodash'
import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowSku',
  components: {
    DeleteButton
  },
  mixins: [ShowPage({ storeNamespace: 'product', name: 'Product', include: 'avatar,items' })],
  computed: {
    avatarUrl () {
      if (this.record.avatar) {
        return this.record.avatar.url
      }

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditProduct', params: { id: this.record.id } })
    },
    recordDeleted () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    },
    markItemPrimary (item) {
      let itemDraft = _.cloneDeep(item)
      itemDraft.primary = true
      this.$store.dispatch('productItem/updateRecord', { id: itemDraft.id, recordDraft: itemDraft }).then(updatedItem => {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
