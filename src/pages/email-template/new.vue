<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListEmail' }">Emails</router-link>
    <router-link :to="{ name: 'ListEmailTemplate' }">Templates</router-link>
  </div>

  <div slot="card-header">
    <h1>Create an email template</h1>

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
      <el-row>
        <el-col :span="24">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <email-template-fieldset v-model="emailTemplateDraft" :errors="errors"></email-template-fieldset>
          </el-form>
        </el-col>
      </el-row>
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

import PageMixin from '@/mixins/page'
import EmailTemplate from '@/models/email-template'
import EmailTemplateFieldset from '@/components/email-template-fieldset'

export default {
  name: 'NewEmailTemplate',
  mixins: [PageMixin],
  components: {
    EmailTemplateFieldset
  },
  data () {
    return {
      emailTemplateDraft: EmailTemplate.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createEmailTemplate(this.emailTemplateDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Email template created successfully.`,
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
      this.$store.dispatch('pushRoute', { name: 'ListEmailTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
