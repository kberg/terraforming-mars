import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CheungShingMARS implements CorporationCard {
    public name = CardName.CHEUNG_SHING_MARS;
    public tags = [Tags.BUILDING];
    public startingUnits = {
      megacredits: 44,
    };
    public startingProduction = {
      megacredits: 3,
    }
    public cardType = CardType.CORPORATION;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      return card.tags.filter((tag) => tag === Tags.BUILDING).length * 2;
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R16',
      description: 'You start with 3 MC production and 44 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.production((pb) => pb.megacredits(3)).nbsp.megacredits(44);
        b.corpBox('effect', (ce) => {
          ce.effect('When you play a building tag, you pay 2 MC less for it.', (eb) => {
            eb.building().played.startEffect.megacredits(-2);
          });
        });
      }),
    }
}
