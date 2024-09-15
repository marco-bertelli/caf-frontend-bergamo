<template>
  <q-toolbar class="text-bold text-black row items-center justify-between q-px-none">
    <div class="row items-center">
      <slot name="back" />
      <div class="text-bold" :class="[titleClass]"> {{ title }} </div>
    </div>
    <slot name="actions" />
  </q-toolbar>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: String,
    titleClass: {
      type: String,
      default: 'text-h5'
    }
  }
}
</script>

<style scoped lang="scss">

</style>
