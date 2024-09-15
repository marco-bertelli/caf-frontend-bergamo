<template>
  <q-page padding>
    <PageHeader :title="$t(`clients.entity`)">
      <template #back>
        <q-btn icon="fas fa-arrow-left" color="black" round flat @click="goBack" size="1rem" class="q-mr-sm"/>
      </template>
    </PageHeader>
    <q-card flat class="bg-white q-pa-md">
      <div class="row q-col-gutter-md">
        <Input class="col-12 col-md-4" ref="name" :rules="[notEmpty]" v-model="client.name" :label="$t('common.name')"/>
        <Input class="col-12 col-md-4" ref="surname" :rules="[notEmpty]" v-model="client.surname" :label="$t('common.surname')"/>
        <Input class="col-12 col-md-4" ref="email" :rules="[notEmpty, testEmail]" v-model="client.email" :label="$t('common.email')"/>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 text-bold">
          {{$t('common.personalInfo')}}
        </div>
        <template v-for="key of Object.keys(client.personalInfo)" :key="key">
          <Input class="col-12 col-md-4" :rules="[]" v-model="client.personalInfo[key]" :label="$t(`common.${key}`)"/>
        </template>
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
import { notify } from 'src/utils'

export default {
  name: 'Client',
  components: { Input, PageHeader },
  data () {
    return {
      entity: 'clients',
      client: {
        name: undefined,
        surname: undefined,
        email: undefined,
        personalInfo: {
          streetName: undefined,
          zipCode: undefined,
          city: undefined,
          province: undefined,
          region: undefined,
          state: undefined,
          vatNumber: undefined,
          telephone: undefined
        }
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
    async onConfirm () {
      const { id } = this.$route.params
      try {
        let message = this.$t('clients.createdSuccess')
        this.loading = true
        if (this.isAdd) {
          await this.$axios.post(this.entity, { ...this.client })
        } else {
          await this.$axios.put(`${this.entity}/${id}`, { ...this.client })
          message = this.$t('clients.updatedSuccess')
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
      const { data } = await this.$axios.get(`clients/${id}`)
      this.client = {
        ...this.client,
        ...data,
        personalInfo: {
          ...this.client.personalInfo,
          ...data?.personalInfo || {}
        }
      }
      console.debug({ client: this.client })
    }
  }
}
</script>
