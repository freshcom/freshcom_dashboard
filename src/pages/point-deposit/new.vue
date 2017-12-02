<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/point_deposits" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListPointDeposit' }" index="/point_deposits">Point Deposits</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a point deposit</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit(pointDepositDraft)" type="primary" size="small">
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

        <el-button @click="submit(pointDepositDraft)" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import PointDeposit from '@/models/point-deposit'
import PointDepositForm from '@/components/point-deposit-form'

export default {
  name: 'NewPointDeposit',
  components: {
    PointDepositForm
  },
  data () {
    return {
      pointDepositDraft: PointDeposit.objectWithDefaults(),
      isCreatingPointDeposit: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingPointDeposit = true

      this.$store.dispatch('pointDeposit/createPointDeposit', this.pointDepositDraft).then(pointDeposit => {
        this.$message({
          showClose: true,
          message: `Point deposit created successfully.`,
          type: 'success'
        })

        this.isCreatingPointDeposit = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isCreatingPointDeposit = false
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListPointDeposit' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
