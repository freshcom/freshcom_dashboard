<template>
<el-dialog :show-close="false" :visible="value" title="Delete file collection" width="500px">
  <p>
    Are you sure you want to delete this file collection?
    All files inside the collection will also be deleted.
    If you want to keep certain files, remove them from this collection
    before deletion.
    <br/><br/>
    File deletion will run in the background and may take some time to finish.

    <br/><br/>
    <b>This action cannot be undone.</b>
  </p>

  <div slot="footer">
    <el-button :disabled="isDeleting" @click="cancelDeleteCollection()" plain size="small">Cancel</el-button>
    <el-button :loading="isDeleting" @click="deleteCollection()" type="danger" size="small">Delete</el-button>
  </div>
</el-dialog>
</template>

<script>
import freshcom from '@/freshcom-sdk'

export default {
  name: 'FileCollectionDeleteDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    target: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      isDeleting: false
    }
  },
  methods: {
    cancelDeleteCollection () {
      this.$emit('input', false)
    },

    deleteCollection (opts = { }) {
      this.isDeleting = true

      freshcom.deleteFileCollection(this.target.id).then(() => {
        this.isDeleting = false
        this.$message({
          showClose: true,
          message: `File collection deleted successfully.`,
          type: 'success'
        })

        this.cancelDeleteCollection()
        this.$emit('deleted')
      }).catch(() => {
        this.isDeleting = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
