<template>
<content-container>
  <div slot="header">
    <el-menu :router="true" default-active="/depositables" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">
        Depositables
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Create an depositable</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <depositable-fieldset v-model="depositableDraft" :errors="errors"></depositable-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>

<!-- <div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/depositables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">Depositables</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

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

</div> -->
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Depositable from '@/models/depositable'
import DepositableFieldset from '@/components/depositable-fieldset'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewDepositable',
  mixins: [PageMixin],
  components: {
    DepositableFieldset
  },
  data () {
    return {
      depositableDraft: Depositable.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createDepositable(this.depositableDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Depositable created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListDepositable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
