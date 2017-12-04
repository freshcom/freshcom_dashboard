<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/depositables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">Depositables</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a depositable</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit(depositableDraft)" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <depositable-form v-model="depositableDraft" :errors="errors"></depositable-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit(depositableDraft)" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Depositable from '@/models/depositable'
import DepositableForm from '@/components/depositable-form'

export default {
  name: 'NewDepositable',
  components: {
    DepositableForm
  },
  data () {
    return {
      depositableDraft: Depositable.objectWithDefaults(),
      isCreatingDepositable: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingDepositable = true

      freshcom.createDepositable(this.depositableDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Depositable created successfully.`,
          type: 'success'
        })

        this.isCreatingDepositable = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isCreatingDepositable = false
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListDepositable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
