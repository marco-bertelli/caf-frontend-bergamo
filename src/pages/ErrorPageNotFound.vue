<template>
  <div class="fullscreen not-found text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="code">
        404
      </div>

      <div class="text-h5" style="opacity:.7">
        Pagina non trovata
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        label="Torna alla home"
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
