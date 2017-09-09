import _ from 'lodash'
import { warnDanger } from '@/helpers/plugin-wrappers'

export default function (options) {
  let storeNamespace = options.storeNamespace
  let name = options.name

  return {
    props: ['callbackPath'],
    data () {
      return {
        errors: {},
        isLoading: false
      }
    },
    created () {
      this.$store.dispatch(`${storeNamespace}/resetRecord`)
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
        this.$router.go(-1)
      },
      submit (recordDraft) {
        this.isLoading = true

        this.$store.dispatch(`${storeNamespace}/createRecord`, recordDraft).then((record) => {
          this.isLoading = false

          this.$message({
            showClose: true,
            message: `${name} saved successfully.`,
            type: 'success'
          })
          if (this.recordCreated) {
            this.recordCreated(record)
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
      }
    }
  }
}
