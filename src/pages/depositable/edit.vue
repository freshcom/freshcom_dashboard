<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListDepositable' }">Depositables</router-link>
  </div>

  <div slot="card-header">
    <h1>Edit depositable</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
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

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Depositable from '@/models/depositable'
import DepositableFieldset from '@/components/depositable-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadDepositable' })

export default {
  name: 'EditDepositable',
  mixins: [ResourcePageMixin],
  components: {
    DepositableFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      depositable: Depositable.objectWithDefaults(),
      depositableDraft: Depositable.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  methods: {
    loadDepositable () {
      this.isLoading = true

      return freshcom.retrieveDepositable(this.id, {
        include: 'avatar,fileCollections'
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
      this.isUpdating = true

      freshcom.updateDepositable(
        this.depositableDraft.id,
        this.depositableDraft
      ).then(depositable => {
        this.$message({
          showClose: true,
          message: `Depositable saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.data
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowDepositable', params: { id: this.depositable.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
