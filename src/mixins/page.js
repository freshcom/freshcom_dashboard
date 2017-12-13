export default {
  computed: {
    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  }
}
