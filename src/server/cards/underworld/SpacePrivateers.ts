import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {all} from '../Options';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Resource} from '../../../common/Resource';

export class SpacePrivateers extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPACE_PRIVATEERS,
      cost: 10,
      tags: [Tag.SPACE],
      resourceType: CardResource.FIGHTER,
      victoryPoints: -2,
      requirements: {corruption: 3},

      behavior: {
        addResources: 3,
      },

      metadata: {
        cardNumber: 'U50',
        renderData: CardRenderer.builder((b) => {
          b.action('If there is at least 1 fighter on this card, steal 2 M€ from EACH OTHER player.',
            (ab) => ab.empty().startAction.fighter(1).asterix().colon().text('STEAL').megacredits(2, {all})).br;
          b.effect(
            'If 1 or more targets block this with corruption, remove 1 fighter from here.',
            (eb) => eb.corruptionShield().startEffect.minus().fighter()).br;
          b.plainText('(Solo: Gain 2 M€ and remove 1 fighter from this card.)');
        }),
        description: 'Requires 3 corruption. Put 3 fighter resources on this card.',
      },
    });
  }
  public data = {
    action: 0,
    rejected: false,
  };

  canAct(): boolean {
    return this.resourceCount > 0;
  }
  action(player: IPlayer): PlayerInput | undefined {
    if (player.game.isSoloMode()) {
      player.stock.add(Resource.MEGACREDITS, 2, {log: true});
      this.resourceCount--;
      player.resolveInsuranceInSoloGame();
      return undefined;
    }

    // If a player is Mons Insurance, this probably won't go in preferred player order.
    // TODO(kberg): devise a Mons Insurance solution.
    const targets = player.game.getPlayers().filter((p) => p !== player);
    for (const target of targets) {
      this.attack(target, player);
    }
    return undefined;
  }

  public attack(target: IPlayer, attacker: IPlayer) {
    target.defer(UnderworldExpansion.mayBlockAttack(target, attacker, (proceed: boolean) => {
      if (proceed) {
        target.stock.steal(Resource.MEGACREDITS, 2, attacker, {log: true});
        target.resolveInsurance();
      }
      return undefined;
    }));
  }
}
