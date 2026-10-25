<template>
  <q-header class="app-header">
    <q-toolbar class="app-toolbar">
      <div class="row full-width justify-between items-center no-wrap">
        <div class="row items-center no-wrap">
          <q-btn dense flat round @click="toggleDrawer" :aria-label="$t('common.menu')" icon="menu" color="dark"/>
          <img src="img/logo.png" class="header-logo q-ml-md" alt="logo"/>
        </div>
        <ProfileTooltip />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfileTooltip from 'components/ui/ProfileTooltip'

export default {
  name: 'Header',
  components: { ProfileTooltip },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['left'])
  },
  methods: {
    toggleDrawer () {
      this.$store.commit('setLeftDrawer', !this.left)
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
.app-header {
  background-color: #fff;
  color: $dark;
  border-bottom: 1px solid $borderColor;
}
.app-toolbar {
  min-height: 64px;
  padding: 0 1rem;
}
.header-logo {
  height: 34px;
  width: auto;
}
</style>
