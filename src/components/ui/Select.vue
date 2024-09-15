<script>
import { QSelect } from 'quasar'

const { props } = QSelect

const Select = {
  ...QSelect,
  name: 'Select',
  props: {
    ...props,
    outlined: {
      type: Boolean,
      default: true
    },
    rounded: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: true
    },
    stackLabel: {
      type: Boolean,
      default: true
    },
    hideBottomSpace: {
      type: Boolean,
      default: false
    },
    lazyRules: {
      type: Boolean,
      default: true
    },
    clearIcon: {
      type: String,
      default: 'close'
    }
  }
}

export default Select
</script>
