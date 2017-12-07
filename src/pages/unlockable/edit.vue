<template>
<div class="main-col">
  <div>
    <el-menu :router="true" default-active="unlockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListUnlockable' }" index="unlockables">Unlockables</el-menu-item>
    </el-menu>
    <locale-selector @change="loadUnlockable()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit unlockable</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <unlockable-form v-model="unlockableDraft" :errors="errors"></unlockable-form>
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

import Unlockable from '@/models/unlockable'
import UnlockableForm from '@/components/unlockable-form'

export default {
  name: 'EditUnlockable',
  components: {
    UnlockableForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      unlockable: Unlockable.objectWithDefaults(),
      unlockableDraft: Unlockable.objectWithDefaults(),

      isUpdatingUnlockable: false,
      errors: {}
    }
  },
  created () {
    this.loadUnlockable()
  },
  methods: {
    loadUnlockable () {
      this.isLoading = true

      freshcom.retrieveUnlockable(this.id, {
        include: 'avatar,externalFileCollections'
      }).then(response => {
        this.unlockable = response.data
        this.unlockableDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingUnlockable = true

      freshcom.updateUnlockable(
        this.unlockableDraft.id,
        this.unlockableDraft
      ).then(unlockable => {
        this.$message({
          showClose: true,
          message: `Unlockable saved successfully.`,
          type: 'success'
        })

        this.isUpdatingUnlockable = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingUnlockable = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowUnlockable', params: { id: this.unlockable.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
