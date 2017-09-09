import errorI18nKey from '@/utils/error-i18n-key'

export default function (options) {
  let storeNamespace = options.storeNamespace
  let include = options.include
  let name = options.name

  return {
    props: ['id'],
    data () {
      return {
        isLoading: false
      }
    },
    created () {
      if (!this.session) { return }
      this.loadRecord()
    },
    computed: {
      record () {
        return this.$store.state[storeNamespace].record
      },
      session () {
        return this.$store.state.session.record
      },
      currentRoutePath () {
        return this.$store.state.route.fullPath
      }
    },
    watch: {
      session (newSession) {
        if (!newSession) { return }
        this.loadRecord()
      }
    },
    methods: {
      goTo (route) {
        this.$store.dispatch('pushRoute', route)
      },
      loadRecord () {
        this.isLoading = true
        this.$store.dispatch(`${storeNamespace}/loadRecord`, { id: this.id, include: include }).then(() => {
          this.isLoading = false
        })
      },
      deleteRecord () {
        this.isLoading = true

        let targetRecord = this.record
        this.$store.dispatch(`${storeNamespace}/deleteRecord`, this.record.id).then(() => {
          this.isLoading = false

          this.$message({
            showClose: true,
            message: `${name} deleted successfully.`,
            type: 'success'
          })
          if (this.recordDeleted) {
            this.recordDeleted(targetRecord)
          }
        }).catch(error => {
          this.isLoading = false

          this.$alert(this.$t(errorI18nKey(storeNamespace, 'id', error.id[0])), 'Error')
          throw error
        })
      }
    }
  }
}
