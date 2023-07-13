import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {Size} from '../render/Size';
import {Units} from '../../Units';
import {SelectAmount} from '../../inputs/SelectAmount';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class Supercapacitors extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SUPERCAPACITORS,
      cost: 4,
      tags: [Tags.ENERGY, Tags.BUILDING],
      productionBox: Units.of({megacredits: 1}),
      metadata: {
        cardNumber: 'X46',
        renderData: CardRenderer.builder((b) => {
          b.text('EFFECT: CONVERTING ENERGY TO HEAT DURING PRODUCTION IS OPTIONAL FOR EACH ENERGY RESOURCE.', Size.SMALL);
          b.br.br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Increase your M€ production 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }

  public static onProduction(player: Player) {
    if (player.energy === 0) {
      player.finishProductionPhase();
      return;
    }

    const selectAmount = new SelectAmount(
      'Select amount of energy to convert to heat',
      'Convert energy',
      (amount) => {
        player.energy -= amount;
        player.heat += amount;
        player.game.log('${0} converted ${1} units of energy to heat', (b) => b.player(player).number(amount));
        player.finishProductionPhase();
        return undefined;
      },
      0,
      player.energy,
    );

    // If player has conceded, do full normal conversion
    if (player.hasConceded) {
      selectAmount.cb(player.energy);
      return;
    }

    player.game.defer(new DeferredAction(player, () => {
      return selectAmount;
    }));
  }
}
