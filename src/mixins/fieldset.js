import _ from 'lodash'
import translateErrors from '@/helpers/translate-errors'

export default function (opts = {}) {
  return {
    props: {
      value: {
        type: Object,
        required: true
      },
      errors: {
        type: Object
      }
    },
    data () {
      return {
        formModel: _.cloneDeep(this.value)
      }
    },
    computed: {
      errorMsgs () {
        return translateErrors(this.errors, opts.errorI18nKey)
      }
    },
    watch: {
      value (v) {
        this.formModel = _.cloneDeep(v)
      }
    },
    methods: {
      updateValue: _.debounce(function () {
        this.$emit('input', this.formModel)
      }, 300)
    }
  }
}
