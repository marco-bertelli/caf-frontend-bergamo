<template>
  <q-header class="bg-dark">
    <q-toolbar>
      <div class="row full-width justify-between items-center">
        <q-btn dense flat round @click="toggleDrawer" :aria-label="$t('common.menu')" icon="menu" color="white"/>
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

</style>
