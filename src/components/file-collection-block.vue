<template>
<div class="block component-wrapper file-collection-block">
  <div class="header">
    <h2>File Collections</h2>

    <div class="action-group">
      <router-link :to="{ name: 'NewFileCollection', query: { owner: { id: owner.id, type: owner.type, name: owner.name }, callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
        Add
      </router-link>
    </div>
  </div>

  <div class="body full">
    <el-table :data="records" class="data-table block-table" :show-header="false">
      <el-table-column width="300">
        <template slot-scope="scope">
          <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="primary">
            <span>{{scope.row.name}}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="100">
        <template slot-scope="scope">
          <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }">
            <span>{{scope.row.fileCount}} files</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot-scope="scope">
          {{scope.row.insertedAt | moment}}
        </template>
      </el-table-column>

      <el-table-column align="right" width="130">
        <template slot-scope="scope">
          <p class="action-group">
            <el-button-group>
              <router-link :to="{ name: 'EditFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                Edit
              </router-link>
              <el-button @click="attemptDelete(scope.row)" plain size="mini">
                Delete
              </el-button>
            </el-button-group>
          </p>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="records.length >= 5" class="foot text-center">
      <router-link :to="{ name: 'ListFileCollection', query: { filter: { ownerType: owner.type, ownerId: owner.id } } }" class="view-more">View More</router-link>
    </div>
  </div>

  <div class="launchable">
    <file-collection-delete-dialog
      v-model="isConfirmingDelete"
      :target="targetForDelete"
      @deleted="deleted()"
    ></file-collection-delete-dialog>
  </div>
</div>
</template>

<script>
import FileCollectionDeleteDialog from '@/components/file-collection-delete-dialog'

export default {
  name: 'FileCollectionBlock',
  components: {
    FileCollectionDeleteDialog
  },
  props: {
    owner: {
      type: Object,
      required: true
    },
    records: {
      type: Array,
      require: true
    }
  },
  computed: {
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  data () {
    return {
      isConfirmingDelete: false,
      targetForDelete: {}
    }
  },
  methods: {
    attemptDelete (fileCollection) {
      this.isConfirmingDelete = true
      this.targetForDelete = fileCollection
    },

    deleted () {
      this.$emit('deleted')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
