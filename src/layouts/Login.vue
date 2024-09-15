<template>
  <q-layout view="lHh Lpr lff">
    <q-page class="flex flex-center wrapper">
      <div class="row justify-center">
        <div class="col-12 col-md-6">
          <div class="row justify-center card-login">
            <div class="col-12 row justify-center">
              <img src="img/logo.png" class="logo" alt="logo"/>
            </div>
            <div class="col-12 row justify-center">
              <div class="text-h6 text-weight-bold">{{$t('common.login')}}</div>
            </div>
            <div class="col-12 col-md-8 row q-col-gutter-md">
              <Input class="col-12" :rules="[notEmpty, testEmail]" ref="email" v-model="user.email" :label="$t('common.email')">
                <template #append>
                  <q-icon name="fas fa-envelope"/>
                </template>
              </Input>
              <Input class="col-12" :rules="[notEmpty]" ref="password" v-model="user.password" :label="$t('common.password')" @keyup.enter="onLogin">
                <template #append>
                  <q-icon name="fas fa-lock"/>
                </template>
              </Input>
              <div class="col-12 row justify-center">
                <q-btn class="btn text-weight-bold" color="primary" :label="$t('common.login')" @click="onLogin" :loading="loading"/>
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
  background-image: url("https://source.unsplash.com/2000x900/?digital");
  background-color: #ffffff;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.card-login {
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
}
.logo {
  height: 13rem;
  width: auto;
}
</style>
