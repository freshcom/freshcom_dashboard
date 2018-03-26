<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListCustomer' }">Customers</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <icon name="user" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Customer</span>
          <span>{{customer.code}}</span>
        </p>
        <h1>{{customer.name}}</h1>
        <p class="id">{{customer.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditCustomer', params: { id: this.customer.id } }" class="el-button el-button--small is-plain">
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
            <dd>{{customer.id}}</dd>

            <template v-if="customer.code">
              <dt>Code</dt>
              <dd>{{customer.code}}</dd>
            </template>

            <dt>Status</dt>
            <dd>{{$t(`fields.customer.status.${customer.status}`)}}</dd>

            <dt>Name</dt>
            <dd>{{customer.name}}</dd>

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

      <div class="block">
        <div class="header">
          <h2>Orders</h2>

          <div class="action-group">
            <router-link :to="{ name: 'NewOrder', query: { customer: { id: this.customer.id, name: this.customer.name }, callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
              Add
            </router-link>
          </div>
        </div>

        <div class="body full">
          <el-table :data="orders" class="data-table block-table" :show-header="false">
            <el-table-column width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="primary">
                  <span v-if="scope.row.code">[{{scope.row.code}}]</span>
                  <span>{{scope.row.grandTotalCents | dollar}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }">
                  <el-tag v-if="scope.row.status === 'opened'" size="mini" class="m-l-10">
                    {{$t(`fields.order.status.${scope.row.status}`)}}
                  </el-tag>
                  <el-tag v-else size="mini" type="info" class="m-l-10">
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

            <el-table-column align="right">
              <template slot-scope="scope">
                {{scope.row.openedAt | moment}}
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <router-link :to="{ name: 'EditOrder', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                      Edit
                    </router-link>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="orders.length >= 5" class="foot text-center">
            <router-link :to="{ name: 'ListOrder', query: { filter: { customerId: customer.id } } }" class="view-more">View More</router-link>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Cards</h2>
        </div>

        <div class="body full">
          <el-table :data="cards" class="data-table block-table" :show-header="false">
            <el-table-column width="120">
              <template slot-scope="scope">
                <a href="javascript:;" class="primary with-icon">
                  <span>
                    **** {{scope.row.lastFourDigit}}
                  </span>

                  <span v-if="scope.row.brand === 'Visa'" class="m-l-10 icon-wrapper">
                    <icon name="cc-visa" scale="1.5"></icon>
                  </span>
                  <span v-if="scope.row.brand === 'MasterCard'" class="m-l-10 icon-wrapper">
                    <icon name="cc-mastercard" scale="1.5"></icon>
                  </span>
                </a>
              </template>
            </el-table-column>

            <el-table-column width="100">
              <template slot-scope="scope">
                {{scope.row.expMonth}} / {{scope.row.expYear}}
              </template>
            </el-table-column>

            <el-table-column width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.primary" size="mini">
                  Primary
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column width="120">
              <template slot-scope="scope">
                {{scope.row.id | idLastPart}}
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot-scope="scope">
                {{scope.row.insertedAt | moment}}
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <el-button @click="editCard(scope.row)" plain size="mini">
                      Edit
                    </el-button>
                    <el-button @click="attemptDeleteCard(scope.row)" plain size="mini">
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="launchable">
          <el-dialog :show-close="false" :visible="isEditingCard" title="Edit card" width="600px">
            <el-form @submit.native.prevent="updateCard()" label-width="150px" size="small">
              <card-fieldset v-model="cardForEdit" :errors="errors"></card-fieldset>
            </el-form>

            <div slot="footer">
              <el-button :disabled="isUpdatingCard" @click="cancelEditCard()" plain size="small">Cancel</el-button>
              <el-button :loading="isUpdatingCard" @click="updateCard()" type="primary" size="small">Save</el-button>
            </div>
          </el-dialog>

          <el-dialog :show-close="false" :visible="isConfirmingDeleteCard" title="Delete card" width="500px">
            <p>
              Are you sure you want to delete this card?
              <br/></br>
              <b>This action cannot be undone.</b>
            </p>

            <div slot="footer">
              <el-button :disabled="isDeletingCard" @click="cancelDeleteCard()" plain size="small">Cancel</el-button>
              <el-button :loading="isDeletingCard" @click="deleteCard()" type="danger" size="small">Delete</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Unlocks</h2>

          <div class="action-group">
            <el-button @click="addUnlock()" class="el-button el-button--mini is-plain">
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="unlocks" class="data-table block-table" :show-header="false">
            <el-table-column width="200">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.unlockable.id }, query: { callbackPath: currentRoutePath } }" class="primary">
                  <span v-if="scope.row.unlockable.code">[{{scope.row.unlockable.code}}]</span>
                  <span>{{scope.row.unlockable.name}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot-scope="scope">
                {{scope.row.insertedAt | moment}}
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <confirm-button @confirmed="deleteUnlock(scope.row.id)" plain size="mini">
                      Delete
                    </confirm-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="unlocks.length >= 5" class="foot text-center">
            <router-link :to="{ name: 'ListUnlockable', query: { filter: { unlockedBy: customer.id } } }" class="view-more">View More</router-link>
          </div>
        </div>

        <div class="launchable">
          <el-dialog :show-close="false" :visible="isAddingUnlock" title="Add unlock" width="600px">
            <el-form @submit.native.prevent="createUnlock()" label-width="150px" size="small">
              <unlock-fieldset v-model="unlockForAdd" :errors="errors"></unlock-fieldset>
            </el-form>

            <div slot="footer">
              <el-button :disabled="isCreatingUnlock" @click="cancelAddUnlock()" plain size="small">Cancel</el-button>
              <el-button :loading="isCreatingUnlock" @click="createUnlock()" type="primary" size="small">Save</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Point Transactions</h2>

          <div class="action-group">
            <el-button @click="addPointTransaction()" class="el-button el-button--mini is-plain">
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="pointTransactions" class="data-table block-table" :show-header="false">
            <el-table-column width="120">
              <template slot-scope="scope">
                <a href="javascript:;" class="primary">
                  <span v-if="scope.row.amount >= 0">+</span>
                  <span>{{scope.row.amount}}</span>
                </a>
              </template>
            </el-table-column>

            <el-table-column align="right" width="120">
              <template slot-scope="scope">
                <span>=</span>
                <span>{{scope.row.balanceAfterCommit}}</span>
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot-scope="scope">
                {{scope.row.insertedAt | moment}}
              </template>
            </el-table-column>

            <el-table-column width="130">
              <template slot-scope="scope">
                <p v-if="scope.row.amount === 0" class="action-group">
                  <el-button-group>
                    <el-button @click="deletePointTransaction(scope.row.id)" plain size="mini">
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="pointTransactions.length >= 5" class="foot text-center">
            <router-link :to="{ name: 'ListPointTransaction', query: { filter: { accountId: customer.pointAccount.id } } }" class="view-more">View More</router-link>
          </div>
        </div>

        <div class="launchable">
          <el-dialog :show-close="false" :visible="isAddingPointTransaction" title="Add point transaction" width="600px">
            <el-form @submit.native.prevent="createPointTransaction()" label-width="150px" size="small">
              {{pointTransactionForAdd.amount}}
              <point-transaction-fieldset v-model="pointTransactionForAdd" :errors="errors"></point-transaction-fieldset>
            </el-form>

            <div slot="footer">
              <el-button :disabled="isCreatingPointTransaction" @click="cancelAddPointTransaction()" plain size="small">Cancel</el-button>
              <el-button :loading="isCreatingPointTransaction" @click="createPointTransaction()" type="primary" size="small">Save</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>File Collections</h2>

          <div class="action-group">
            <router-link :to="{ name: 'NewFileCollection', query: { owner: { id: this.customer.id, type: 'Customer', name: this.customer.name }, callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
              Add
            </router-link>
          </div>
        </div>

        <div class="body full">
          <el-table :data="fileCollections" class="data-table block-table" :show-header="false">
            <el-table-column width="300">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="primary">
                  <span>{{scope.row.name}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }">
                  <span>{{scope.row.fileCount}} files</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot-scope="scope">
                {{scope.row.insertedAt | moment}}
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <router-link :to="{ name: 'EditFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                      Edit
                    </router-link>
                    <el-button @click="attemptDeleteFileCollection(scope.row)" plain size="mini">
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="fileCollections.length >= 5" class="foot text-center">
            <router-link :to="{ name: 'ListFileCollection', query: { filter: { ownerType: 'Customer', ownerId: customer.id } } }" class="view-more">View More</router-link>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{customer.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resource</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="customer.enroller">Enroller</dt>
            <dd v-if="customer.enroller">
              <router-link :to="{ name: 'ShowCustomer', params: { id: customer.enroller.id } }">
                {{customer.enroller.id}}
              </router-link>
            </dd>

            <dt v-if="customer.sponsor">Sponsor</dt>
            <dd v-if="customer.sponsor">
              <router-link :to="{ name: 'ShowCustomer', params: { id: customer.sponsor.id } }">
                {{customer.sponsor.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteCustomer()" plain size="small">
        Delete
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import 'vue-awesome/icons/cc-visa'
import 'vue-awesome/icons/cc-mastercard'

import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import ConfirmButton from '@/components/confirm-button'
import Customer from '@/models/customer'
import PointTransaction from '@/models/point-transaction'
import CardFieldset from '@/components/card-fieldset'
import UnlockFieldset from '@/components/unlock-fieldset'
import PointTransactionFieldset from '@/components/point-transaction-fieldset'
import { dollar, idLastPart } from '@/helpers/filters'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadResources' })

export default {
  name: 'ShowCustomer',
  mixins: [ResourcePageMixin],
  components: {
    ConfirmButton,
    CardFieldset,
    UnlockFieldset,
    PointTransactionFieldset
  },
  filters: {
    idLastPart,
    dollar
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isReady: false,

      isLoading: false,
      customer: Customer.objectWithDefaults(),

      isLoadingCards: false,
      cards: [],
      cardForEdit: {},
      isEditingCard: false,
      isUpdatingCard: false,

      cardForDelete: {},
      isConfirmingDeleteCard: false,
      isDeletingCard: false,

      isLoadingOrders: false,
      orders: [],

      isLoadingUnlocks: false,
      unlocks: [],

      isAddingUnlock: false,
      isCreatingUnlock: false,
      unlockForAdd: {},

      isLoadingPointTransaction: false,
      pointTransactions: [],

      isAddingPointTransaction: false,
      isCreatingPointTransaction: false,
      pointTransactionForAdd: PointTransaction.objectWithDefaults(),

      errors: {}
    }
  },
  computed: {
    fileCollections () {
      if (!this.customer.fileCollections) { return [] }

      return this.customer.fileCollections
    }
  },
  methods: {
    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListCustomer' })
    },

    loadResources () {
      return Promise.all([
        this.loadCustomer().then(() => {
          return this.loadPointTransactions()
        }),
        this.loadOrders(),
        this.loadUnlocks(),
        this.loadCards()
      ])
    },

    //
    // MARK: Customer
    //
    loadCustomer () {
      return freshcom.retrieveCustomer(this.id, {
        include: 'point_account,fileCollections'
      }).then(response => {
        this.customer = response.data
      })
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

    //
    // MARK: Order
    //
    loadOrders () {
      freshcom.listOrder({
        filter: { customerId: this.id },
        page: { size: 5, number: 1 }
      }).then(response => {
        this.orders = response.data
      })
    },

    //
    // MARK: Card
    //
    loadCards () {
      return freshcom.listCard({
        filter: { ownerId: this.id, ownerType: 'Customer' }
      }).then(response => {
        this.cards = response.data
      })
    },

    editCard (card) {
      this.cardForEdit = _.cloneDeep(card)
      this.errors = {}
      this.isEditingCard = true
    },

    cancelEditCard () {
      this.isEditingCard = false
    },

    updateCard () {
      this.isUpdatingCard = true

      freshcom.updateCard(this.cardForEdit.id, this.cardForEdit).then(() => {
        return this.loadCards()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Card updated successfully.`,
          type: 'success'
        })

        this.isUpdatingCard = false
        this.cancelEditCard()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingCard = false
        throw response
      })
    },

    attemptDeleteCard (card) {
      this.cardForDelete = card
      this.isConfirmingDeleteCard = true
    },

    cancelDeleteCard () {
      this.isConfirmingDeleteCard = false
    },

    deleteCard () {
      this.isDeletingCard = true
      freshcom.deleteCard(this.cardForDelete.id).then(() => {
        return this.loadCards()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Card deleted successfully.`,
          type: 'success'
        })

        this.isDeletingCard = false
        this.cancelDeleteCard()
      }).catch(() => {
        this.isDeletingCard = false
      })
    },

    //
    // MARK: Unlock
    //
    loadUnlocks () {
      freshcom.listUnlock({
        filter: { customerId: this.id },
        include: 'unlockable',
        page: { size: 10 }
      }).then(response => {
        this.unlocks = response.data
      })
    },

    addUnlock () {
      this.unlockForAdd = {
        type: 'Unlock',
        sortIndex: 0,
        customer: this.customer
      }
      this.errors = {}
      this.isAddingUnlock = true
    },

    cancelAddUnlock () {
      this.isAddingUnlock = false
    },

    createUnlock () {
      this.isCreatingUnlock = true

      return freshcom.createUnlock(this.unlockForAdd).then(() => {
        return this.loadUnlocks()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Unlock created successfully.`,
          type: 'success'
        })

        this.isCreatingUnlock = false
        this.cancelAddUnlock()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingUnlock = false
        throw response
      })
    },

    deleteUnlock (id) {
      return freshcom.deleteUnlock(id).then(() => {
        return this.loadUnlocks()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Unlock deleted successfully.`,
          type: 'success'
        })
      })
    },

    //
    // MARK: Point Transaction
    //
    loadPointTransactions () {
      freshcom.listPointTransaction(this.customer.pointAccount.id).then(response => {
        this.pointTransactions = response.data
      })
    },

    addPointTransaction () {
      this.pointTransactionForAdd = PointTransaction.objectWithDefaults()
      this.errors = {}
      this.isAddingPointTransaction = true
    },

    cancelAddPointTransaction () {
      this.isAddingPointTransaction = false
    },

    createPointTransaction () {
      this.isCreatingPointTransaction = true
      return freshcom.createPointTransaction(this.customer.pointAccount.id, this.pointTransactionForAdd).then(() => {
        return Promise.all([this.loadPointTransactions(), this.loadCustomer()])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Point transaction created successfully.`,
          type: 'success'
        })

        this.isCreatingPointTransaction = false
        this.cancelAddPointTransaction()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingPointTransaction = false
        throw response
      })
    },

    deletePointTransaction (id) {
      return freshcom.deletePointTransaction(id).then(() => {
        return this.loadPointTransactions()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Point transaction deleted successfully.`,
          type: 'success'
        })
      })
    },

    attemptDeleteCustomer () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
