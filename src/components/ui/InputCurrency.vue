<template>
  <Input
    ref="inputRef"
    v-model="model"
    :label="label"
    :rules="[...rules]"
    :suffix="suffix"
    lazyRules
    decimal="."
    mask="#.##"
    precision="2"
    :disable="disable"
    :class="inputClass"
    reverse-fill-mask
    @blur="onBlur"
  >
    <template #append>
      <slot name="append" />
    </template>
    <template #after>
      <slot name="after" />
    </template>
  </Input>
</template>

<script>
import Input from 'components/ui/Input'
import _ from 'lodash'
export default {
  name: 'InputCurrency',
  components: { Input },
  emits: ['update:modelValue'],
  props: {
    modelValue: [String, Number],
    rules: {
      type: Array,
      default: () => []
    },
    label: String,
    inputClass: String,
    suffix: {
      type: String,
      default: '€'
    },
    disable: Boolean
  },
  data () {
    return {
      model: undefined
    }
  },
  watch: {
    modelValue (newValue) {
      if (!_.isEqual(newValue, this.model)) this.model = this.modelValue
    },
    model (newValue) {
      if (!_.isEqual(newValue, this.modelValue)) this.$emit('update:modelValue', newValue)
    }
  },
  methods: {
    // isNumber (val) {
    //   return !val?.includes('_') || this.$t('common.insertValidNumber')
    // },
    validate () {
      return this.$refs.inputRef.validate()
    },
    onBlur () {
      if (!this.model.includes('.')) {
        this.$emit('update:modelValue', `${this.model}.00`)
      }
      if (!this.model) {
        this.$emit('update:modelValue', undefined)
      }
    }
    // onBlur () {
    //   console.debug('onBlur', this.model)
    //   if (this.model?.includes('_')) {
    //     this.model = undefined
    //   }
    //   if (_.isUndefined(this.model)) {
    //     console.debug(this.$refs.inputRef)
    //   }
    // }
  },
  created () {
    this.model = this.modelValue
  }
}
</script>

<style scoped>

</style>
