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
    <q-list dark padding class="menu-wrapper col sidebar-bg">
      <div class="overflow-hidden nav-wrapper">
        <div class="sideWith">
          <div class="flex flex-center q-mx-sm q-mb-xs text-white" v-for="link in filteredItems" :key="link.text">
            <q-item
              dark
              class="full-width borderItems justify-start"
              :class="{'bg-selected text-bold' : routeMatch(link) }"
              @click="navigateTo(link)"
              clickable
            >
              <q-item-section avatar>
                <q-icon size="xs" :name="link.icon" class="nav-icon-color" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="nav-label">
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
  border-radius: 10px;
  min-height: 44px;
  color: rgba(255, 255, 255, 0.72);
  transition: background-color 0.15s, color 0.15s;
  &:hover {
    color: #fff;
  }
}

.nav-icon-color {
  color: inherit;
  opacity: 0.85;
}

.nav-label {
  color: inherit;
  font-size: 0.9rem;
  font-weight: 500;
}

.sidebar-bg {
  background: linear-gradient(180deg, $dark 0%, darken($dark, 3%) 100%);
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
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff !important;
  box-shadow: inset 3px 0 0 lighten($accent, 15%);
  .nav-icon-color {
    opacity: 1;
  }
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
