export default {
  props: {
    callbackPath: {
      type: String
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
