<template>
  <q-page padding>
    <PageHeader :title="$t('common.dashboard')"/>
    <div class="row q-col-gutter-md">
      <Select
        :label="$t('offices.entity')"
        :options="options.offices"
        v-model="filters.officeId"
        option-label="name"
        option-value="_id"
        map-options
        emit-value
        class="col-4"
        @update:modelValue="onUpdateValue"
      />
      <Select
        :label="$t('common.year')"
        :options="options.years"
        v-model="filters.year"
        map-options
        emit-value
        class="col-4"
        @update:modelValue="onUpdateValue"
      />
      <Select
        :label="$t('common.month')"
        :options="options.months"
        v-model="filters.month"
        map-options
        emit-value
        class="col-4"
        @update:modelValue="onUpdateValue"
      />
    </div>
    <div class="row">
      <div class="col-12 q-mt-md">
        <div class="row q-col-gutter-sm">
          <div class="col-3">
            <div class="text-bold"> {{$t('common.totalRevenue')}} </div>
            <div> {{formatCurrency(data.totalRevenue)}}</div>
          </div>
          <div class="col-3">
            <div class="text-bold"> {{$t('common.totalReceipts')}}</div>
            <div> {{data.totalReceipts}}</div>
          </div>
        </div>
      </div>
      <div class="col-12 q-mt-md text-bold">
        {{$t('common.revenueByDayInMonth')}}
        <canvas id="revenue-by-days" style="max-height: 35rem"/>
      </div>
      <div class="col-12 q-mt-md text-bold">
        {{$t('common.numberOfReceiptByDayInMonth')}}
        <canvas id="receipts-by-days" style="max-height: 35rem"/>
      </div>
      <div class="col-12 q-mt-md text-bold">
        {{$t('common.revenueByOperatorInMonth')}}
      </div>
      <div class="col-12 q-mt-sm text-bold">
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <canvas id="revenue-by-operator-pie" style="max-height: 25rem"/>
          </div>
          <div class="col-6">
            <canvas id="revenue-by-operator-bar" style="max-height: 35rem"/>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import PageHeader from 'components/ui/PageHeader'
import Select from 'components/ui/Select'
import { DateTime } from 'luxon'
import { cloneDeepWith } from 'lodash'
import Chart from 'chart.js/auto'
import { formatCurrency, generateRandomColorFromString, getNameSurname } from 'src/utils'

export default {
  name: 'Dashboard',
  components: { PageHeader, Select },
  data () {
    return {
      options: {
        offices: [],
        months: [
          { label: 'Gennaio', value: 1 },
          { label: 'Febbraio', value: 2 },
          { label: 'Marzo', value: 3 },
          { label: 'Aprile', value: 4 },
          { label: 'Maggio', value: 5 },
          { label: 'Giugno', value: 6 },
          { label: 'Luglio', value: 7 },
          { label: 'Agosto', value: 8 },
          { label: 'Settembre', value: 9 },
          { label: 'Ottobre', value: 10 },
          { label: 'Novembre', value: 11 },
          { label: 'Dicembre', value: 12 }
        ],
        years: [
          { label: '2023', value: 2023 },
          { label: '2022', value: 2022 }
        ]
      },
      filters: {
        officeId: undefined,
        year: DateTime.now().year,
        month: (DateTime.now().month)
      },
      data: {
        operators: [],
        officeResult: [],
        operatorResult: [],
        totalRevenue: 1200,
        totalReceipts: 0
      },
      charts: []
    }
  },
  methods: {
    formatCurrency,
    async getOffices () {
      const { data } = await this.$axios.get('/offices')
      this.options.offices = data
      this.filters.officeId = data[0]?._id
    },
    async getData () {
      const { officeId, year, month } = this.filters
      if (!officeId) return
      const date = DateTime.fromObject({ year, month })
      const params = { fromDate: date.startOf('month').toISODate(), toDate: date.endOf('month').toISODate() }
      const [{ data: dashboard }, { data: operators }] = await Promise.all([
        this.$axios.get(`/offices/${officeId}/dashboard`, { params }),
        this.$axios.get('/users', { params: { officeId } })
      ])
      this.data = cloneDeepWith({ ...dashboard, operators })
      this.data.totalRevenue = this.data.officeResult[0]?.daysData?.reduce((acc, day) => acc + day?.total || 0, 0)
      this.data.totalReceipts = this.data.officeResult[0]?.daysData?.reduce((acc, day) => acc + day?.numberOfRecepits || 0, 0)
      this.charts.forEach(c => c.destroy())
      await this.$nextTick(() => {
        this.drawRevenueByDayInMonth()
        this.drawNumberOfReceiptByDayInMonth()
        this.drawRevenueByOperatorInMonth()
      })
    },
    drawRevenueByDayInMonth () {
      const { officeResult } = this.data
      const ctx = document.getElementById('revenue-by-days').getContext('2d')
      const date = DateTime.fromObject({ year: this.filters.year, month: this.filters.month }).startOf('month')
      const daysInMonth = date.daysInMonth
      const chart = new Chart(
        ctx,
        {
          type: 'bar',
          data: {
            labels: [...Array(daysInMonth).keys()].map(i => i + 1),
            datasets: [
              {
                label: '€',
                data: [...Array(daysInMonth).keys()].map(i => {
                  const day = date.plus({ days: i }).toISODate()
                  const result = officeResult[0].daysData?.find(r => r._id === day)
                  return ((result?.total || 0) / 100).toFixed(2)
                })
              }
            ]
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            }
          }
        }
      )
      this.charts.push(chart)
    },
    drawNumberOfReceiptByDayInMonth () {
      const { officeResult } = this.data
      const ctx = document.getElementById('receipts-by-days').getContext('2d')
      const date = DateTime.fromObject({ year: this.filters.year, month: this.filters.month }).startOf('month')
      const daysInMonth = date.daysInMonth
      const chart = new Chart(
        ctx,
        {
          type: 'bar',
          data: {
            labels: [...Array(daysInMonth).keys()].map(i => i + 1),
            datasets: [
              {
                label: '',
                data: [...Array(daysInMonth).keys()].map(i => {
                  const day = date.plus({ days: i }).toISODate()
                  const result = officeResult[0].daysData?.find(r => r._id === day)
                  return result?.numberOfRecepits || 0
                })
              }
            ]
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            }
          }
        }
      )
      this.charts.push(chart)
    },
    drawRevenueByOperatorInMonth () {
      const { operatorResult } = this.data
      const ctxPie = document.getElementById('revenue-by-operator-pie').getContext('2d')
      const ctxBar = document.getElementById('revenue-by-operator-bar').getContext('2d')
      const config = {
        data: {
          labels: this.data.operators.map(getNameSurname),
          datasets: [
            {
              label: '€',
              data: this.data.operators.map((user, i) => {
                return ((operatorResult.find(r => r.operatorId === user._id)?.total || 0) / 100).toFixed(2)
              }),
              maxBarThickness: 30,
              backgroundColor: this.data.operators.map(user => generateRandomColorFromString(user._id))
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }
      const chartPie = new Chart(
        ctxPie,
        {
          ...config,
          type: 'pie'
        }
      )
      const chartBar = new Chart(
        ctxBar,
        {
          ...config,
          type: 'bar'
        }
      )
      this.charts.push(chartPie)
      this.charts.push(chartBar)
    },
    async onUpdateValue () {
      await this.getData()
    }
  },
  computed: {},
  async created () {
    await this.getOffices()
    await this.getData()
  }
}
</script>

<style scoped lang="scss">

</style>
