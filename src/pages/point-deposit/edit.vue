<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/point_deposits" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListPointDeposit' }" index="/point_deposits">Point Deposits</el-menu-item>
    </el-menu>
    <locale-selector @change="loadPointDeposit()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit point deposit</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" size="small" type="primary">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <point-deposit-form v-model="pointDepositDraft" :errors="errors"></point-deposit-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import PointDeposit from '@/models/point-deposit'
import PointDepositForm from '@/components/point-deposit-form'

export default {
  name: 'EditPointDeposit',
  components: {
    PointDepositForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      pointDeposit: PointDeposit.objectWithDefaults(),
      pointDepositDraft: PointDeposit.objectWithDefaults(),

      isUpdatingPointDeposit: false,
      errors: {}
    }
  },
  created () {
    this.loadPointDeposit()
  },
  methods: {
    loadPointDeposit () {
      this.isLoading = true

      this.$store.dispatch('pointDeposit/getPointDeposit', {
        id: this.id
      }).then(pointDeposit => {
        this.pointDeposit = pointDeposit
        this.pointDepositDraft = _.cloneDeep(pointDeposit)

        this.isLoading = false
      }).catch(errors => {
        this.errors = errors
        this.isLoading = false

        throw errors
      })
    },

    submit () {
      this.isUpdatingPointDeposit = true

      this.$store.dispatch('pointDeposit/updatePointDeposit', {
        id: this.pointDepositDraft.id,
        pointDepositDraft: this.pointDepositDraft
      }).then(pointDeposit => {
        this.$message({
          showClose: true,
          message: `Point deposit saved successfully.`,
          type: 'success'
        })

        this.isUpdatingPointDeposit = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isUpdatingPointDeposit = false
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowPointDeposit', params: { id: this.pointDeposit.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
