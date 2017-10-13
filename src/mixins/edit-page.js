import _ from 'lodash'
import { warnDanger } from '@/helpers/plugin-wrappers'

export default function (options) {
  let storeNamespace = options.storeNamespace
  let include = options.include
  let name = options.name

  return {
    props: ['id', 'callbackPath'],
    data () {
      return {
        errors: {},
        isLoading: false
      }
    },
    created () {
      this.loadRecord()
    },
    beforeRouteLeave (to, from, next) {
      if (_.isEqual(this.recordDraft, this.record)) {
        return next()
      }

      warnDanger({
        cancel: () => {
          next(false)
        },
        confirm: () => {
          this.$store.dispatch(`${storeNamespace}/setRecordDraft`, this.record)
          next()
        }
      })
    },
    computed: {
      record () {
        return this.$store.state[storeNamespace].record
      },
      recordDraft: {
        get () {
          return this.$store.state[storeNamespace].recordDraft
        },
        set (value) {
          this.$store.dispatch(`${storeNamespace}/setRecordDraft`, value)
        }
      }
    },
    methods: {
      cancel () {
        this.$store.dispatch('popRoute', 1)
      },
      submit (recordDraft) {
        this.isLoading = true

        this.$store.dispatch(`${storeNamespace}/updateRecord`, { id: recordDraft.id, recordDraft: recordDraft, include: include }).then((record) => {
          this.isLoading = false

          this.$message({
            showClose: true,
            message: `${name} saved successfully.`,
            type: 'success'
          })
          if (this.recordUpdated) {
            this.recordUpdated(record)
          }
        }).catch(errors => {
          this.errors = errors
          this.isLoading = false

          this.$message({
            showClose: true,
            message: `Unable to save the ${name}. please fix the highlighted form errors then try again.`,
            type: 'error'
          })
        })
      },
      loadRecord (newLocale) {
        this.isLoading = true
        this.$store.dispatch(`${storeNamespace}/loadRecord`, { id: this.id, include: include }).then(() => {
          this.isLoading = false
        })
      },
      confirmResourceLocaleChange (newLocale, oldLocale) {
        if (_.isEqual(this.recordDraft, this.record)) {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }

        return warnDanger({ type: 'locale' })
      }
    }
  }
}
