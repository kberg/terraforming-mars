<template>
  <table class="discount-list">
    <tr v-for="(discount, idx) in discounts" :key="idx" :class="{'discount-list--conditional': discount.conditional}">
      <td class="discount-list-amount"><div class="megacredits">-{{ discount.amount }}</div></td>
      <td class="discount-list-applies-to">{{ discount.appliesTo }}</td>
      <td class="discount-list-source">{{ discount.source }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import {DiscountSource} from '@/client/components/overview/discounts';

defineProps<{
  discounts: ReadonlyArray<DiscountSource>;
}>();
</script>
