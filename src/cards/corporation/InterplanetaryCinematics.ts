import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class InterplanetaryCinematics extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INTERPLANETARY_CINEMATICS,
      tags: [Tags.BUILDING],
      startingUnits: {
        megacredits: 30,
        steel: 20,
      },

      metadata: {
        cardNumber: 'R19',
        description: 'You start with 20 steel and 30 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(30).nbsp.steel(20).digit;
          b.corpBox('effect', (ce) => {
            ce.effect('Each time you play an event, you gain 2 MC.', (eb) => {
              eb.event().played.startEffect.megacredits(2);
            });
          });
        }),
      },
    });
  }
  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.cardType === CardType.EVENT) {
      player.addMegacredits(2);
    }
  }
  public play() {
    return undefined;
  }
}
