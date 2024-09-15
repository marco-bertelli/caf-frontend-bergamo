<template>
  <q-page padding>
    <PageHeader :title="$t(`users.entity`)">
      <template #back>
        <q-btn icon="fas fa-arrow-left" color="black" round flat @click="goBack" size="1rem" class="q-mr-sm"/>
      </template>
    </PageHeader>
    <q-card flat class="bg-white q-pa-md">
      <div class="row q-col-gutter-md">
        <Input class="col-12 col-md-4" ref="name" :rules="[notEmpty]" v-model="user.name" :label="$t('common.name')"/>
        <Input class="col-12 col-md-4" ref="surname" :rules="[]" v-model="user.surname" :label="$t('common.surname')"/>
        <Input class="col-12 col-md-4" ref="email" :rules="[notEmpty, testEmail]" v-model="user.email" :label="$t('common.email')"/>
        <Select class="col-12 col-md-4" ref="role" :rules="[notEmpty]" v-model="user.role" :label="$t('common.role')" :options="options.roles" :optionLabel="optionLabel"/>
        <Input class="col-12 col-md-4" ref="password" :rules="[notEmpty]" v-model="user.password" :label="$t('common.password')" v-if="isAdd"/>
      </div>
      <div class="row q-col-gutter-md items-center q-mt-xl" v-if="!isAdd && $store.getters.currentUserIsAdmin">
        <div class="col-12 text-bold">
          {{$t('common.resetPassword')}}
        </div>
        <Input class="col-12 col-md-4" ref="newPassword" :rules="[notEmpty]" v-model="newPassword" :label="$t('common.password')"/>
        <div class="q-pt-none">
          <q-btn :label="$t('common.confirm')" color="primary" class="text-bold" @click="resetPassword" :loading="loading" :disable="!newPassword"/>
        </div>
      </div>
    </q-card>
  </q-page>
  <q-footer>
    <div class="row justify-end full-width items-center">
      <q-btn :label="$t('common.back')" icon="fas fa-angle-left" color="black" outline class="text-bold q-mx-xs" @click="goBack"/>
      <q-btn :label="$t('common.confirm')" color="primary" class="text-bold q-mx-xs" @click="onConfirm" :loading="loading"/>
    </div>
  </q-footer>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_ROLES } from 'src/utils/const'
import { notEmpty, testEmail } from 'src/utils/validations'
import Input from 'components/ui/Input'
import PageHeader from 'components/ui/PageHeader'
import Select from 'components/ui/Select'
import { notify } from 'src/utils'
import ConfirmModal from 'components/modals/ConfirmModal'

export default {
  name: 'User',
  components: { Input, PageHeader, Select },
  data () {
    return {
      entity: 'users',
      newPassword: undefined,
      user: {
        name: undefined,
        surname: undefined,
        email: undefined,
        isEnabled: true,
        isConfirmed: true,
        password: undefined,
        image: null,
        mobilePhone: undefined,
        role: USER_ROLES.USER
      },
      options: {
        roles: Object.values(USER_ROLES)
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'currentUserRole']),
    isAdd () {
      return this.$route.params?.id && this.$route.params.id === 'new'
    }
  },
  methods: {
    notEmpty,
    testEmail,
    goBack () {
      this.$router.back()
    },
    isValid () {
      const refs = ['name', 'surname', 'email', 'username']
      if (this.isAdd) refs.push('password')
    },
    optionLabel (r) {
      return this.$t(`roles.${r}`)
    },
    resetPassword () {
      this.$q.dialog({
        component: ConfirmModal,
        componentProps: {
          title: this.$t('common.resetPassword'),
          text: this.$t('common.sureToResetPassword'),
          onConfirm: async () => {
            await this.$axios.put(`users/${this.$route.params.id}/passwordReset`, { password: this.newPassword })
          },
          onSuccess: async () => {
            this.newPassword = undefined
            notify.success(this.$t('common.passwordResetSuccess'))
          },
          onFailed: () => {}
        }
      })
    },
    async onConfirm () {
      const { id } = this.$route.params
      try {
        this.loading = true
        let message = this.$t('users.createdSuccess')
        if (this.isAdd) {
          await this.$axios.post(this.entity, { ...this.user })
        } else {
          await this.$axios.put(`${this.entity}/${id}`, { ...this.user })
          message = this.$t('users.updatedSuccess')
        }

        notify.success(message)
        this.loading = false
        this.goBack()
      } catch (e) {
        this.loading = false
      }
    }
  },
  async created () {
    const { id } = this.$route.params
    if (id && id !== 'new') {
      const { data } = await this.$axios.get(`users/${id}`)
      this.user = { ...data }
    }
  }
}
</script>
