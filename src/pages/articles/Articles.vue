<template>
  <q-page padding>
  <Table
    :entity="entity"
    :columns="columns"
    :records="list"
    :loading="loading"
    :pagination="pagination"
    @update:pagination="updatePagination"
    @request="request"
  >
    <template #title>
      <div class="text-h6 row items-center q-pa-xs">
        {{$t('articles.list')}}
        <q-btn icon="fas fa-plus" flat round @click="onClickCreate"/>
      </div>
    </template>
    <template #filters>
      <div class="row q-mb-md">
        <Input class="col-12 col-md-3" v-model="filterValues.q" :label="$t('common.search')" @update:modelValue="() => onChangeFilters(filterValues)"/>
      </div>
    </template>
    <template #actions="{row}">
      <q-btn icon="fas fa-trash" color="red" round flat @click="() => onClickDelete(row)" size="sm"/>
      <q-btn icon="fas fa-pencil" round flat @click="() => goToDetail(row)" size="sm"/>
    </template>
  </Table>
  </q-page>
</template>

<script>
import _ from 'lodash'
import { ARTICLES_TYPES } from 'src/store/types'
import Table from 'components/layout/Table'
import { getInitialPagination } from 'src/utils/entities'
import ConfirmModal from 'components/modals/ConfirmModal'
import Input from 'components/ui/Input'
import { notify } from 'src/utils'
import { t } from 'boot/i18n'
import usePagination from 'src/composable/usePagination'

export default {
  name: 'Articles',
  components: { Input, Table },
  setup () {
    const entity = 'articles'
    const types = {
      filters: ARTICLES_TYPES.FILTERS,
      pagination: ARTICLES_TYPES.PAGINATION
    }
    const pagination = usePagination({
      entity,
      types
    })

    return {
      ...pagination,
      entity,
      types
    }
  },
  data () {
    return {
      columns: [
        {
          name: 'name',
          label: this.$t('common.name'),
          field: row => _.get(row, 'name', ' - '),
          align: 'left'
        },
        {
          name: 'actions',
          label: t('common.actions'),
          type: 'actions',
          align: 'right'
        }
      ],
      filterValues: {
        q: undefined
      }
    }
  },
  methods: {
    goToDetail (row) {
      this.$router.push({ name: 'articlesDetail', params: { id: row?._id } })
    },
    onClickCreate () {
      this.$router.push({ name: 'articlesDetail', params: { id: 'new' } })
    },
    onClickDelete (row) {
      this.$q.dialog({
        component: ConfirmModal,
        componentProps: {
          title: this.$t('common.deleteName', { name: row.name }),
          text: this.$t('common.sureToDeleteElement'),
          onConfirm: async () => {
            await this.$axios.delete(`articles/${row?._id}`)
          },
          onSuccess: async () => {
            await this.updateData()
            notify.success(this.$t('common.elementDeletedSuccess'))
          },
          onFailed: () => {}
        }
      })
    }
  },
  async created () {
    this.filterValues = { ..._.cloneDeepWith(this.$store.getters.filtersByType(this.types.filters)) }
    this.pagination = getInitialPagination(this.types.pagination)
  }
}
</script>

<style scoped lang="scss">
:deep(.q) {
  grid-column: 1 / span 3;
  grid-row: 1 / span 1;
}
:deep(.button) {
  grid-column: 11 / span 2;
  grid-row: 1 / span 1;
}
</style>
