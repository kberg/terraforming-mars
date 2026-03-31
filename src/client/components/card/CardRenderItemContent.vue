<template>
  <!-- Generic content: innerText, amount, clone — only for non-override types -->
  <template v-if="!hasOverriddenContent">
    <template v-if="isItem && item.innerText">{{ item.innerText }}</template>
    <template v-else-if="isItem && item.amountInside">
      <template v-if="item.amount !== 0">{{ item.amount }}</template>
      <div v-if="item.clone" style="-webkit-filter: greyscale(100%);filter: grayscale(100%)">&#x1FA90;</div>
    </template>
  </template>

  <!-- Secondary tag icon -->
  <div v-if="hasSecondaryTagIcon" class="card-icon" :class="'card-tag-' + item.secondaryTag"></div>

  <!-- Plate / text -->
  <template v-if="!hasOverriddenContent && (item.isPlate || item.text !== undefined)">{{ item.text || 'n/a' }}</template>

  <!-- Type-specific component -->
  <component v-if="typeComponent" :is="typeComponent" />

  <!-- Simple text overrides (no component needed) -->
  <template v-else-if="item.type === CardRenderItemType.MULTIPLIER_WHITE">X</template>
  <template v-else-if="item.type === CardRenderItemType.MEGACREDITS && item.amount === undefined">?</template>

  <!-- Cancelled overlay -->
  <div v-if="showCancelledX" class="card-x">x</div>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {Tag} from '@/common/cards/Tag';
import {ICardRenderItem, isICardRenderItem} from '@/common/cards/render/Types';
import CardItemIgnoreGlobalReqs from './CardItemIgnoreGlobalReqs.vue';
import CardItemSelfReplicating from './CardItemSelfReplicating.vue';
import CardItemColonyTile from './CardItemColonyTile.vue';
import CardItemPrelude from './CardItemPrelude.vue';
import CardItemCorporation from './CardItemCorporation.vue';
import CardItemFirstPlayer from './CardItemFirstPlayer.vue';
import CardItemRulingParty from './CardItemRulingParty.vue';
import CardItemAward from './CardItemAward.vue';
import CardItemMilestone from './CardItemMilestone.vue';
import CardItemVP from './CardItemVP.vue';

const TYPE_COMPONENTS: Partial<Record<CardRenderItemType, Component>> = {
  [CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS]: CardItemIgnoreGlobalReqs,
  [CardRenderItemType.SELF_REPLICATING]: CardItemSelfReplicating,
  [CardRenderItemType.COLONY_TILE]: CardItemColonyTile,
  [CardRenderItemType.PRELUDE]: CardItemPrelude,
  [CardRenderItemType.CORPORATION]: CardItemCorporation,
  [CardRenderItemType.FIRST_PLAYER]: CardItemFirstPlayer,
  [CardRenderItemType.RULING_PARTY]: CardItemRulingParty,
  [CardRenderItemType.AWARD]: CardItemAward,
  [CardRenderItemType.MILESTONE]: CardItemMilestone,
  [CardRenderItemType.VP]: CardItemVP,
};

const CONTENT_OVERRIDE_TYPES = new Set<CardRenderItemType>([
  CardRenderItemType.MULTIPLIER_WHITE,
  CardRenderItemType.SELF_REPLICATING,
  CardRenderItemType.COLONY_TILE,
  CardRenderItemType.PRELUDE,
  CardRenderItemType.CORPORATION,
  CardRenderItemType.FIRST_PLAYER,
  CardRenderItemType.RULING_PARTY,
  CardRenderItemType.AWARD,
  CardRenderItemType.MILESTONE,
  CardRenderItemType.VP,
]);

const PREVIOUSLY_RENDERED: ReadonlyArray<Tag | AltSecondaryTag> = [
  AltSecondaryTag.OXYGEN,
  AltSecondaryTag.MOON_HABITAT_RATE,
  AltSecondaryTag.MOON_MINING_RATE,
  AltSecondaryTag.MOON_LOGISTICS_RATE,
];

const CANCELLABLE_TYPES = new Set<CardRenderItemType>([
  CardRenderItemType.TR,
  CardRenderItemType.WILD,
  CardRenderItemType.UNDERGROUND_RESOURCES,
  CardRenderItemType.TRADE,
]);

export default defineComponent({
  name: 'CardRenderItemContent',
  components: {
    CardItemIgnoreGlobalReqs,
    CardItemSelfReplicating,
    CardItemColonyTile,
    CardItemPrelude,
    CardItemCorporation,
    CardItemFirstPlayer,
    CardItemRulingParty,
    CardItemAward,
    CardItemMilestone,
    CardItemVP,
  },
  props: {
    item: {
      type: Object as () => ICardRenderItem,
      required: true,
    },
  },
  computed: {
    isItem(): boolean {
      return isICardRenderItem(this.item);
    },
    typeComponent(): Component | undefined {
      return TYPE_COMPONENTS[this.item.type];
    },
    hasOverriddenContent(): boolean {
      if (CONTENT_OVERRIDE_TYPES.has(this.item.type)) return true;
      if (this.showCancelledX) return true;
      if (this.item.type === CardRenderItemType.MEGACREDITS && this.item.amount === undefined) return true;
      return false;
    },
    hasSecondaryTagIcon(): boolean {
      const secondaryTag = this.item.secondaryTag;
      return secondaryTag !== undefined && !PREVIOUSLY_RENDERED.includes(secondaryTag);
    },
    showCancelledX(): boolean {
      return this.item.cancelled === true && CANCELLABLE_TYPES.has(this.item.type);
    },
    CardRenderItemType(): typeof CardRenderItemType {
      return CardRenderItemType;
    },
  },
});
</script>
