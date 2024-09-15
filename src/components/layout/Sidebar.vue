<template>
  <q-drawer
    v-model="leftDrawerOpenModel"
    show-if-above
    style="height:calc(100% - 64px  )"
    bordered
    content-class="bg-white border-none"
    :width="250"
    :mini="left"
    class="left-drawer"
    :breakpoint="500"
  >
    <q-list dark padding class="menu-wrapper col bg-primary">
      <q-separator dark/>
      <div class="overflow-hidden nav-wrapper">
        <div class="q-mt-xs sideWith">
          <div class="flex flex-center q-mx-xs text-white" v-for="link in filteredItems" :key="link.text">
            <q-separator dark />
            <q-item
              dark
              class="full-width borderItems justify-start"
              :class="{'bg-selected text-bold' : routeMatch(link) }"
              @click="navigateTo(link)"
              clickable
            >
              <q-item-section avatar>
                <q-icon color="white" size="xs" :name="link.icon"  />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white">
                  {{link.text}}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </q-list>
  </q-drawer>
</template>

<script>

import _ from 'lodash'
import { mapGetters } from 'vuex'
import store from 'src/store'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'Sidebar',
  props: {
    items: Array
  },
  data () {
    return {
      leftDrawerOpenModel: false
    }
  },
  watch: {
    left: {
      deep: true,
      handler (newValue, prev) {
        if (this.$q.platform.is.mobile && prev != null) { this.leftDrawerOpenModel = this.left }
      }
    },
    leftDrawerOpenModel: {
      deep: true,
      handler (newValue) {
        if (this.$q.platform.is.mobile) { this.setLeftDrawer(this.leftDrawerOpenModel) }
      }
    }
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const navigateTo = ({ routeName, mutation, replaceRoute, params = {}, getParamsFromState }) => {
      if (mutation) store.commit(mutation)
      if (route?.name === routeName) return
      if (replaceRoute) {
        router.replace({ name: routeName })
        return
      }
      const routeParams = { ...params }
      router.push({ name: routeName, params: { ...routeParams } })
    }

    return {
      navigateTo
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'currentUserIsAdmin', 'left', 'currentUserRole', 'currentUserLastLogin']),
    filteredItems () {
      return _.filter(this.items, item => item?.role?.includes(this.currentUserRole))
    }
  },
  methods: {
    routeMatch (link) {
      return this.$route.matched.some(route => _.toLower(route.path).includes(_.kebabCase(link.routeName))) || link?.routeMatches?.includes(this.$route.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.borderItems {
  border-radius: 0.2rem;
}

.menu-wrapper {
  width:100%;
  overflow: auto;
  position: fixed;
  max-height: 100%;
  padding: 0;
  top: 0;
  left: 0;
  bottom: 0;
}
.menu {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
  box-sizing: content-box; /* So the width will be 100% + 17px */
}
.expander-holder{
  position: absolute;
  right: -12px;
  top:calc( 6.5rem + 12px);
  z-index: 99999;
}
.nav-wrapper {
  margin-top: 1rem;
}
</style>
<style lang="scss">
.logo {
  padding-top: 2rem;
  padding-bottom: 2rem;
  height: auto;
  width: 78%;
}
.bg-selected {
  background-color: #F4F4F480
}
.q-drawer--mini {
  .nav-icon {
    min-width: 56px !important;
  }
  .text-side-overflow{
    display: none;
  }
  .icon-close{
    justify-content: space-around;
    padding-top: 7px;
  }

  .sideWith {
    .group_text {
      display: none;
    }
  }

  .menu-wrapper {
    width:100%;
    overflow: auto;
    position: fixed;
    min-height:100%;
    padding: 0;
    top: 0;
    left: 0;
    bottom: 0;
  }
}
</style>
