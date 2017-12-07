<template>
<div class="main-col">
  <div>
    <el-menu :router="true" default-active="/unlockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">Unlockables</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create an unlockable</span>

        <div class="pull-right">
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
import freshcom from '@/freshcom-sdk'

import Unlockable from '@/models/unlockable'
import UnlockableForm from '@/components/unlockable-form'

export default {
  name: 'NewUnlockable',
  components: {
    UnlockableForm
  },
  data () {
    return {
      unlockableDraft: Unlockable.objectWithDefaults(),
      isCreatingUnlockable: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingUnlockable = true

      freshcom.createUnlockable(this.unlockableDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Unlockable created successfully.`,
          type: 'success'
        })

        this.isCreatingUnlockable = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingUnlockable = false
        throw response
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListUnlockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
