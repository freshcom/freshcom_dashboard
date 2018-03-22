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

      filterObject: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        filterObjectDraft: _.cloneDeep(this.filterObject)
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

      filterObject (newObject, oldObject) {
        if (_.isEqual(newObject, oldObject)) {
          return
        }
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
        this.filterObjectDraft = {}
      },

      resetFilter () {
        this.filterObjectDraft = _.cloneDeep(this.filterObject)
      }
    }
  }
}
