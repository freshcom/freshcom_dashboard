<template>
<div class="main-col">
  <div class="content">
    <div class="secondary-nav">
      <el-menu :router="true" default-active="/customers" mode="horizontal">
        <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">Customers</el-menu-item>
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
                <p>Customer {{record.code}}</p>
                <h2>{{record.firstName}} {{record.lastName}}</h2>
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

                  <template v-if="record.code">
                    <dt>Code</dt>
                    <dd>{{record.code}}</dd>
                  </template>

                  <dt>Status</dt>
                  <dd>{{$t(`attributes.customer.status.${record.status}`)}}</dd>

                  <dt>Name</dt>
                  <dd>{{record.firstName}} {{record.lastName}}</dd>

                  <dt>Email</dt>
                  <dd>{{record.email}}</dd>

                  <template v-if="record.phoneNumber">
                    <dt>Phone</dt>
                    <dd>{{record.phoneNumber}}</dd>
                  </template>

                  <template v-if="record.label">
                    <dt>Label</dt>
                    <dd>{{record.label}}</dd>
                  </template>
                </dl>
              </div>
            </div>

            <div class="block-title">
              <h3>Orders</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewOrder', query: { customerId: record.id, callbackPath: currentRoutePath } }">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </router-link>
              </span>
            </div>

            <div class="block">
              <div class="block-body full">
                <el-table :data="record.orders" stripe class="block-table" :show-header="false" style="width: 100%">
                  <el-table-column width="500">
                    <template scope="scope">
                      <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id } }">
                        <span v-if="scope.row.code">[{{scope.row.code}}]</span>
                        <span v-if="!scope.row.code">{{scope.row.id}}</span>
                        <el-tag v-if="scope.row.status === 'opened'">
                          {{$t(`attributes.order.status.${scope.row.status}`)}}
                        </el-tag>
                        <el-tag v-if="scope.row.status != 'opened'" type="gray">
                          {{$t(`attributes.order.status.${scope.row.status}`)}}
                        </el-tag>
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column width="150">
                    <template scope="scope">
                      {{scope.row.insertedAt | moment("MMM Do YYYY")}}
                    </template>
                  </el-table-column>

                  <el-table-column>
                    <template scope="scope">

                      <p class="text-right">{{scope.row.grandTotalCents | dollar}}</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="block-footer no-divider text-center">
                <a class="view-more" href="#">View More</a>
              </div>
            </div>

            <div class="block-title">
              <h3>Unlocks</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewUnlock', query: { customerId: record.id, callbackPath: currentRoutePath } }">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </router-link>
              </span>
            </div>

            <div class="block">
              <div class="block-body full">
                <el-table :data="record.unlocks" stripe class="block-table" :show-header="false" style="width: 100%">
                  <el-table-column width="500">
                    <template scope="scope">
                      <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.id } }">
                        <span v-if="scope.row.unlockable.code">[{{scope.row.unlockable.code}}]</span>
                        <span>{{scope.row.unlockable.name}}</span>
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column width="150">
                    <template scope="scope">
                      {{scope.row.insertedAt | moment("MMM Do YYYY")}}
                    </template>
                  </el-table-column>

                  <el-table-column>
                    <template scope="scope">
                      <p class="text-right actions">
                        <delete-button @confirmed="deleteUnlock(scope.row.id)" size="mini">
                          Delete
                        </delete-button>
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
                <router-link :to="{ name: 'NewExternalFileCollection', query: { customerId: record.id, callbackPath: currentRoutePath } }">
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
import { dollar } from '@/helpers/filters'

export default {
  name: 'ShowCustomer',
  components: {
    DeleteButton
  },
  filters: {
    dollar
  },
  mixins: [ShowPage({ storeNamespace: 'customer', name: 'Customer', include: 'externalFileCollections,orders,unlocks.unlockable' })],
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
      this.$store.dispatch('pushRoute', { name: 'EditCustomer', params: { id: this.record.id } })
    },
    recordDeleted () {
      this.$store.dispatch('pushRoute', { name: 'ListCustomer' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
