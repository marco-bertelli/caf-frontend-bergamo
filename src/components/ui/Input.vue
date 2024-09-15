<script>
import { QInput } from 'quasar'

const { props } = QInput

const Input = {
  ...QInput,
  name: 'Input',
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
      default: false
    },
    hideBottomSpace: {
      type: Boolean,
      default: false
    },
    borderless: {
      type: Boolean,
      default: true
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
export default Input
</script>
