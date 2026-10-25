<template>
  <div class="row items-center no-wrap">
    <q-avatar size="2.25rem" color="primary" text-color="white" class="profile-avatar">
      {{ initials }}
    </q-avatar>
    <div class="q-ml-sm gt-xs">
      <div class="profile-name">{{$store.getters?.currentUser?.name}} {{$store.getters?.currentUser?.surname}}</div>
      <div class="profile-role" v-if="$store.getters?.currentUser?.role">{{ $t(`roles.${$store.getters.currentUser.role}`) }}</div>
    </div>
    <div class="q-ml-sm">
      <q-btn icon="fas fa-sign-out" round flat color="grey-7" size="sm" @click.stop="logout">
        <q-tooltip>{{ $t('common.logout') }}</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProfileTooltip',
  computed: {
    initials () {
      const { name = '', surname = '' } = this.$store.getters?.currentUser || {}
      return `${name?.[0] || ''}${surname?.[0] || ''}`.toUpperCase()
    }
  },
  methods: {
    logout () {
      this.$router.replace({ name: 'login' })
      this.$store.commit('logout')
    }
  }
}
</script>

<style scoped lang="scss">
.profile-avatar {
  font-size: 0.85rem;
  font-weight: 700;
}
.profile-name {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}
.profile-role {
  font-size: 0.75rem;
  color: $textMuted;
}
</style>
