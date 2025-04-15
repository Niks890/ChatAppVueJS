<script setup>
import AnalyticsCongratulations from '../admin/dashboard/AnalyticsCongratulations.vue'


// 👉 Images
import chart from '@images/cards/chart-success.png'
import card from '@images/cards/credit-card-primary.png'
import paypal from '@images/cards/paypal-error.png'
import wallet from '@images/cards/wallet-info.png'
</script>

<template>
  <VRow>
    <!-- 👉 Congratulations -->
    <VCol cols="12" md="8">
      <AnalyticsCongratulations />
    </VCol>

    <VCol cols="12" sm="4">
      <VRow>
        <!-- 👉 Profit -->
        <VCol cols="12" md="6">
          <CardStatisticsVertical v-bind="{
            title: 'Profit',
            image: chart,
            stats: '$12,628',
            change: 72.80,
          }" />
        </VCol>

        <!-- 👉 Sales -->
        <VCol cols="12" md="6">
          <CardStatisticsVertical v-bind="{
            title: 'Sales',
            image: wallet,
            stats: '$4,679',
            change: 28.42,
          }" />
        </VCol>
      </VRow>
    </VCol>

    <VCol cols="12" sm="8" md="4" order="1" order-md="2">
      <VRow>
        <!-- 👉 Payments -->
        <VCol cols="12" sm="6">
          <CardStatisticsVertical v-bind="{
            title: 'Payments',
            image: paypal,
            stats: '$2,468',
            change: -14.82,
          }" />
        </VCol>

        <!-- 👉 Revenue -->
        <VCol cols="12" sm="6">
          <CardStatisticsVertical v-bind="{
            title: 'Transactions',
            image: card,
            stats: '$14,857',
            change: 28.14,
          }" />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
