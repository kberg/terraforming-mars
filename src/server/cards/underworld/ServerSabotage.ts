import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {all, digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardResource} from '../../../common/CardResource';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {inplaceShuffle} from '../../utils/shuffle';

export class ServerSabotage extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SERVER_SABOTAGE,
      cost: 7,

      behavior: {
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U47',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): Use icon.
          b.corruption(1).data({amount: -2, digit, all}).br.text('Remove unclaimed tokens');
        }),
        description: 'Gain 1 corruption. Remove 2 data from any player. Remove all unclaimed underground resources ' +
          'from the board back into the pile. Their spaces can be identified again.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.isSoloMode()) {
      return true;
    }
    return RemoveResourcesFromCard.getAvailableTargetCards(player, CardResource.DATA).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.defer(new RemoveResourcesFromCard(player, CardResource.DATA, 2));
    if (game.underworldData === undefined) {
      return;
    }
    for (const space of UnderworldExpansion.identifiedSpaces(player.game)) {
      if (space.undergroundResources !== undefined && space.excavator === undefined) {
        game.underworldData.tokens.push(space.undergroundResources);
        space.undergroundResources = undefined;
      }
    }
    inplaceShuffle(game.underworldData.tokens, game.rng);
    game.log('All unidentified underground resources have been shuffled back into the pile.');
    return undefined;
  }
}