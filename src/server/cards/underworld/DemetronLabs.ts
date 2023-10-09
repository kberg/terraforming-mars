import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {intersection, sum} from '../../../common/utils/utils';
import {SelectSpace} from '../../inputs/SelectSpace';

export class DemetronLabs extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.DEMETRON_LABS,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 45,
      resourceType: CardResource.ANIMAL,

      behavior: {
        addResources: 3,
      },

      metadata: {
        cardNumber: 'UC02',
        description: 'You start with 45 M€ and 3 data resources on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).data({amount: 3, digit}).br;
          b.effect('After you identify 1 or more underground resources in a single action, put 1 data on this card.', (eb) => {
            eb.text('X').identify(1).startEffect.data({amount: 1});
          }).br;
          b.action('Remove 4 data from here to pick any unclaimed underground resource token from the board. ' +
             'Claim its bonus (including paying prices), then remove its token from the board. ' +
             'Keep it until the token pile runs out.', (ab) => {
            ab.megacredits(1).animals(1).startAction.animals(1).asterix();
          });
        }),
      },
    });
  }

  // This doesn't need to be serialized. It ensures this is only evaluated once per action.
  // When the server restarts, the player has to take an action anyway.
  private lastActionId = -1;
  onIdentification(identifyingPlayer: IPlayer, cardOwner: IPlayer) {
    const actionId = sum(identifyingPlayer.game.getPlayers().map((p) => p.actionsTakenThisGame));
    if (this.lastActionId !== actionId) {
      cardOwner.addResourceTo(this);
      this.lastActionId = actionId;
    }
  }

  public claimableSpaces(player: IPlayer) {
    return intersection(
      UnderworldExpansion.excavatableSpaces(player, true),
      UnderworldExpansion.identifiedSpaces(player.game));
  }
  public canAct(player: IPlayer): boolean {
    return this.resourceCount >= 4 && this.claimableSpaces(player).length > 0;
  }

  public action(player: IPlayer) {
    player.defer(new SelectSpace('', this.claimableSpaces(player))
      .andThen((space) => {
        const token = space.undergroundResources;
        if (token === undefined) {
          console.warn(`Error selecting spaces for ${player.id}`);
          return undefined;
        }
        UnderworldExpansion.grant(player, token);
        space.undergroundResources = undefined;
        return undefined;
      }),
    );
    return undefined;
  }
}
