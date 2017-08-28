import _ from 'lodash'
import { startCase } from '@/helpers/filters'

export default function (options) {
  let storeNamespace = options.storeNamespace
  let fields = options.fields

  return {
    props: {
      searchKeyword: {
        type: String,
        default: ''
      },
      page: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        isEnteringSearchKeyword: false,
        searched: false,
        totalCount: 0,
        resultCount: 0,
        isLoading: true
      }
    },
    created () {
      if (!this.session) { return }
      this.search()
    },
    computed: {
      noSearchResult () {
        return this.searched && this.resultCount === 0
      },
      hasSearchResult () {
        return this.searched && this.resultCount !== 0
      },
      records () {
        return this.$store.state[storeNamespace].records
      },
      session () {
        return this.$store.state.session.record
      }
    },
    watch: {
      searchKeyword (newKeyword) {
        this.search()
      },
      page (newPage, oldPage) {
        if (_.isEqual(newPage, oldPage)) {
          return
        }
        this.search()
      },
      session (newSession) {
        if (!newSession) { return }
        this.search()
      }
    },
    methods: {
      startCase,
      enteringKeyword (newSearchKeyword) {
        this.isEnteringSearchKeyword = true
        this.searched = false
        this.updateSearchKeyword(newSearchKeyword)
      },
      updateSearchKeyword: _.debounce(function (newSearchKeyword) {
        this.isEnteringSearchKeyword = false

        // Remove page[number] from query to reset to the first page
        let q = _.merge({}, _.omit(this.$route.query, ['page[number]']), { search: newSearchKeyword })
        this.$router.replace({ name: this.$store.state.route.name, query: q })
      }, 300),
      search () {
        this.isLoading = true
        this.$store.dispatch(`${storeNamespace}/loadRecords`, { search: this.searchKeyword, page: this.page, fields: fields }).then(response => {
          this.totalCount = response.meta.totalCount
          this.resultCount = response.meta.resultCount
          this.searched = true
          this.isLoading = false
        })
      },
      goTo (route) {
        this.$store.dispatch('pushRoute', route)
      }
    }
  }
}
