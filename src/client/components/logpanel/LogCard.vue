<template>
  <span v-if="className" class="log-card" :class="className">
    <span v-i18n>{{ suffixFreeCardName }}</span>
    <template v-if="card !== undefined">
      <template v-if="showTags">&nbsp;<div v-for="(tag, idx) in card.tags" :key="idx" class="log-tag" :class="'tag-' + tag"></div></template>
      <span v-if="showCost">&nbsp;<div class="log-resource-megacredits">{{ card.cost }}</div></span>
    </template>
  </span>
  <span v-else-if="card">{{ suffixFreeCardName }}</span>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {getCard} from '@/client/cards/ClientCardManifest';
import {ClientCard} from '@/common/cards/ClientCard';

const cardTypeToCss: Record<CardType, string | undefined> = {
  event: 'background-color-events',
  corporation: 'background-color-corporation',
  active: 'background-color-active',
  automated: 'background-color-automated',
  prelude: 'background-color-prelude',
  ceo: 'background-color-ceo',
  standard_project: 'background-color-standard-project',
  standard_action: 'background-color-standard-project',
  proxy: undefined,
};

export default defineComponent({
  name: 'LogCard',
  props: {
    cardName: {
      type: String as unknown as () => CardName,
      required: true,
    },
    showTags: {
      type: Boolean,
      default: false,
    },
    showCost: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    card(): ClientCard | undefined {
      // Don't use getCardOrThrow. No need to fail to render the log if a card does not exist.
      return getCard(this.cardName);
    },
    suffixFreeCardName(): string {
      return this.card?.name.split(':')[0] ?? '';
    },
    className(): string | undefined {
      return this.card ? cardTypeToCss[this.card.type] : undefined;
    },
  },
});
</script>
