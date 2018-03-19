<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListUnlockable' }">Unlockables</router-link>
  </div>

  <div slot="card-header">
    <h1>Edit unlockable</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <unlockable-fieldset v-model="unlockableDraft" :errors="errors"></unlockable-fieldset>
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

import Unlockable from '@/models/unlockable'
import UnlockableFieldset from '@/components/unlockable-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadUnlockable' })

export default {
  name: 'EditUnlockable',
  mixins: [ResourcePageMixin],
  components: {
    UnlockableFieldset
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
      unlockable: Unlockable.objectWithDefaults(),
      unlockableDraft: Unlockable.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  methods: {
    loadUnlockable () {
      this.isLoading = true

      return freshcom.retrieveUnlockable(this.id, {
        include: 'avatar'
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
      this.isUpdating = true

      freshcom.updateUnlockable(
        this.unlockableDraft.id,
        this.unlockableDraft
      ).then(unlockable => {
        this.$message({
          showClose: true,
          message: `Unlockable saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowUnlockable', params: { id: this.unlockable.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
