import Vue from 'vue';
import {Button} from '../components/common/Button';
import {Message} from '../Message';
import {CardOrderStorage} from './CardOrderStorage';
import {PlayerModel} from '../models/PlayerModel';
import {VueModelCheckbox, VueModelRadio} from './VueTypes';
import {Card} from './card/Card';
import {CardModel} from '../models/CardModel';
import {CardName} from '../CardName';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {sortActiveCards} from '../components/ActiveCardsSortingOrder';
import {TranslateMixin} from './TranslateMixin';
import {Color} from '../Color';
import {CardType} from '../cards/CardType';

interface SelectCardModel {
  cards: VueModelRadio<CardModel> | VueModelCheckbox<Array<CardModel>>;
  warning: string | Message | undefined;
}

export interface OwnerModel {
  name: string;
  color: Color;
}

export const SelectCard = Vue.component('select-card', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data: function() {
    let cards: CardModel[] = [];

    // This preselects the first standard action, so that the player can click Confirm to immediately do the action
    // However it does not apply the input[type="radio"]:checked + .filterDiv class, so a workaround was done using isChecked property
    if (this.playerinput.cards !== undefined && this.playerinput.cards[0].cardType === CardType.STANDARD_ACTION) {
      cards = [this.playerinput.cards[0]];
    }

    return {
      cards: cards,
      warning: undefined,
    } as SelectCardModel;
  },
  components: {
    Card,
    Button,
  },
  mixins: [TranslateMixin],
  watch: {
    cards: function() {
      this.$emit('cardschanged', this.getData());
    },
  },
  methods: {
    cardsSelected: function(): number {
      if (Array.isArray(this.cards)) {
        return this.cards.length;
      } else if (this.cards === false || this.cards === undefined) {
        return 0;
      }
      return 1;
    },
    getOrderedCards: function() {
      if (this.playerinput.cards === undefined) {
        return [];
      }
      if (this.playerinput.selectBlueCardAction) {
        return sortActiveCards(this.playerinput.cards);
      } else {
        return CardOrderStorage.getOrdered(
          CardOrderStorage.getCardOrder(this.player.id),
          this.playerinput.cards,
        );
      }
    },
    hasCardWarning: function() {
      if (Array.isArray(this.cards)) {
        return false;
      } else if (typeof this.cards === 'object' && this.cards.warning !== undefined) {
        this.warning = this.cards.warning;
        return true;
      }
      return false;
    },
    isOptionalToManyCards: function(): boolean {
      return this.playerinput.maxCardsToSelect !== undefined &&
             this.playerinput.maxCardsToSelect > 1 &&
             this.playerinput.minCardsToSelect === 0;
    },
    getData: function(): Array<CardName> {
      return Array.isArray(this.$data.cards) ? this.$data.cards.map((card) => card.name) : [this.$data.cards.name];
    },
    saveData: function() {
      this.onsave([this.getData()]);
    },
    getCardBoxClass: function(card: CardModel): string {
      if (this.playerinput.showOwner && this.getOwner(card) !== undefined) {
        return 'cardbox cardbox-with-owner-label';
      }
      return 'cardbox';
    },
    getOwner: function(card: CardModel): OwnerModel | undefined {
      for (const player of this.player.players) {
        if (player.playedCards.find((c) => c.name === card.name) || player.corporationCards.some((corp) => corp.name === card.name)) {
          return {name: player.name, color: player.color};
        }
      }
      return undefined;
    },
    robotCard(card: CardModel): CardModel | undefined {
      return this.player.selfReplicatingRobotsCards?.find((r) => r.name === card.name);
    },
    isChecked: function(index: number, card: CardModel): boolean {
      const isPreselectedStandardAction = index === 0 && card.cardType === CardType.STANDARD_ACTION;
      if (!isPreselectedStandardAction) return false;

      if (this.$data.cards[0] === undefined) {
        return card.name === this.$data.cards.name;
      } else {
        return card.name === this.$data.cards[0].name;
      }
    },
  },
  template: `<div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <label v-for="(card, index) in getOrderedCards()" :key="card.name" :class="getCardBoxClass(card)">
            <template v-if="!card.isDisabled">
              <input v-if="playerinput.maxCardsToSelect === 1 && playerinput.minCardsToSelect === 1" type="radio" v-model="cards" :value="card" />
              <input v-else type="checkbox" v-model="cards" :value="card" :disabled="playerinput.maxCardsToSelect !== undefined && Array.isArray(cards) && cards.length >= playerinput.maxCardsToSelect && cards.includes(card) === false" />
            </template>
            <Card v-if="playerinput.showOwner && getOwner(card) !== undefined" :card="card" :owner="getOwner(card)" :robotCard="robotCard(card)" :isChecked="isChecked(index, card)" />
            <Card v-else :card="card" :robotCard="robotCard(card)" :isChecked="isChecked(index, card)"/>
        </label>
        <div v-if="hasCardWarning()" class="card-warning">{{ $t(warning) }}</div>
        <div v-if="showsave === true" class="nofloat">
            <Button :disabled="isOptionalToManyCards() && cardsSelected() === 0" type="submit" :onClick="saveData" :title="playerinput.buttonLabel" />
            <Button :disabled="isOptionalToManyCards() && cardsSelected() > 0" v-if="isOptionalToManyCards()" :onClick="saveData" type="submit" :title="$t('Skip this action')" />
        </div>
    </div>`,
});
