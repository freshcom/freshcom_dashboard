import PageMixin from '@/mixins/page'

export default function (opts = {}) {
  return {
    mixins: [PageMixin],
    data () {
      return {
        isReady: false
      }
    },
    created () {
      if (opts.loadMethodName) {
        this[opts.loadMethodName]().then(() => {
          this.isReady = true
        })
      }
    },
    methods: {
      reload () {
        if (opts.loadMethodName) {
          this.isReady = false
          this[opts.loadMethodName]().then(() => {
            this.isReady = true
          })
        }
      }
    }
  }
}
