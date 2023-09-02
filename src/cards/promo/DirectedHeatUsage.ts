import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class DirectedHeatUsage extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DIRECTED_HEAT_USAGE,
      cost: 1,

      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 heat to gain either 4 M€ or 2 plants.', (eb) => {
            eb.heat(3).digit.startAction.megacredits(4).or().plants(2);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.availableHeat >= 3;
  }

  public action(player: Player) {
    return player.spendHeat(3, () => {
      return new OrOptions(
        new SelectOption('Gain 4 M€', 'Gain M€', () => {
          player.addResource(Resources.MEGACREDITS, 4, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 2 plants', 'Gain plants', () => {
          player.addResource(Resources.PLANTS, 2, {log: true});
          return undefined;
        }),
      );
    });
  }
}
