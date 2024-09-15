<template>
  <Table :columns="columns" :loading="loading" v-model:pagination="pagination" :records="receipt?.recepitGroups || []" @request="onRequest">
    <template #title>
      <div class="text-h6 row items-center justify-between q-pa-xs">
        <span class="text-bold"> {{$t(`${entity}.list`)}} </span>
        <q-btn @click="onClickCreate" :label="$t(`${entity}.add`)" color="accent"/>
      </div>
    </template>
    <template #actions="{row}">
      <q-btn icon="fas fa-trash" color="red" round flat @click="() => onClickDelete(row)" size="sm"/>
      <q-btn icon="fas fa-arrow-right" round flat @click="() => goToDetail(row)" size="sm"/>
    </template>
  </Table>
</template>

<script>
import { STANDARD_PAGINATION } from 'src/utils/const'
import { createParamsFromTableProps, formatCurrency, notify } from 'src/utils'
import _ from 'lodash'
import Table from 'components/layout/Table'
import ConfirmModal from 'components/modals/ConfirmModal'
import { t } from 'boot/i18n'

export default {
  name: 'ReceiptGroups',
  props: {
    receipt: Object
  },
  components: { Table },
  emit: ['update'],
  data () {
    const { id } = this.$route.params
    return {
      receiptId: id,
      entity: 'recepit_groups',
      loading: false,
      list: [],
      columns: [
        {
          name: 'code',
          label: t('common.code'),
          field: row => _.get(row, 'code', ' - '),
          align: 'left'
        },
        {
          name: 'unitPrice',
          label: t('common.unitPrice'),
          field: row => formatCurrency(row?.unitPrice),
          align: 'left'
        },
        {
          name: 'qty',
          label: t('common.qty'),
          field: row => _.get(row, 'qty', 0),
          align: 'left'
        },
        {
          name: 'total',
          label: t('common.total'),
          field: row => formatCurrency(row?.total),
          align: 'left'
        },
        {
          name: 'articleId',
          label: t('articles.entity'),
          field: row => _.get(row, 'article.name', ' - '),
          align: 'left'
        },
        {
          name: 'actions',
          label: t('common.actions'),
          type: 'actions',
          align: 'right'
        }
      ],
      pagination: STANDARD_PAGINATION,
      filterValues: {
        'code.$contains': undefined
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    onClickCreate () {
      this.$router.push({ name: 'receiptGroups', params: { receiptGroupId: 'new' } })
    },
    goToDetail (row) {
      this.$router.push({ name: 'receiptGroups', params: { receiptGroupId: row?._id } })
    },
    onClickDelete (row) {
      this.$q.dialog({
        component: ConfirmModal,
        componentProps: {
          title: this.$t('common.deleteName', { name: row.code }),
          text: this.$t('common.sureToDeleteElement'),
          onConfirm: async () => {
            await this.$axios.delete(`${this.entity}/${row?._id}`)
          },
          onSuccess: async () => {
            // TODO: non va filtro server su recepitId
            await this.onRequest()
            this.$emit('update')
            notify.success(this.$t('common.elementDeletedSuccess'))
          },
          onFailed: () => {}
        }
      })
    },
    async onRequest (props) {
      try {
        this.loading = true
        if (props) {
          props.pagination.limit = props?.pagination?.rowsPerPage >= 0
            ? props?.pagination?.rowsPerPage || undefined
            : this.pagination?.rowsPerPage
        }
        const queryParams = createParamsFromTableProps({ pagination: { ...props?.pagination || {}, ...this.pagination || {} } })
        const params = {
          ...this.filterValues,
          ...queryParams,
          recepitId: this.$route.params.id,
          sort: 'code'
        }
        const { data, headers } = await this.$axios.get(this.entity, { params })
        this.list = _.cloneDeepWith(data)
        if (props) {
          this.pagination = {
            ...props?.pagination,
            rowsNumber: Number(headers['odin-count'])
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  },
  computed: {},
  created () {
    this.onRequest()
  }
}
</script>

<style scoped lang="scss">

</style>
