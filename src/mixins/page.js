import ContentContainer from '@/components/content-container'

export default {
  components: {
    ContentContainer
  },
  props: {
    callbackPath: {
      type: String
    }
  },
  computed: {
    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    back () {
      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      this.defaultBack()
    }
  }
}
