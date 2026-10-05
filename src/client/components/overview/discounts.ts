import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {GameModel} from '@/common/models/GameModel';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {PartyName} from '@/common/turmoil/PartyName';

export type DiscountSource = {
  /** The card or effect that gives the discount. */
  source: string;
  /** The M€ discount. */
  amount: number;
  /** A short description of which cards the discount applies to. */
  appliesTo: string;
  /** True when the discount can't be described by a tag (e.g. cards with requirements.) */
  conditional: boolean;
};

/**
 * Lists every project card discount a player has.
 */
export function getDiscounts(player: PublicPlayerModel, game: GameModel): Array<DiscountSource> {
  const discounts: Array<DiscountSource> = [];

  for (const card of player.tableau) {
    for (const discount of card.discount ?? []) {
      if (discount.amount === 0) {
        continue;
      }
      let appliesTo = discount.tag === undefined ? 'all cards' : `${discount.tag} cards`;
      if (discount.per === 'tag' && discount.tag !== undefined) {
        appliesTo = `each ${discount.tag} tag`;
      }
      discounts.push({source: card.name, amount: discount.amount, appliesTo, conditional: false});
    }

    switch (card.name) {
    case CardName.CUTTING_EDGE_TECHNOLOGY:
      discounts.push({source: card.name, amount: 2, appliesTo: 'cards with requirements', conditional: true});
      break;
    case CardName.XAVIER:
      if (card.isDisabled) {
        discounts.push({source: card.name, amount: 1, appliesTo: 'cards with requirements', conditional: true});
      }
      break;
    case CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS:
      const amount = Math.floor((card.resources ?? 0) / 2);
      if (amount > 0) {
        discounts.push({source: card.name, amount, appliesTo: 'space cards without planetary tags', conditional: true});
      }
      break;
    }
  }

  if (player.cardDiscount > 0) {
    discounts.push({source: 'Iapetus', amount: player.cardDiscount, appliesTo: 'all cards (this generation)', conditional: false});
  }

  if (game.turmoil?.ruling === PartyName.UNITY && game.turmoil.politicalAgendas?.unity.policyId === 'up04') {
    discounts.push({source: 'Unity policy', amount: 2, appliesTo: `${Tag.SPACE} cards`, conditional: false});
  }

  return discounts;
}
