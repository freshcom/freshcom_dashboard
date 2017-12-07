<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/payments" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">Payments</el-menu-item>
    </el-menu>
    <locale-selector @change="loadPayment" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief no-avatar">
          <div class="detail">
            <p>Payment {{payment.code}}</p>
            <h2>{{payment.amountCents | dollar}}</h2>
            <p class="id">{{payment.id}}</p>
          </div>
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
              <dd>{{payment.id}}</dd>

              <dt v-if="payment.code">Code</dt>
              <dd v-if="payment.code">{{payment.code}}</dd>

              <dt>Status</dt>
              <dd>
                {{$t(`fields.payment.status.${payment.status}`)}}
              </dd>

              <dt v-if="payment.gateway">Gateway</dt>
              <dd v-if="payment.gateway">
                {{$t(`fields.payment.gateway.${payment.gateway}`)}}
              </dd>

              <dt v-if="payment.method">Method</dt>
              <dd v-if="payment.method">{{payment.method}}</dd>

              <dt v-if="payment.amountCents">Amount</dt>
              <dd v-if="payment.amountCents">
                {{payment.amountCents | dollar}}
              </dd>

              <dt v-if="payment.refundedAmountCents">Refunded Amount</dt>
              <dd v-if="payment.refundedAmountCents">
                {{payment.refundedAmountCents | dollar}}
              </dd>

              <dt v-if="payment.transactionFeeCents">Transaction Fee</dt>
              <dd v-if="payment.transactionFeeCents">
                {{payment.transactionFeeCents - payment.refundedTransactionFeeCents | dollar}}
              </dd>

              <dt v-if="payment.netAmountCents">Net Amount</dt>
              <dd v-if="payment.netAmountCents">
                {{payment.netAmountCents | dollar}}
              </dd>
            </dl>
          </div>
        </div>

        <div class="block-title">
          <h3>Refunds</h3>

          <span v-if="canRefund" class="block-title-actions pull-right">
            <a @click="openAddRefundDialog()" href="javascript:;">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </a>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="payment.refunds" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="300">
                <template slot-scope="scope">
                  <b>{{scope.row.amountCents | dollar}}</b>
                  <el-tag v-if="scope.row.gateway !== payment.gateway" size="mini" type="info" class="m-l-10">
                    {{$t(`fields.refund.gateway.${scope.row.gateway}`)}}
                  </el-tag>
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
        </div>

        <div class="block-title">
          <h3>Custom Data</h3>
        </div>
        <div class="block">
          <div class="block-body">
            {{payment.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt>Target</dt>
              <dd>
                <router-link :to="{ name: `Show${payment.targetType}`, params: { id: payment.targetId }}">
                  {{payment.targetId}}
                </router-link>
              </dd>

              <dt>Owner</dt>
              <dd>
                <router-link :to="{ name: `Show${payment.ownerType}`, params: { id: payment.ownerId }}">
                  {{payment.ownerId}}
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

      <div v-if="canDelete" class="footer text-right">
        <delete-button @confirmed="deletePayment" size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isAddingRefund" title="Refund Payment" width="500px">
      <refund-form v-model="refundDraftForAdd" :errors="errors"></refund-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingRefund" @click="closeAddRefundDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingRefund" @click="createRefund()" type="primary" size="small">Refund {{refundDraftForAdd.amountCents | dollar}}</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/plus'
import freshcom from '@/freshcom-sdk'

import Payment from '@/models/payment'
import Refund from '@/models/refund'
import RefundForm from '@/components/refund-form'
import DeleteButton from '@/components/delete-button'
import { chargeDollar, dollar } from '@/helpers/filters'

export default {
  name: 'ShowPayment',
  props: ['id'],
  components: {
    DeleteButton,
    RefundForm
  },
  filters: {
    chargeDollar,
    dollar
  },
  data () {
    return {
      payment: Payment.objectWithDefaults(),
      isLoading: false,

      refundDraftForAdd: Refund.objectWithDefaults(),
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

      freshcom.retrievePayment(this.id, {
        include: 'refunds'
      }).then(response => {
        this.payment = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    openAddRefundDialog () {
      let refundDraft = Refund.objectWithDefaults()

      refundDraft.payment = this.payment
      refundDraft.gateway = this.payment.gateway
      refundDraft.processor = this.payment.processor
      refundDraft.amountCents = this.payment.grossAmountCents
      refundDraft.owner = this.payment.owner
      refundDraft.target = this.payment.target

      this.refundDraftForAdd = refundDraft
      this.errors = {}
      this.isAddingRefund = true
    },

    closeAddRefundDialog () {
      this.isAddingRefund = false
      this.isCreatingRefund = false
    },

    createRefund () {
      this.isCreatingRefund = true

      freshcom.createRefund(this.payment.id, this.refundDraftForAdd).then(() => {
        return this.loadPayment({ shouldShowLoading: false })
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Refund created successfully.`,
          type: 'success'
        })

        this.closeAddRefundDialog()
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
