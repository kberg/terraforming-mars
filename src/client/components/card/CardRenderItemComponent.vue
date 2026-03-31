<template>
  <div class="card-item-container">
    <div class="card-res-amount" v-if="item.showDigit">{{ amountAbs }}</div>
    <div :class="componentClasses" v-for="index in itemsToShow" :key="index">
      <CardRenderItemContent :item="item" />
    </div>
    <div class="card-over" v-if="item.over !== undefined">over {{item.over}}</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {Size} from '@/common/cards/render/Size';
import {ICardRenderItem} from '@/common/cards/render/Types';
import {cardResourceCSS} from '../common/cardResources';
import CardRenderItemContent from './CardRenderItemContent.vue';

export default defineComponent({
  name: 'CardRenderItemComponent',
  components: {CardRenderItemContent},
  props: {
    item: {
      type: Object as () => ICardRenderItem,
      required: true,
    },
  },
  methods: {
    sized(clazz: string, size: string | undefined) {
      return size !== undefined ? `${clazz}--${size}` : clazz;
    },
  },
  computed: {
    resourceClass(): string {
      return (this.item.resource === undefined) ? '' : cardResourceCSS[this.item.resource];
    },
    resourceSizeClass(): string {
      if (this.item.size !== undefined) {
        return 'card-resource-size--' + this.item.size;
      }
      return '';
    },
    tagClass(): string {
      if (this.item.tag === undefined) {
        return '';
      }
      return 'card-tag-' + this.item.tag.toLowerCase().replaceAll(' ', '-');
    },
    componentClasses(): ReadonlyArray<string> {
      const classes: Array<string> = [];
      if (this.item.isSuperscript) {
        classes.push('card-superscript');
      }

      classes.push(...this.componentClassArray);

      if (this.item.secondaryTag === AltSecondaryTag.NO_PLANETARY_TAG) {
        classes.push('tag-clone');
      }

      // act upon any player
      if (this.item.anyPlayer === true) {
        const type = this.item.type;
        if (type === CardRenderItemType.DELEGATES) {
          classes.push('card-delegate-red');
        } else if (type === CardRenderItemType.CHAIRMAN) {
          classes.push('card-chairman-red');
        } else {
          classes.push('red-outline');
        }
      }

      // golden background
      if (this.item.isPlate) {
        classes.push('card-plate');
        if (this.item.size === Size.SMALL) {
          classes.push('card-plate--narrow');
        }
      }

      // size and text
      if (this.item.text !== undefined) {
        classes.push(`card-text-size--${this.item.size}`);
        if (this.item.isUppercase) {
          classes.push('card-text-uppercase');
        }
        if (this.item.isBold) {
          classes.push('card-text-bold');
        } else {
          classes.push('card-text-normal');
        }
      }
      return classes;
    },
    componentClassArray(): Array<string> {
      let cardResource = 'card-resource';
      if (this.item.secondaryTag) {
        cardResource = 'card-resource--has-secondary-tag';
      } else if (this.item.isSuperscript) {
        cardResource = 'card-resource--superscript';
      }

      switch (this.item.type) {
      case CardRenderItemType.TEMPERATURE:
        return ['card-global-requirement', 'card-temperature-global-requirement'];
      case CardRenderItemType.OXYGEN:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return ['card-global-requirement', 'card-oxygen-global-requirement', `card-oxygen--${this.item.size}`];
        } else {
          return ['card-global-requirement', 'card-oxygen-global-requirement'];
        }
      case CardRenderItemType.OCEANS:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return ['card-global-requirement', 'card-ocean-global-requirement', `card-ocean--${this.item.size}`];
        } else {
          return ['card-global-requirement', 'card-ocean-global-requirement'];
        }
      case CardRenderItemType.VENUS:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return ['card-global-requirement', 'card-venus-global-requirement', `card-venus--${this.item.size}`];
        } else {
          return ['card-global-requirement', 'card-venus-global-requirement'];
        }
      case CardRenderItemType.TR:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return ['card-tile', 'card-tr', `card-tr--${this.item.size}`];
        } else {
          return ['card-tile', 'card-tr'];
        }
      case CardRenderItemType.TITANIUM:
        return [cardResource, 'card-resource-titanium'];
      case CardRenderItemType.STEEL:
        return [cardResource, 'card-resource-steel'];
      case CardRenderItemType.HEAT:
        return [cardResource, 'card-resource-heat'];
      case CardRenderItemType.ENERGY:
        return [cardResource, 'card-resource-energy'];
      case CardRenderItemType.PLANTS:
        return [cardResource, 'card-resource-plant'];
      case CardRenderItemType.MEGACREDITS:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return [cardResource, 'card-resource-money', `card-money--${this.item.size}`];
        } else {
          return [cardResource, 'card-resource-money'];
        }
      case CardRenderItemType.CARDS:
        return [cardResource, 'card-card'];
      case CardRenderItemType.WILD:
        if (this.item.cancelled === true) {
          return [cardResource, 'card-resource-wild', 'card-private-security'];
        } else {
          return [cardResource, 'card-resource-wild'];
        }
      case CardRenderItemType.ONE:
        return [cardResource, 'card-resource-one'];
      case CardRenderItemType.DIVERSE_TAG:
        return ['card-resource-tag', 'card-resource-diverse'];
      case CardRenderItemType.TRADE:
        if (this.item.size === Size.SMALL) {
          return ['card-resource-trade', 'card-resource-colony--S'];
        } else {
          return ['card-resource-trade'];
        }
      case CardRenderItemType.COLONIES:
        // TODO (chosta): think about an abstraction for item size
        if (this.item.size === Size.SMALL) {
          return ['card-resource-colony', 'card-resource-colony--S'];
        } else {
          return ['card-resource-colony'];
        }
      case CardRenderItemType.TRADE_DISCOUNT:
      case CardRenderItemType.MULTIPLIER_WHITE:
        return [cardResource, 'card-resource-trade-discount'];
      case CardRenderItemType.TRADE_FLEET:
        return ['card-resource-trade-fleet'];
      case CardRenderItemType.CHAIRMAN:
        return ['card-chairman'];
      case CardRenderItemType.PARTY_LEADERS:
        return ['card-party-leader'];
      case CardRenderItemType.DELEGATES:
        return ['card-delegate'];
      case CardRenderItemType.INFLUENCE:
        return ['card-influence', `card-influence--size-${this.item.size}`];
      case CardRenderItemType.NO_TAGS:
        return ['card-resource-tag', 'card-no-tags'];
      case CardRenderItemType.EMPTY_TAG:
        return ['card-resource-tag', 'card-tag-empty'];
      case CardRenderItemType.CITY:
        return ['card-tile', `city-tile--${this.item.size}`];
      case CardRenderItemType.GREENERY:
        if (this.item.secondaryTag === AltSecondaryTag.OXYGEN) {
          return ['card-tile', `greenery-tile-oxygen--${this.item.size}`];
        } else {
          return ['card-tile', `greenery-tile--${this.item.size}`];
        }
      case CardRenderItemType.EMPTY_TILE:
        if (this.item.size !== undefined) {
          return ['card-tile-ares', `board-space-tile--empty-tile--${this.item.size}`];
        } else {
          return ['card-tile-ares'];
        }
      case CardRenderItemType.EMPTY_TILE_GOLDEN:
        return ['card-tile-ares', 'board-space-tile--adjacency-tile'];
      case CardRenderItemType.EMPTY_TILE_SPECIAL:
        if (this.item.size !== undefined) {
          return ['card-tile', `special-tile--${this.item.size}`];
        } else {
          return ['card-tile', 'special-tile'];
        }
      case CardRenderItemType.CITY_OR_SPECIAL_TILE:
        return ['card-tile', 'city-or-special-tile'];
      case CardRenderItemType.COMMUNITY:
        return [cardResource, 'card-resource-community'];
      case CardRenderItemType.MOON_HABITAT:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_HABITAT_RATE) {
          return [this.sized('card-tile-lunar-habitat-rate', this.item.size)];
        } else {
          return [this.sized('card-tile-lunar-habitat', this.item.size)];
        }
      case CardRenderItemType.GLOBAL_EVENT:
        return ['turmoil-global-event'];
      case CardRenderItemType.POLICY:
        return ['turmoil-policy-tile'];

      // CEOs:
      case CardRenderItemType.ARROW_OPG:
        return ['card-arrow-opg'];
      case CardRenderItemType.REDS:
        return ['card-reds'];
      case CardRenderItemType.REDS_DEACTIVATED:
        return ['card-reds-deactivated'];
      case CardRenderItemType.ADJACENCY_BONUS:
        return ['card-adjacency-bonus'];
      case CardRenderItemType.HAZARD_TILE:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return [`card-hazard-tile--${this.item.size}`];
        } else {
          return ['card-hazard-tile'];
        }
      case CardRenderItemType.MOON_HABITAT_RATE:
        if (this.item.size !== undefined) {
          return ['card-habitat-rate', `card-habitat-rate--${this.item.size}`];
        } else {
          return ['card-habitat-rate'];
        }
      case CardRenderItemType.MOON_MINE:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_MINING_RATE) {
          return [this.sized('card-tile-lunar-mine-rate', this.item.size)];
        } else {
          return [this.sized('card-tile-lunar-mine', this.item.size)];
        }
      case CardRenderItemType.MOON_MINING_RATE:
        if (this.item.size !== undefined) {
          return ['card-mining-rate', `card-mining-rate--${this.item.size}`];
        } else {
          return ['card-mining-rate'];
        }
      case CardRenderItemType.MOON_ROAD:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_LOGISTICS_RATE) {
          return [this.sized('card-tile-lunar-road-rate', this.item.size)];
        } else {
          return [this.sized('card-tile-lunar-road', this.item.size)];
        }
      case CardRenderItemType.MOON_LOGISTICS_RATE:
        if (this.item.size !== undefined) {
          return ['card-logistics-rate', `card-logistics-rate--${this.item.size}`];
        } else {
          return ['card-logistics-rate'];
        }
      case CardRenderItemType.PLANETARY_TRACK:
        return ['card-planetary-track'];
      case CardRenderItemType.CATHEDRAL:
        return [cardResource, 'card-resource-cathedral'];
      case CardRenderItemType.NOMADS:
        return [cardResource, 'card-resource-nomads'];
      case CardRenderItemType.IDENTIFY:
        return ['card-identification'];
      case CardRenderItemType.EXCAVATE:
        return [this.item.isSuperscript ? 'card-excavation--superscript' : 'card-excavation'];
      case CardRenderItemType.CORRUPTION:
        return [cardResource, 'card-resource-corruption'];
      case CardRenderItemType.RESOURCE:
        return [cardResource, this.resourceClass, this.resourceSizeClass];
      case CardRenderItemType.TAG:
        return ['card-resource-tag', this.tagClass];
      case CardRenderItemType.NEUTRAL_DELEGATE:
        return ['card-neutral-delegate'];
      case CardRenderItemType.UNDERGROUND_RESOURCES:
        return ['card-underground-resources'];
      case CardRenderItemType.CORRUPTION_SHIELD:
        return ['card-corruption-shield'];
      case CardRenderItemType.GEOSCAN_ICON:
        return ['card-geoscan-icon'];
      case CardRenderItemType.UNDERGROUND_SHELTERS:
        return ['card-underground-shelters'];
      default:
        return [];
      }
    },
    amountAbs(): number {
      if (this.item.amountInside) return 1;
      return Math.abs(this.item.amount);
    },
    itemsToShow(): number {
      if (this.item.showDigit) return 1;
      return this.amountAbs;
    },
  },
});
</script>
