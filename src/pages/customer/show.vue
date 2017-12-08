<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/customers" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">Customers</el-menu-item>
    </el-menu>
    <locale-selector @change="loadCustomer()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief">
          <div class="avatar">
            <img :src="avatarUrl">
          </div>

          <div class="detail">
            <p>Customer {{customer.code}}</p>
            <h2>{{customer.firstName}} {{customer.lastName}}</h2>
            <p class="id">{{customer.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button v-if="customer.status === 'registered'" @click="editCustomer()" plain size="small">Reset Password</el-button>
          <el-button @click="editCustomer()" plain size="small">Edit</el-button>
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
              <dd>{{customer.id}}</dd>

              <template v-if="customer.code">
                <dt>Code</dt>
                <dd>{{customer.code}}</dd>
              </template>

              <dt>Status</dt>
              <dd>{{$t(`fields.customer.status.${customer.status}`)}}</dd>

              <dt>Name</dt>
              <dd>{{customer.firstName}} {{customer.lastName}}</dd>

              <dt v-if="customer.otherName">Display Name</dt>
              <dd v-if="customer.otherName">{{customer.otherName}}</dd>

              <dt>Email</dt>
              <dd>{{customer.email}}</dd>

              <template v-if="customer.phoneNumber">
                <dt>Phone</dt>
                <dd>{{customer.phoneNumber}}</dd>
              </template>

              <template v-if="customer.label">
                <dt>Label</dt>
                <dd>{{customer.label}}</dd>
              </template>

              <template v-if="customer.pointAccount">
                <dt>Point Balance</dt>
                <dd>{{customer.pointAccount.balance}}</dd>
              </template>
            </dl>
          </div>
        </div>

        <div class="block-title">
          <h3>Orders</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewOrder', query: { customerId: customer.id, callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="orders" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id } }">
                    <span v-if="scope.row.code">[{{scope.row.code}}]</span>
                    <b>{{scope.row.grandTotalCents | dollar}}</b>
                    <el-tag size="mini" type="info" class="m-l-10">
                      {{$t(`fields.order.status.${scope.row.status}`)}}
                    </el-tag>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column width="120">
                <template slot-scope="scope">
                  {{scope.row.id | idLastPart}}
                </template>
              </el-table-column>

              <el-table-column align="right" width="200">
                <template slot-scope="scope">
                  {{scope.row.insertedAt | moment}}
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="block-footer text-center">
            <a class="view-more" href="#">View More</a>
          </div>
        </div>

        <div class="block-title">
          <h3>Cards</h3>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table v-loading="isLoadingCards" :data="cards" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="200">
                <template slot-scope="scope">
                  <a href="javascript:;">
                    **** {{scope.row.lastFourDigit}}
                  </a>

                  <span class="m-l-10">
                    {{scope.row.brand}}
                  </span>
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template slot-scope="scope">
                  {{scope.row.expMonth}} / {{scope.row.expYear}}
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.primary" size="mini" type="info" class="m-l-10">
                    Primary
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column align="right">
                <template slot-scope="scope">
                  {{scope.row.id | idLastPart}}
                </template>
              </el-table-column>

              <el-table-column align="right" width="200">
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <el-button @click="openEditCardDialog(scope.row)" plain size="mini">
                      Edit
                    </el-button>

                    <delete-button @confirmed="deleteCard(scope.row)" size="mini">
                      Delete
                    </delete-button>
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
          <h3>Unlocks</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewUnlock', query: { customerId: customer.id, callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="unlocks" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.unlockable.id } }">
                    <span v-if="scope.row.unlockable.code">[{{scope.row.unlockable.code}}]</span>
                    <span>{{scope.row.unlockable.name}}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column align="right" width="200">
                <template slot-scope="scope">
                  {{scope.row.insertedAt | moment}}
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <delete-button @confirmed="deleteUnlock(scope.row.id)" size="mini">
                      Delete
                    </delete-button>
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
          <h3>Point Transactions</h3>

          <span class="block-title-actions pull-right">
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="customer.pointAccount.transactions" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  {{scope.row.insertedAt | moment}}
                </template>
              </el-table-column>

              <el-table-column align="right" width="200">
                <template slot-scope="scope">
                  {{scope.row.amount}}
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template slot-scope="scope">
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="block-footer text-center">
            <a class="view-more" href="#">View More</a>
          </div>
        </div>

        <div class="block-title">
          <h3>File Collections</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewExternalFileCollection', query: { customerId: customer.id, callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="customer.externalFileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
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
            {{customer.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="customer.enroller">Enroller</dt>
              <dd v-if="customer.enroller">
                <a href="#">{{customer.enroller.id}}</a>
              </dd>

              <dt v-if="customer.sponsor">Sponsor</dt>
              <dd v-if="customer.sponsor">
                <a href="#">{{customer.sponsor.id}}</a>
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
        <delete-button @confirmed="deleteCustomer()" plain size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>
  <div class="launchable">
    <el-dialog :show-close="false" :visible="isEditingCard" title="Edit Card" width="600px">
      <card-form v-model="cardDraftForEdit" :errors="errors"></card-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingCard" @click="closeEditCardDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingCard" @click="updateCard()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/plus'
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Customer from '@/models/customer'
import Card from '@/models/card'
import DeleteButton from '@/components/delete-button'
import CardForm from '@/components/card-form'
import { dollar, idLastPart } from '@/helpers/filters'

export default {
  name: 'ShowCustomer',
  props: ['id'],
  components: {
    DeleteButton,
    CardForm
  },
  filters: {
    dollar,
    idLastPart
  },
  data () {
    return {
      customer: Customer.objectWithDefaults(),
      isLoading: false,

      isLoadingCards: false,
      cards: [],

      isLoadingOrders: false,
      orders: [],

      isLoadingUnlocks: false,
      unlocks: [],

      cardDraftForEdit: Card.objectWithDefaults(),
      isEditingCard: false,
      isUpdatingCard: false,

      errors: {}
    }
  },
  created () {
    this.loadCustomer()
    this.loadOrders()
    this.loadUnlocks()
    this.loadCards()
  },
  computed: {
    avatarUrl () {
      if (this.customer.avatar) {
        return this.customer.avatar.url
      }

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadCustomer () {
      this.isLoading = true

      freshcom.retrieveCustomer(this.id, {
        include: 'unlocks.unlockable,point_account.transactions'
      }).then(response => {
        this.customer = response.data
        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    },

    loadOrders () {
      freshcom.listOrder({
        filter: { customerId: this.id }
      }).then(response => {
        this.orders = response.data
      })
    },

    loadUnlocks () {
      freshcom.listUnlock({
        filter: { customerId: this.id },
        include: 'unlockable'
      }).then(response => {
        this.unlocks = response.data
      })
    },

    loadCards () {
      return freshcom.listCard({
        filter: { ownerId: this.id, ownerType: 'Customer' }
      }).then(response => {
        this.cards = response.data
      })
    },

    editCustomer () {
      this.$store.dispatch('pushRoute', { name: 'EditCustomer', params: { id: this.customer.id } })
    },

    deleteCustomer () {
      freshcom.deleteCustomer(this.id).then(() => {
        this.$message({
          showClose: true,
          message: `Customer deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    openEditCardDialog (card) {
      let cardDraft = _.cloneDeep(card)

      this.cardDraftForEdit = cardDraft
      this.errors = {}
      this.isEditingCard = true
    },

    closeEditCardDialog () {
      this.isEditingCard = false
      this.isUpdatingCard = false
    },

    updateCard () {
      this.isUpdatingCard = true

      freshcom.updateCard(this.cardDraftForEdit.id, this.cardDraftForEdit).then(() => {
        return this.loadCards()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Card updated successfully.`,
          type: 'success'
        })

        this.closeEditCardDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingCard = false
        throw response
      })
    },

    deleteCard (card) {
      freshcom.deleteCard(card.id).then(() => {
        return this.loadCards()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Card deleted successfully.`,
          type: 'success'
        })
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListCustomer' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
