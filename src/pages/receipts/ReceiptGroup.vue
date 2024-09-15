<template>
  <PageHeader :title="title" title-class="text-h6">
    <template #back>
      <q-btn icon="fas fa-times" color="black" round flat @click="goBack" size="0.8rem" class="q-mr-sm"/>
    </template>
    <template #actions>
      <q-btn :label="$t('common.updateGroup')" color="accent" class="text-bold q-mx-xs" @click="onSave" :loading="loading"/>
    </template>
  </PageHeader>
  <q-card flat class="bg-white q-pa-md">
    <div class="row q-col-gutter-md">
      <Select
        class="col-12 col-md-4"
        ref="articleId"
        :rules="[notEmpty]"
        :options="options.articles"
        mapOptions
        emitValue
        optionLabel="name"
        optionValue="_id"
        v-model="receiptGroup.articleId"
        :label="$t('articles.entity')"
        @update:modelValue="updateArticleId"
      />
      <Select
        class="col-12 col-md-4"
        ref="unitPrice"
        :disable="!receiptGroup.articleId"
        :rules="[notEmpty]"
        :options="prices"
        :optionLabel="priceOptionLabel"
        v-model="receiptGroup.unitPrice"
        :label="$t('common.unitPrice')"
      />
      <Input class="col-12 col-md-4" ref="qty" :rules="[notEmptyNumber]" v-model="receiptGroup.qty" :label="$t('common.qty')"/>
      <Input class="col-12 disable-resize" ref="notes" :rules="[]" v-model="receiptGroup.notes" :label="$t('common.notes')" type="textarea"/>
    </div>
  </q-card>
</template>

<script>
import PageHeader from 'components/ui/PageHeader'
import Input from 'components/ui/Input'
import Select from 'components/ui/Select'
import { notEmpty, notEmptyNumber } from 'src/utils/validations'
import _ from 'lodash'
import { formatCurrency, notify } from 'src/utils'

export default {
  name: 'ReceiptGroup',
  components: { PageHeader, Input, Select },
  props: {
    receipt: Object
  },
  emits: ['update'],
  data () {
    return {
      loading: false,
      entity: 'recepit_groups',
      receiptGroup: {
        recepitId: this.$route.params.id,
        code: undefined,
        name: undefined,
        total: undefined,
        qty: 0,
        notes: undefined,
        unitPrice: undefined,
        articleId: undefined,
        article: null
      },
      options: {
        articles: []
      }
    }
  },
  methods: {
    notEmptyNumber,
    notEmpty,
    goBack () {
      this.$router.back()
    },
    updateArticleId () {
      this.receiptGroup.unitPrice = null
      this.$refs.unitPrice.resetValidation()
      this.$refs.unitPrice.reset()
    },
    priceOptionLabel (price) {
      return formatCurrency(price)
    },
    validate () {
      const refs = ['articleId', 'unitPrice', 'qty']
      return _.reduce(refs, (acc, ref) => {
        acc.push(this.$refs[ref].validate())
        return acc
      }, []).every(r => r === true)
    },
    async onSave () {
      const { receiptGroupId: id } = this.$route.params
      if (!this.validate()) return
      try {
        let message = this.$t(`${this.entity}.createdSuccess`)
        this.loading = true
        const article = _.find(this.options?.articles, a => a._id === this.receiptGroup?.articleId)
        const item = { ...this.receiptGroup, article }
        if (this.isAdd) {
          await this.$axios.post(this.entity, { ...item })
        } else {
          await this.$axios.put(`${this.entity}/${id}`, { ...item })
          message = this.$t(`${this.entity}.updatedSuccess`)
        }
        notify.success(message)
        this.goBack()
        this.$emit('update')
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getOptions () {
      try {
        const params = { fields: ['name', 'prices'], cort: 'name' }
        const { data: articles } = await this.$axios.get('articles', { params })
        this.options = { articles }
      } catch (e) {
        console.error({ e })
      }
    }
  },
  computed: {
    isAdd () {
      return this.$route.params?.receiptGroupId && this.$route.params.receiptGroupId === 'new'
    },
    title () {
      return this.isAdd ? this.$t(`${this.entity}.new`) : this.$t('recepit_groups.title', { code: this.receiptGroup.code })
    },
    prices () {
      if (this.receiptGroup?.articleId) {
        const article = _.find(this.options?.articles, a => a._id === this.receiptGroup?.articleId)
        return _.get(article, 'prices', [])
      }
      return []
    }
  },
  async created () {
    const { receiptGroupId: id } = this.$route.params
    if (id && id !== 'new') {
      const { data } = await this.$axios.get(`${this.entity}/${id}`)
      this.receiptGroup = { ...data }
      this.options.articles = _.compact([_.get(data, 'article', null)])
    }

    await this.getOptions()
  }
}
</script>

<style scoped lang="scss">

</style>
