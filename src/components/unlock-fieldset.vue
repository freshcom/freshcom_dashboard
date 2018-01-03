<template>
  <div>
    <el-form-item label="Unlockable" :error="errorMsgs.unlockable" required>
      <remote-select
        :value="formModel.unlockable"
        :search-method="searchUnlockable"
        @change="handleUnlockableChange($event)"
        placeholder="Type to start searching..."
        class="unlockable-select"
      >
      </remote-select>
    </el-form-item>

    <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
      <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
    </el-form-item>
  </div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'UnlockFieldset',
  props: ['value', 'errors'],
  components: {
    RemoteSelect
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'unlock')
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),

    handleUnlockableChange (unlockable) {
      if (unlockable) {
        this.formModel.unlockable = unlockable
      } else {
        this.formModel.unlockable = null
      }

      this.$emit('input', this.formModel)
    },

    searchUnlockable (keyword) {
      return freshcom.listUnlockable({
        search: keyword
      }).then(response => {
        return response.data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.unlockable-select {
  width: 100%;
}
</style>
