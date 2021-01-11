import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Aphrodite implements CorporationCard {
    public name = CardName.APHRODITE;
    public tags = [Tags.PLANT, Tags.VENUS];
    public startingUnits = {
      megacredits: 47,
    };
    public startingProduction = {
      plants: 1,
    };
    public cardType = CardType.CORPORATION;

    public play() {
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'R01',
      description: 'You start with 1 plant production and 47 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.production((pb) => pb.plants(1)).nbsp.megacredits(47);
        b.corpBox('effect', (ce) => {
          ce.effect('Whenever Venus is terraformed 1 step, you gain 2MC.', (eb) => {
            eb.venus(1).any.startEffect.megacredits(2);
          });
        });
      }),
    }
}
