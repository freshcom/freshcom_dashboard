import errorI18nKey from '@/utils/error-i18n-key'

export default function (options) {
  let storeNamespace = options.storeNamespace
  let include = options.include
  let name = options.name

  return {
    props: ['id'],
    created () {
      this.loadRecord()
    },
    computed: {
      isLoading () {
        return this.$store.state[storeNamespace].isLoadingRecord
      },
      record () {
        return this.$store.state[storeNamespace].record
      },
      currentRoutePath () {
        return this.$store.state.route.fullPath
      }
    },
    methods: {
      goTo (route) {
        this.$router.push(route)
      },
      loadRecord () {
        this.$store.dispatch(`${storeNamespace}/loadRecord`, { id: this.id, include: include })
      },
      deleteRecord () {
        let targetRecord = this.record
        this.$store.dispatch(`${storeNamespace}/deleteRecord`, this.record.id).then(() => {
          this.$message({
            showClose: true,
            message: `${name} deleted successfully.`,
            type: 'success'
          })
          if (this.recordDeleted) {
            this.recordDeleted(targetRecord)
          }
        }).catch(error => {
          this.$alert(this.$t(errorI18nKey(storeNamespace, 'id', error.id[0])), 'Error')
          throw error
        })
      }
    }
  }
}
