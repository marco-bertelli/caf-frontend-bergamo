<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="Go Home"
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
