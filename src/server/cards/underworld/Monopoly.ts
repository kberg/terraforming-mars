import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {SelectResource} from '../../inputs/SelectResource';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Units} from '../../../common/Units';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class Monopoly extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MONOPOLY,
      cost: 12,
      requirements: {corruption: 3},
      victoryPoints: -2,

      metadata: {
        cardNumber: 'U65',
        renderData: CardRenderer.builder((b) => {
          b.text('STEAL').production((pb) => pb.wild(1, {all})).br;
        }),
        description: 'Requires 3 corruption. Choose a standard production type. ' +
          'Steal 1 unit of that production from EACH OTHER player. They can block this with corruption.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectResource(
      'Select which resource type to steal from all other players.',
      Units.keys,
      (unitKey) => {
        const resource = Units.ResourceMap[unitKey];
        if (player.game.isSoloMode()) {
          player.production.add(resource, 1, {log: true});
          return undefined;
        }
        const targets = player.game.getPlayers().filter((p) => p.canHaveProductionReduced(resource, 1, player));
        for (const target of targets) {
          if (target !== player) {
            this.attack(target, player, resource);
          }
        }
        return undefined;
      });
  }

  public attack(target: IPlayer, attacker: IPlayer, resource: Resource) {
    return UnderworldExpansion.mayBlockAttack(target, attacker, (proceed: boolean) => {
      if (proceed) {
        target.production.add(resource, -1, {log: true, from: attacker, stealing: true});
        attacker.production.add(resource, 1, {log: false});
      }
      return undefined;
    });
  }
}

