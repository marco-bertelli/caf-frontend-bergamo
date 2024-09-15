<template>
  <div class="row items-center">
    <q-avatar size="2rem">
      <q-icon name="fas fa-user" />
    </q-avatar>
    <div>
      {{$store.getters?.currentUser?.name}} {{$store.getters?.currentUser?.surname}}
    </div>
    <div class="q-mx-sm">
      <q-btn icon="fas fa-sign-out" round flat @click.stop="logout"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProfileTooltip',
  methods: {
    logout () {
      this.$router.replace({ name: 'login' })
      this.$store.commit('logout')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
