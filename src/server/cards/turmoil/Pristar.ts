import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Pristar extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PRISTAR,
      startingMegaCredits: 53,
      resourceType: CardResource.PRESERVATION,

      victoryPoints: {resourcesHere: {}},

      behavior: {
        tr: -2,
      },

      metadata: {
        cardNumber: 'R07',
        description: 'You start with 53 M€. Decrease your TR 2 steps. 1 VP per preservation resource here.',

        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(53).nbsp.nbsp.minus().tr(2, {size: Size.SMALL});
          b.corpBox('effect', (ce) => {
            ce.effect('During production phase, if you did not get TR so far this generation, add one preservation resource here and gain 6 M€.', (eb) => {
              eb.tr(1, {size: Size.SMALL, cancelled: true}).startEffect.resource(CardResource.PRESERVATION).megacredits(6);
            });
          });
        }),
      },
    });
  }

  public onProductionPhase(player: IPlayer) {
    if (!(player.hasIncreasedTerraformRatingThisGeneration)) {
      player.stock.add(Resource.MEGACREDITS, 6, {log: true, from: {card: this}});
      player.addResourceTo(this, 1);
    }
    return undefined;
  }
}
