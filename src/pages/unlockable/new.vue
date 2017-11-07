<template>
<div class="main-col">
  <div>
    <el-menu :router="true" default-active="/unlockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">Unlockables</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create an Unlockable</span>

        <div class="pull-right">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button @click="submit(recordDraft)" type="primary" size="medium">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <unlockable-form v-model="recordDraft" :errors="errors"></unlockable-form>
      </div>

      <div class="footer">
        <el-button @click="cancel" plain size="medium">
          Cancel
        </el-button>

        <el-button @click="submit(recordDraft)" type="primary" size="medium" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import NewPage from '@/mixins/new-page'
import UnlockableForm from '@/components/unlockable-form'

export default {
  name: 'NewUnlockable',
  components: {
    UnlockableForm
  },
  mixins: [NewPage({ storeNamespace: 'unlockable', name: 'Unlockable' })],
  methods: {
    recordCreated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowUnlockable', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
