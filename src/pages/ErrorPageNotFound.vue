<template>
  <div class="fullscreen not-found text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="code">
        404
      </div>

      <div class="text-h5" style="opacity:.7">
        {{ $t('common.pageNotFound') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        :label="$t('common.goHome')"
        no-caps
        @click="goHome"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ErrorPageNotFound',
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'currentUserRole'])
  },
  methods: {
    async goHome () {
      if (!this.isAuthenticated) return this.$router.replace({ name: 'login' })
      await this.$router.replace({ name: this.$store.getters.homeRoute })
    }
  }
}
</script>

<style scoped lang="scss">
.not-found {
  background: linear-gradient(135deg, $dark 0%, $primary 100%);
}
.code {
  font-size: 22vh;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}
</style>
