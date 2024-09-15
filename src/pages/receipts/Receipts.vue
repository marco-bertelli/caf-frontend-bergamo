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
          {{$t('receipts.list')}}
          <q-btn icon="fas fa-plus" flat round @click="onClickCreate" :loading="loadingCreate"/>
        </div>
      </template>
      <template #filters>
        <div class="row q-mb-md">
          <Input class="col-12 col-md-3" v-model="filterValues['code.$contains']" :label="$t('common.search')" @update:modelValue="() => onChangeFilters(filterValues)"/>
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
import { RECEIPTS_TYPES } from 'src/store/types'
import { getInitialPagination } from 'src/utils/entities'
import ConfirmModal from 'components/modals/ConfirmModal'
import Input from 'components/ui/Input'
import Table from 'components/layout/Table'
import { formatCurrency, getNameSurname, notify } from 'src/utils'
import { t } from 'boot/i18n'
import { fromISOToFormat } from 'src/utils/date'
import usePagination from 'src/composable/usePagination'

export default {
  name: 'Receipts',
  components: { Input, Table },
  setup () {
    const entity = 'recepits'
    const types = {
      filters: RECEIPTS_TYPES.FILTERS,
      pagination: RECEIPTS_TYPES.PAGINATION
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
      loadingCreate: false,
      columns: [
        {
          name: 'code',
          label: t('common.code'),
          field: row => _.get(row, 'code', ' - '),
          align: 'left'
        },
        {
          name: 'createdAt',
          label: t('common.createdAt'),
          field: row => fromISOToFormat(row?.createdAt),
          align: 'left'
        },
        {
          name: 'total',
          label: t('common.total'),
          field: row => formatCurrency(row?.total),
          align: 'left'
        },
        {
          name: 'clientId',
          label: t('clients.entity'),
          field: row => getNameSurname(row?.client || {}),
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
        'code.$contains': undefined
      }
    }
  },
  methods: {
    goToDetail (row) {
      this.$router.push({ name: 'receiptsDetail', params: { id: row?._id } })
    },
    async onClickCreate () {
      try {
        this.loadingCreate = true
        const { data: receipt } = await this.$axios.post('recepits', {
          creatorId: this.$store.getters.currentUser?._id
        })
        this.loadingCreate = false
        this.goToDetail(receipt)
      } catch (e) {
        this.loadingCreate = false
        console.error({ e })
      }
    },
    onClickDelete (row) {
      this.$q.dialog({
        component: ConfirmModal,
        componentProps: {
          title: this.$t('common.deleteName', { name: row.code }),
          text: this.$t('common.sureToDeleteElement'),
          onConfirm: async () => {
            await this.$axios.delete(`recepits/${row?._id}`)
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
