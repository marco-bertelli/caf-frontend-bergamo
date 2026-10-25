<template>
  <q-layout view="lHh Lpr lff">
    <q-page class="flex flex-center wrapper">
      <div class="row justify-center full-width q-px-md">
        <div class="col-12 login-col">
          <div class="row justify-center card-login">
            <div class="col-12 row justify-center">
              <img src="img/logo.png" class="logo" alt="logo"/>
            </div>
            <div class="col-12 row justify-center q-mb-lg">
              <div class="text-h6 text-weight-bold">{{$t('common.login')}}</div>
            </div>
            <div class="col-12 row q-col-gutter-md">
              <Input class="col-12" :rules="[notEmpty, testEmail]" ref="email" v-model="user.email" type="email" autocomplete="username" autofocus :label="$t('common.email')" @keyup.enter="onLogin">
                <template #append>
                  <q-icon name="fas fa-envelope"/>
                </template>
              </Input>
              <Input class="col-12" :rules="[notEmpty]" ref="password" v-model="user.password" type="password" autocomplete="current-password" :label="$t('common.password')" @keyup.enter="onLogin">
                <template #append>
                  <q-icon name="fas fa-lock"/>
                </template>
              </Input>
              <div class="col-12 row justify-center">
                <q-btn class="btn text-weight-bold full-width" size="md" unelevated color="primary" :label="$t('common.login')" @click="onLogin" :loading="loading"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>

<script>
import _ from 'lodash'
import Input from 'components/ui/Input'
import Validations from 'src/utils/validations'

export default {
  name: 'Login',
  components: { Input },
  data () {
    return {
      loading: false,
      user: {
        email: undefined,
        password: undefined
      }
    }
  },
  methods: {
    ...Validations,
    isValid () {
      const refs = ['email', 'password']
      return _.reduce(refs, (acc, ref) => {
        acc.push(this.$refs[ref].validate())
        return acc
      }, []).every(r => r === true)
    },
    async onLogin () {
      try {
        if (!this.isValid()) return
        this.loading = true
        await this.$store.dispatch('login', this.user)
        await this.$router.replace({ name: 'users' })
        this.loading = false
      } catch (e) {
        this.loading = false
        console.error({ e })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  background-color: $standardBackground;
  background-image:
    radial-gradient(circle at 15% 20%, rgba($accent, 0.35) 0, transparent 45%),
    radial-gradient(circle at 85% 80%, rgba($secondary, 0.35) 0, transparent 45%),
    linear-gradient(135deg, $dark 0%, $primary 100%);
  min-height: 100vh;
  width: 100vw;
}
.login-col {
  max-width: 420px;
}
.card-login {
  background-color: white;
  padding: 2.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
}
.logo {
  height: auto;
  width: 220px;
  max-width: 100%;
  margin-bottom: 1.5rem;
}
.btn {
  height: 44px;
}
</style>
