import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Manutech implements CorporationCard {
    public name = CardName.MANUTECH;
    public tags = [Tags.BUILDING];
    public startingUnits = {
      megacredits: 35,
    };
    public startingProduction = {
      steel: 1,
    }
    public cardType = CardType.CORPORATION;

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R23',
      description: 'You start with 1 steel production, and 35 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.production((pb) => pb.steel(1)).nbsp.megacredits(35);
        b.corpBox('effect', (ce) => {
          ce.effect('For each step you increase the production of a resource, including this, you also gain that resource.', (eb) => {
            eb.production((pb) => pb.wild(1)).startEffect.wild(1);
          });
        });
      }),
    }
}
