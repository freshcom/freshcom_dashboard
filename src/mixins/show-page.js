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
      }
    },
    watch: {
      session (newSession) {
        if (!newSession) { return }
        this.loadRecord()
      }
    },
    methods: {
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
        })
      }
    }
  }
}
