<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="unlockables" mode="horizontal">
        <el-menu-item :route="{ name: 'ListUnlockable' }" index="unlockables">Unlockables</el-menu-item>
      </el-menu>
      <locale-selector :before-change="confirmResourceLocaleChange" @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Edit Unlockable</span>

            <div style="float: right;">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="submit(recordDraft)" type="primary">
                Save
              </el-button>
            </div>
          </div>

          <div class="data">
            <unlockable-form v-model="recordDraft" :errors="errors"></unlockable-form>
          </div>

          <div class="footer">
            <el-button @click="cancel">
              Cancel
            </el-button>

            <el-button @click="submit(recordDraft)" type="primary" class="pull-right">
              Save
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import UnlockableForm from '@/components/unlockable-form'
import EditPage from '@/mixins/edit-page'

export default {
  name: 'EditUnlockable',
  components: {
    UnlockableForm
  },
  mixins: [EditPage({ storeNamespace: 'unlockable', name: 'Unlockable', include: 'avatar,externalFileCollections' })],
  methods: {
    recordUpdated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowUnlockable', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
