import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class ElectroCatapult extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ELECTRO_CATAPULT,
      tags: [Tags.BUILDING],
      cost: 17,

      metadata: {
        cardNumber: '069',
        description: {
          text: 'Oxygen must be 8% or less. Decrease your energy production 1 step.',
          align: 'left',
        },
        requirements: CardRequirements.builder((b) => b.oxygen(8).max()),
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant or 1 steel to gain 7MC.', (eb) => {
            eb.plants(1).slash().steel(1).startAction.megacredits(7);
          }).br;
          b.production((pb) => pb.minus().energy(1));
        }),
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return player.energyProduction >= 1 &&
        game.checkMaxRequirements(player, GlobalParameter.OXYGEN, 8);
  }
  public canAct(player: Player): boolean {
    return player.plants > 0 || player.steel > 0;
  }
  public action(player: Player) {
    if (player.plants > 0 && player.steel > 0) {
      return new OrOptions(
        new SelectOption('Spend 1 plant to gain 7 MC', 'Spend plant', () => {
          player.adjustUnits({plants: -1, megacredits: 7});
          return undefined;
        }),
        new SelectOption('Spend 1 steel to gain 7 MC', 'Spend steel', () => {
          player.adjustUnits({steel: -1, megacredits: 7});
          return undefined;
        }),
      );
    } else if (player.plants > 0) {
      player.adjustUnits({plants: -1, megacredits: 7});
    } else if (player.steel > 0) {
      player.adjustUnits({steel: -1, megacredits: 7});
    }
    return undefined;
  }
  public play(player: Player) {
    player.addEnergyProduction(-1);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
