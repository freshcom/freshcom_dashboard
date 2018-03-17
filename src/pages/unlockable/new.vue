<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListUnlockable' }">Unlockables</router-link>
  </div>

  <div slot="card-header">
    <h1>Create an unlockable</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-form @submit.native.prevent="submit()" label-width="150px" size="small">
        <unlockable-fieldset v-model="unlockableDraft" :errors="errors"></unlockable-fieldset>
      </el-form>
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
</template>

<script>
import freshcom from '@/freshcom-sdk'

import UnlockableFieldset from '@/components/unlockable-fieldset'
import Unlockable from '@/models/unlockable'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewUnlockable',
  mixins: [PageMixin],
  components: {
    UnlockableFieldset
  },
  data () {
    return {
      unlockableDraft: Unlockable.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true
      freshcom.createUnlockable(this.unlockableDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Unlockable created successfully.`,
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
      this.$store.dispatch('pushRoute', { name: 'ListUnlockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
