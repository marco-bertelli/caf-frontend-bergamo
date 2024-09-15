<template>
  <q-page padding>
    <PageHeader :title="$t(`articles.entity`)">
      <template #back>
        <q-btn icon="fas fa-arrow-left" color="black" round flat @click="goBack" size="1rem" class="q-mr-sm"/>
      </template>
    </PageHeader>
    <q-card flat class="bg-white q-pa-md">
      <div class="row q-col-gutter-md">
        <Input class="col-12 col-md-4" ref="name" :rules="[notEmpty]" v-model="article.name" :label="$t('common.name')" :disable="!$store.getters.currentUserIsAdmin"/>
        <Select
          class="col-12 col-md-4"
          ref="articleType"
          :rules="[notEmpty]"
          :options="['user', 'admin']"
          :option-label="t => $t(`articles.${t}`)"
          v-model="article.articleType"
          :disable="!$store.getters.currentUserIsAdmin"
          :label="$t('common.articleType')"
        />
        <div class="col-12">
          <div class="row items-center">
            <span class="text-bold"> {{$t('common.prices')}}</span>
            <q-btn icon="fas fa-plus" @click="addPrice" round flat size="sm">
              <q-tooltip anchor="top right">
                {{$t('common.addPrice')}}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="col-12" v-for="(price, index) of article.prices" :key="index">
          <div class="row">
            <InputCurrency v-model="article.prices[index]" :label="$t('common.price')" class="col-5">
              <template #after>
                <q-btn icon="fas fa-trash" @click="() => deletePrice(index)" round flat size="sm" color="negative"/>
              </template>
            </InputCurrency>
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
import { notEmpty, testEmail } from 'src/utils/validations'
import Input from 'components/ui/Input'
import Select from 'components/ui/Select'
import PageHeader from 'components/ui/PageHeader'
import { notify } from 'src/utils'
import InputCurrency from 'components/ui/InputCurrency'
import _ from 'lodash'

export default {
  name: 'Article',
  components: { InputCurrency, Input, PageHeader, Select },
  data () {
    return {
      entity: 'articles',
      article: {
        name: undefined,
        articleType: 'admin',
        prices: []
      },
      loading: false
    }
  },
  computed: {
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
      return this.$refs.name.validate() && this.$refs.articleType.validate()
    },
    normalizeEurosToCent (value) {
      console.debug({ value })
      if (_.isString(value) && value.includes('.')) {
        const val = Number(value).toFixed(2)
        return Number(val * 100)
      }
      return value
    },
    addPrice () {
      this.article.prices.push(0)
    },
    deletePrice (index) {
      const { prices } = this.article
      this.article.prices = _.filter(prices, (p, i) => i !== index)
    },
    normalizeArticle (article) {
      this.article = {
        ...article
      }
    },
    async onConfirm () {
      const { id } = this.$route.params
      if (!this.isValid()) return
      try {
        let message = this.$t('articles.createdSuccess')
        this.loading = true
        const item = {
          ...this.article,
          prices: _.reduce(_.compact(this.article.prices), (acc, price) => {
            acc.push(this.normalizeEurosToCent(price))
            return acc
          }, [])
        }
        if (this.isAdd) {
          await this.$axios.post(this.entity, { ...item })
        } else {
          await this.$axios.put(`${this.entity}/${id}`, { ...item })
          message = this.$t('articles.updatedSuccess')
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
      const { data } = await this.$axios.get(`articles/${id}`)
      this.article = { ...data }
    }
  }
}
</script>
