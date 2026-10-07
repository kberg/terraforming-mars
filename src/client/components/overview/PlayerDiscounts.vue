<!-- A button that shows every discount the player has. -->
<template>
  <div class="player-discounts">
    <button class="player-discounts-button" :title="$t('Discounts')" @click="open = !open">
      <div class="megacredits">%</div>
    </button>
    <div v-if="open" class="player-discounts-popover">
      <div class="player-discounts-title" v-i18n>Discounts</div>
      <DiscountList :discounts="discounts"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {DiscountSource} from '@/client/components/overview/discounts';
import DiscountList from '@/client/components/overview/DiscountList.vue';

defineProps<{
  discounts: ReadonlyArray<DiscountSource>;
}>();

const open = ref(false);
</script>
