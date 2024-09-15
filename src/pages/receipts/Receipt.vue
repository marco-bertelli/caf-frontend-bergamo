<template>
  <q-page padding>
    <PageHeader :title="$t(`${entity}.title`, { code: receipt.code })">
      <template #back>
        <q-btn icon="fas fa-arrow-left" color="black" round flat @click="goBack" size="1rem" class="q-mr-sm"/>
      </template>
      <template #actions>
        <div class="row items-center">
          <q-btn :label="$t('common.update')" color="accent" class="text-bold q-mx-xs" @click="onSave" :loading="loading"/>
          <q-btn :label="$t('common.pdf')" color="dark" class="text-bold q-mx-xs" @click="createPdf" :loading="loadingPdf"/>
        </div>
      </template>
    </PageHeader>
    <q-card flat class="bg-white q-pa-md">
      <div class="row q-col-gutter-sm">
        <Select
          class="col-12 col-md-4"
          :options="options.clients"
          :label="$t('clients.entity')"
          mapOptions
          emitValue
          :optionLabel="optionLabel"
          optionValue="_id"
          :hint="$t('common.selectFilterHint')"
          v-model="receipt.clientId"
          useInput
          @filter="filterFn"
        />
        <Input class="col-12 col-md-4" :label="$t('common.creator')"  :modelValue="getNameSurname(receipt?.creator || {})" disable />
        <InputCurrency class="col-12 col-md-4" :label="$t('common.total')" :modelValue="receipt.total" disable/>
        <Input class="col-12 disable-resize" v-model="receipt.notes" :label="$t('common.notes')"/>
      </div>
    </q-card>
    <router-view :receipt="receipt" @update="getData"/>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { notEmpty, testEmail } from 'src/utils/validations'
import Input from 'components/ui/Input'
import Select from 'components/ui/Select'
import PageHeader from 'components/ui/PageHeader'
import { getNameSurname, notify } from 'src/utils'
import { compact, pick } from 'lodash'
import InputCurrency from 'components/ui/InputCurrency'

export default {
  name: 'Receipt',
  components: { InputCurrency, PageHeader, Select, Input },
  data () {
    return {
      entity: 'recepits',
      receipt: {
        clientId: undefined,
        creatorId: undefined,
        creator: {},
        pdfUrl: undefined,
        recepitGroups: [],
        total: 0,
        code: undefined,
        notes: undefined
      },
      options: {
        clients: []
      },
      loading: false,
      loadingPdf: false,
      filterClientValue: ''
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'currentUserRole']),
    isAdd () {
      return this.$route.params?.id && this.$route.params.id === 'new'
    }
  },
  methods: {
    async filterFn (val, update, abort) {
      if (val.length > 2) {
        try {
          const params = { q: val }
          const { data } = await this.$axios.get('clients', { params })
          update(() => {
            this.options.clients = data
          })
        } catch (e) {
          abort()
        }
      } else {
        abort()
      }
    },
    notEmpty,
    testEmail,
    getNameSurname,
    goBack () {
      this.$router.back()
    },
    isValid () {
      const refs = ['name', 'prices']
      if (this.isAdd) refs.push('password')
    },
    async createPdf () {
      const { id } = this.$route.params
      try {
        this.loadingPdf = true
        const { data } = await this.$axios.post(`${this.entity}/${id}/pdf`)
        this.receipt = { ...data }
        // await downloadFile(data.pdfUrl)
        window.open(data?.pdfUrl, '_blank')
        console.debug({ data })
        this.loadingPdf = false
      } catch (e) {
        this.loadingPdf = false
        console.error({ e })
      }
    },
    optionLabel (c) {
      return getNameSurname(c)
    },
    async onSave () {
      const { id } = this.$route.params
      try {
        let message = this.$t(`${this.entity}.createdSuccess`)
        this.loading = true
        const item = pick(this.receipt, ['clientId', 'notes'])
        if (this.isAdd) {
          await this.$axios.post(this.entity, { ...item })
        } else {
          await this.$axios.put(`${this.entity}/${id}`, { ...item })
          message = this.$t(`${this.entity}.updatedSuccess`)
        }
        notify.success(message)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getData () {
      const { id } = this.$route.params
      if (id && id !== 'new') {
        const { data } = await this.$axios.get(`${this.entity}/${id}`)
        this.receipt = { ...data }
        this.options.clients = compact([data?.client || null])
      }
    }
  },
  async created () {
    await this.getData()
  }
}
</script>
