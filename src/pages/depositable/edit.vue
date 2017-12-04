<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/depositables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">Depositables</el-menu-item>
    </el-menu>
    <locale-selector @change="loadDepositable()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit depositable</span>

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
        <depositable-form v-model="depositableDraft" :errors="errors"></depositable-form>
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
import freshcom from '@/freshcom-sdk'
import Depositable from '@/models/depositable'
import DepositableForm from '@/components/depositable-form'

export default {
  name: 'EditDepositable',
  components: {
    DepositableForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      depositable: Depositable.objectWithDefaults(),
      depositableDraft: Depositable.objectWithDefaults(),

      isUpdatingDepositable: false,
      errors: {}
    }
  },
  created () {
    this.loadDepositable()
  },
  methods: {
    loadDepositable () {
      this.isLoading = true

      freshcom.retrieveDepositable(this.id, {
        include: 'avatar,externalFileCollections'
      }).then(response => {
        this.depositable = response.data
        this.depositableDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingDepositable = true

      freshcom.updateDepositable(
        this.depositableDraft.id,
        this.depositableDraft
      ).then(depositable => {
        this.$message({
          showClose: true,
          message: `Depositable saved successfully.`,
          type: 'success'
        })

        this.isUpdatingDepositable = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isUpdatingDepositable = false
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowDepositable', params: { id: this.depositable.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
