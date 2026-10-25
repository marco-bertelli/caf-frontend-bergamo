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
        class="col-12 col-sm-4"
        @update:modelValue="onUpdateValue"
      />
      <Select
        :label="$t('common.year')"
        :options="options.years"
        v-model="filters.year"
        map-options
        emit-value
        class="col-12 col-sm-4"
        @update:modelValue="onUpdateValue"
      />
      <Select
        :label="$t('common.month')"
        :options="options.months"
        v-model="filters.month"
        map-options
        emit-value
        class="col-12 col-sm-4"
        @update:modelValue="onUpdateValue"
      />
    </div>
    <div class="row q-col-gutter-md q-mt-xs">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="kpi-card">
          <div class="kpi-icon"><q-icon name="fas fa-euro-sign"/></div>
          <div>
            <div class="kpi-label"> {{$t('common.totalRevenue')}} </div>
            <div class="kpi-value"> {{formatCurrency(data.totalRevenue)}}</div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="kpi-card">
          <div class="kpi-icon"><q-icon name="fas fa-file-invoice"/></div>
          <div>
            <div class="kpi-label"> {{$t('common.totalReceipts')}}</div>
            <div class="kpi-value"> {{data.totalReceipts}}</div>
          </div>
        </q-card>
      </div>
      <div class="col-12">
        <q-card flat class="chart-card">
          <div class="chart-title">{{$t('common.revenueByDayInMonth')}}</div>
          <canvas id="revenue-by-days" style="max-height: 35rem"/>
        </q-card>
      </div>
      <div class="col-12">
        <q-card flat class="chart-card">
          <div class="chart-title">{{$t('common.numberOfReceiptByDayInMonth')}}</div>
          <canvas id="receipts-by-days" style="max-height: 35rem"/>
        </q-card>
      </div>
      <div class="col-12">
        <q-card flat class="chart-card">
          <div class="chart-title">{{$t('common.revenueByOperatorInMonth')}}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <canvas id="revenue-by-operator-pie" style="max-height: 25rem"/>
            </div>
            <div class="col-12 col-md-6">
              <canvas id="revenue-by-operator-bar" style="max-height: 35rem"/>
            </div>
          </div>
        </q-card>
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

Chart.defaults.font.family = "'Inter', 'Roboto', sans-serif"
Chart.defaults.color = '#6B7685'
const BAR_STYLE = { backgroundColor: '#2B5B84', borderRadius: 6, maxBarThickness: 28 }

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
                ...BAR_STYLE,
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
                ...BAR_STYLE,
                backgroundColor: '#5B7D9A',
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
              borderRadius: 6,
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
.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  height: 100%;
}
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: $primary;
  background-color: rgba($primary, 0.1);
  flex-shrink: 0;
}
.kpi-label {
  font-size: 0.8rem;
  color: $textMuted;
  font-weight: 500;
}
.kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.chart-card {
  padding: 1.25rem;
}
.chart-title {
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
