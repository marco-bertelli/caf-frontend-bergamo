<template>
  <q-card flat class="table-card">
    <div class="table-card__head">
      <slot name="title" />
      <slot name="filters" />
    </div>
    <q-table
      class="br-md"
      flat
      square
      ref="table"
      row-key="_id"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :rows="records"
      @request="props => $emit('request', props)"
      @update:pagination="(v)=> $emit('update:pagination', v)"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="column in props.cols"
            :key="column.name"
            :props="props"
          >
            <slot :name="column.name" :row="props.row" :scope="props">
              <div class="ellipsis">
                {{ column.value }}
              </div>
            </slot>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>
<script>

export default {
  name: 'Table',
  emits: ['request', 'update:pagination'],
  props: {
    records: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        rowsPerPage: 10
      })
    },
    loading: Boolean
  }
}
</script>

<style scoped lang="scss">
.table-card {
  overflow: hidden;
}
.table-card__head {
  padding: 1rem 1rem 0;
  :deep(.text-h6) {
    font-weight: 700;
  }
}
</style>
