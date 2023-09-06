import {IActionCard} from '../ICard';
import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {HiTechLab} from '../promo/HiTechLab';
import {Size} from '../render/Size';

export class TychoMagnetics extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.TYCHO_MAGNETICS,
      tags: [Tags.ENERGY, Tags.SCIENCE],
      startingMegaCredits: 42,

      metadata: {
        cardNumber: '??',
        description: 'You start with 42 M€. Increase your energy production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.energy(1)).nbsp().megacredits(42);
          b.corpBox('action', (ce) => {
            ce.vSpace();
            ce.action('Spend any number of energy to draw that many cards. Keep 1 and discard the rest.', (eb) => {
              eb.text('X').energy(1).startAction.text('X').cards(1).nbsp(Size.SMALL).text('KEEP 1');
            });
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.energy > 0;
  }

  public action(player: Player) {
    return HiTechLab.spendEnergyToDrawCards(player);
  }
}
