import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {all} from '../Options';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Tag} from '../../../common/cards/Tag';
import {PlayerId} from '../../../common/Types';
import {Resource} from '../../../common/Resource';

export class ClassActionLawsuit extends Card implements IProjectCard {
  public generationUsed: number = -1;

  // TODO(kberg): serialize 'extra'
  public extra: undefined | {
    target: PlayerId;
    diff: number;
  };

  constructor() {
    super({
      name: CardName.CLASS_ACTION_LAWSUIT,
      type: CardType.EVENT,
      cost: 25,
      tags: [Tag.MARS],

      behavior: {
        underworld: {markThisGeneration: {}},
      },

      metadata: {
        cardNumber: 'U82',
        renderData: CardRenderer.builder((b) => {
          b.plants(-2, {all}).asterix().corruption().asterix();
        }),
        description: 'Target the player with the single highest corruption. That player discards corruption to match the ' +
          '2nd highest player. After the next production phase, each other player steals 2 M€ from the target ' +
          'per unit of corruption removed this way.',
      },
    });
  }

  private getTarget(player: IPlayer) {
    let target: IPlayer | undefined = undefined;
    let min = 1;
    let current = -1;
    for (const p of player.game.getPlayers()) {
      const corruption = p.underworldData.corruption;
      if (corruption === current && target !== undefined) {
        target = undefined;
      } else if (corruption >= min) {
        if (target === undefined) {
          current = corruption;
          target = p;
        } else {
          target = undefined;
        }
        min = corruption + 1;
      }
    }
    return target;
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.getTarget(player) !== undefined;
  }

  public override bespokePlay(player: IPlayer) {
    const target = this.getTarget(player);
    if (target === undefined) {
      // Cannot happen.
      return undefined;
    }
    const secondHighest = Math.max(...player.game.getPlayers().map(
      (p) => (p === target) ? 0 : p.underworldData.corruption));
    const diff = target?.underworldData.corruption - secondHighest;
    this.extra = {
      target: target.id,
      diff: diff,
    };

    UnderworldExpansion.loseCorruption(target, diff, {log: true});
    return undefined;
  }

  public onProductionPhase(player: IPlayer) {
    if (this.generationUsed === player.game.generation) {
      if (this.extra === undefined) {
        return;
      }
      const target = player.game.getPlayerById(this.extra.target);
      const mc = this.extra.diff * 2;
      for (const p of player.game.getPlayers()) {
        if (p.id !== target.id) {
          target.stock.steal(Resource.MEGACREDITS, mc, p);
          // STEAL
        }
      }
    }
    return undefined;
  }
}
