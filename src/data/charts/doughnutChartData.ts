import { TDoughnutChartData } from '../types'
import { Ref } from 'vue'

export const profitBackground = '#154EC1'
export const expensesBackground = '#fff'
export const earningsBackground = '#ECF0F1'

export const doughnutChartData: TDoughnutChartData = {
  labels: ['-', '-'],
  datasets: [
    {
      label: 'Bulan ini',
      backgroundColor: [profitBackground, earningsBackground],
      data: [432, 167],
    },
  ],
}

export const oke = (label: Ref<string[]>, data: Ref<number[]>) => {
  const doughnutChartData: TDoughnutChartData = {
    labels: label.value,
    datasets: [
      {
        label: 'Bulan ini',
        backgroundColor: [profitBackground, earningsBackground],
        data: data.value,
      },
    ],
  }

  return doughnutChartData
}
