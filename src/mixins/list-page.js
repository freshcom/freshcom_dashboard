import _ from 'lodash'

import ContentContainer from '@/components/content-container'
import FilterButton from '@/components/filter-button'
import FilterCondition from '@/components/filter-condition'
import SearchInput from '@/components/search-input'
import QueryResult from '@/components/query-result'

import { idLastPart } from '@/helpers/filters'

export default function (opts = {}) {
  return {
    components: {
      ContentContainer,
      FilterCondition,
      FilterButton,
      SearchInput,
      QueryResult
    },
    filters: {
      idLastPart
    },
    props: {
      searchKeyword: {
        type: String,
        default: ''
      },

      page: {
        type: Object,
        required: true
      },

      filter: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        filterDraft: _.cloneDeep(this.filter)
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
    watch: {
      isViewingTestData () {
        this[opts.listMethodName]()
      },

      searchKeyword (newKeyword) {
        this[opts.listMethodName]()
      },

      filter (newFilter, oldFilter) {
        if (_.isEqual(newFilter, oldFilter)) {
          return
        }
        this.filterDraft = _.cloneDeep(this.filter)
        this[opts.listMethodName]()
      },

      page (newPage, oldPage) {
        if (_.isEqual(newPage, oldPage)) {
          return
        }
        this[opts.listMethodName]()
      }
    },
    methods: {
      clearFilter () {
        this.filterDraft = []
      },

      resetFilter () {
        this.filterDraft = _.cloneDeep(this.filter)
      }
    }
  }
}
