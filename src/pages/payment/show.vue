<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/payments" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">
        Payments
      </el-menu-item>
      <el-menu-item :route="{ name: 'ShowBalanceSettings' }" index="/settings">
        Settings
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <div class="brief">
      <div class="avatar">
        <icon name="money" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Payment</span>
          <span>{{payment.code}}</span>
        </p>
        <h1>{{payment.amountCents | dollar}}</h1>
        <p class="id">{{payment.id}}</p>
      </div>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{payment.id}}</dd>

            <template v-if="payment.code">
              <dt>Code</dt>
              <dd>{{payment.code}}</dd>
            </template>

            <dt>Status</dt>
            <dd>
              {{$t(`fields.payment.status.${payment.status}`)}}
            </dd>

            <dt>Gateway</dt>
            <dd>
              {{$t(`fields.payment.gateway.${payment.gateway}`)}}
            </dd>

            <template v-if="payment.method">
              <dt>Method</dt>
              <dd>{{payment.method}}</dd>
            </template>

            <dt>Amount</dt>
            <dd>
              {{payment.amountCents | dollar}}
            </dd>

            <template v-if="payment.refundedAmountCents">
              <dt>Refunded Amount</dt>
              <dd>
                {{payment.refundedAmountCents | dollar}}
              </dd>
            </template>

            <template v-if="payment.transactionFeeCents">
              <dt>Transaction Fee</dt>
              <dd>
                {{payment.transactionFeeCents - payment.refundedTransactionFeeCents | dollar}}
              </dd>
            </template>

            <dt>Net Amount</dt>
            <dd>
              {{payment.netAmountCents | dollar}}
            </dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Refunds</h2>

          <div v-if="canRefund" class="action-group">
            <el-button @click="addRefund()" class="el-button el-button--mini is-plain">
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="payment.refunds" class="data-table block-table" :show-header="false">
            <el-table-column width="300">
              <template slot-scope="scope">
                <a href="javascript:;" class="primary">
                  <b>{{scope.row.amountCents | dollar}}</b>

                  <el-tag v-if="scope.row.gateway !== payment.gateway" size="mini" type="info" class="m-l-10">
                    {{$t(`fields.refund.gateway.${scope.row.gateway}`)}}
                  </el-tag>
                </a>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <p class="text-right">
                  {{scope.row.insertedAt | moment}}
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="launchable">
          <el-dialog :show-close="false" :visible="isAddingRefund" title="Add refund" width="500px">
            <el-form @submit.native.prevent="createRefund()" label-position="top" size="small">
              <refund-fieldset v-model="refundForAdd" :errors="errors"></refund-fieldset>
            </el-form>

            <div slot="footer">
              <el-button :disabled="isCreatingRefund" @click="cancelAddRefund()" plain size="small">Cancel</el-button>
              <el-button :loading="isCreatingRefund" @click="createRefund()" type="primary" size="small">Save</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{payment.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resource</h2>
        </div>
        <div class="body">
          <dl>
            <template v-if="payment.owner">
              <dt>Owner</dt>
              <dd>
                <router-link :to="{ name: 'ShowCustomer', params: { id: payment.owner.id } }">
                  {{payment.owner.id}}
                </router-link>
              </dd>
            </template>

            <template v-if="payment.target">
              <dt>Target</dt>
              <dd>
                <router-link :to="{ name: 'ShowOrder', params: { id: payment.target.id } }">
                  {{payment.target.id}}
                </router-link>
              </dd>
            </template>
          </dl>
        </div>
      </div>
    </div>

    <div v-if="canDelete" class="foot text-right">
      <el-button @click="attemptDeletePayment()" plain size="small">
        Delete
      </el-button>
    </div>
  </div>

</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Payment from '@/models/payment'
import Refund from '@/models/refund'
import RefundFieldset from '@/components/refund-fieldset'
import { dollar } from '@/helpers/filters'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadPayment' })

export default {
  name: 'ShowPayment',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    RefundFieldset
  },
  filters: {
    dollar
  },
  data () {
    return {
      payment: Payment.objectWithDefaults(),
      isLoading: false,

      refundForAdd: Refund.objectWithDefaults(),
      isAddingRefund: false,
      isCreatingRefund: false,

      errors: {}
    }
  },
  created () {
    this.loadPayment()
  },
  computed: {
    canDelete () {
      return this.payment.status === 'pending'
    },
    canRefund () {
      return this.payment.status === 'paid' || this.payment.status === 'partially_refunded'
    }
  },
  methods: {
    loadPayment (options = { shouldShowLoading: true }) {
      if (options.shouldShowLoading) {
        this.isLoading = true
      }

      return freshcom.retrievePayment(this.id, {
        include: 'refunds'
      }).then(response => {
        this.payment = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    addRefund () {
      let refundDraft = Refund.objectWithDefaults()

      refundDraft.payment = this.payment
      refundDraft.gateway = this.payment.gateway
      refundDraft.processor = this.payment.processor
      refundDraft.amountCents = this.payment.grossAmountCents
      refundDraft.owner = this.payment.owner
      refundDraft.target = this.payment.target

      this.refundForAdd = refundDraft
      this.errors = {}
      this.isAddingRefund = true
    },

    cancelAddRefund () {
      this.isAddingRefund = false
    },

    createRefund () {
      this.isCreatingRefund = true

      freshcom.createRefund(this.refundForAdd).then(() => {
        return this.loadPayment({ shouldShowLoading: false })
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Refund created successfully.`,
          type: 'success'
        })

        this.isCreatingRefund = false
        this.cancelAddRefund()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingRefund = false
        throw response
      })
    },

    deletePayment () {
      let orderId = this.payment.target.id
      freshcom.deletePayment(this.payment.id).then(() => {
        this.$message({
          showClose: true,
          message: `Payment deleted successfully.`,
          type: 'success'
        })

        this.$store.dispatch('pushRoute', { name: 'ShowOrder', params: { id: orderId } })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
