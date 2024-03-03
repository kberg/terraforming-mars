import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {all} from '../Options';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';

export class MercenaryAssault extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MERCENARY_ASSAULT,
      type: CardType.EVENT,
      cost: 7,
      tags: [Tag.SPACE],

      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U83',
        renderData: CardRenderer.builder((b) => {
          b.minus().wild(1, {all}).asterix().br;
          b.corruptionShield().colon().text('min 2').corruption();
        }),
        description: 'Requires 1 corruption. Target 1 resources on a card of a player with more corruption than you. ' +
          'Discard it. If the owner wants to block this with corruption, they must spend at least 2 corruption.',
      },
    });
  }

  private getTargets(player: IPlayer) {
    return player.getOpponents()
      .filter((p) => p.underworldData.corruption > player.underworldData.corruption)
      .filter((p) => p.getCardsWithResources()
        .some((card) => card.protectedResources !== true));
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.getTargets(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new RemoveResourcesFromCard(player, undefined, 1, {source: this.getTargets(player)}));
    return undefined;
  }
}
