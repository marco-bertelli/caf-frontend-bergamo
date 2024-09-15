<template>
  <q-page padding>
    <PageHeader :title="$t(`offices.entity`)">
      <template #back>
        <q-btn icon="fas fa-arrow-left" color="black" round flat @click="goBack" size="1rem" class="q-mr-sm"/>
      </template>
    </PageHeader>
    <q-card flat class="bg-white q-pa-md">
      <div class="row q-col-gutter-md">
        <Input class="col-12" ref="name" :rules="[notEmpty]" v-model="office.name" :label="$t('common.name')"/>
      </div>
      <div class="row q-col-gutter-md q-mt-sm" v-if="!isAdd">
        <div class="col-12 text-bold text-md">
          {{$t('common.associatedUsers')}}
        </div>
        <div class="col-12">
          <Select
            class="col-12 col-md-4"
            :options="users"
            v-model="user"
            :label="$t('common.linkUser')"
            mapOptions
            :optionLabel="optionLabelUser"
            @update:modelValue="linkUser"
            hide-selected
          />
        </div>
        <div class="col-12" v-for="user of office.associatedUsers" :key="user?._id">
          <div class="row items-center" style="border-bottom: 1px solid lightgrey">
            {{optionLabelUser(user)}}
            <q-btn icon="fas fa-times" color="negative" round flat @click="unLinkUser(user)" size="1rem" class="q-mr-sm"/>
          </div>
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
import { notEmpty, testEmail } from 'src/utils/validations'
import Input from 'components/ui/Input'
import PageHeader from 'components/ui/PageHeader'
import { getNameSurname, notify } from 'src/utils'
import { cloneDeepWith, filter, toLower } from 'lodash'
import Select from 'components/ui/Select'

export default {
  name: 'Office',
  components: { Input, PageHeader, Select },
  data () {
    return {
      entity: 'offices',
      office: {
        name: undefined,
        associatedUsers: []
      },
      options: {
        users: []
      },
      user: null,
      filterUserValue: '',
      loading: false,
      userToUnlink: [],
      userToLink: []
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'currentUserRole']),
    isAdd () {
      return this.$route.params?.id && this.$route.params.id === 'new'
    },
    users () {
      this.filterUserValue && this.filterUserValue.update()
      const options = cloneDeepWith(filter(this.options.users, user => !user?.officeId))
      if (!this.filterUserValue.val) return options
      return filter(options, ({ name, surname }) => toLower(name).includes(this.filterUserValue.val) || toLower(surname).includes(this.filterUserValue.val))
    }
  },
  methods: {
    optionLabelUser (u) {
      return getNameSurname(u)
    },
    filterFn (val, update) {
      this.filterUserValue = { update, val }
    },
    notEmpty,
    testEmail,
    goBack () {
      this.$router.back()
    },
    isValid () {
      return this.$refs.name.validate()
    },
    linkUser (user) {
      this.userToLink.push(user)
      this.userToUnlink.filter(u => u._id !== user._id)
      const userIndex = this.options.users.findIndex(u => u._id === user._id)
      this.options.users[userIndex].officeId = this.$route.params.id
      this.office.associatedUsers.push(user)
    },
    optionLabel (r) {
      return this.$t(`roles.${r}`)
    },
    unLinkUser (user) {
      this.userToUnlink.push(user)
      this.userToLink.filter(u => u._id !== user._id)
      const userIndex = this.options.users.findIndex(u => u._id === user._id)
      this.options.users[userIndex].officeId = undefined
      this.office.associatedUsers = filter(this.office.associatedUsers, u => u._id !== user._id)
    },
    async getUsers () {
      const { data } = await this.$axios.get('users', { params: { fields: ['name', 'surname', 'officeId'], limit: 100 } })
      this.options.users = data
    },
    async linkUsers () {
      return await Promise.all(this.userToLink.map(async user => {
        const { data } = await this.$axios.put(`users/${user._id}`, { officeId: this.$route.params.id })
        return data
      }))
    },
    async unLinkUsers () {
      return await Promise.all(this.userToUnlink.map(async user => {
        const { data } = await this.$axios.put(`users/${user._id}`, { officeId: null })
        return data
      }))
    },
    async onConfirm () {
      const { id } = this.$route.params
      if (!this.isValid()) return
      try {
        this.loading = true
        let message = this.$t('offices.createdSuccess')
        if (this.isAdd) {
          await this.$axios.post(this.entity, { ...this.office })
        } else {
          await this.$axios.put(`${this.entity}/${id}`, { ...this.office })
          message = this.$t('offices.updatedSuccess')
        }

        await this.linkUsers()
        await this.unLinkUsers()

        notify.success(message)
        this.loading = false
        this.goBack()
      } catch (e) {
        this.loading = false
      }
    }
  },
  async created () {
    await this.getUsers()
    const { id } = this.$route.params
    if (id && id !== 'new') {
      const { data } = await this.$axios.get(`offices/${id}`)
      this.office = { ...data }
      this.office.associatedUsers = filter(this.options.users, u => u?.officeId === data._id)
    }
  }
}
</script>
