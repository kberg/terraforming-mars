import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardRenderer} from '../render/CardRenderer';
import {DrawCards} from '../../deferredActions/DrawCards';
import {Card} from '../Card';
import {all, digit} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class SponsoredAcademies extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SPONSORED_ACADEMIES,
      type: CardType.AUTOMATED,
      tags: [Tag.EARTH, Tag.SCIENCE],
      cost: 9,

      victoryPoints: 1,

      metadata: {
        cardNumber: '247',
        renderData: CardRenderer.builder((b) => {
          b.minus().cards(1).br;
          b.plus().cards(3, {digit}).asterix().nbsp.plus().cards(1, {all}).asterix();
        }),
        description: 'Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card.',
      },
    });
  }
  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.cardsInHand.length >= 2;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DiscardCards(player), Priority.SPONSORED_ACADEMIES).andThen(() => {});
    player.game.defer(DrawCards.keepAll(player, 3), Priority.SPONSORED_ACADEMIES);
    for (const p of player.opponents) {
      player.game.defer(DrawCards.keepAll(p));
    }
    return undefined;
  }
}
