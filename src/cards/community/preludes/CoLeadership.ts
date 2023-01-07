import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../render/Size';
import {IProjectCard} from '../../IProjectCard';
import {SelectCard} from '../../../inputs/SelectCard';

export class CoLeadership extends PreludeCard {
  constructor() {
    super({
      name: CardName.CO_LEADERSHIP,
      metadata: {
        cardNumber: 'Y36',
        renderData: CardRenderer.builder((b) => {
          b.text('Draw 3 CEO cards, and play one of them.', Size.SMALL, true);
        }),
      },
    });
  }
  public play(player: Player) {
    const cardsDrawn: Array<IProjectCard> = [
      player.game.dealer.dealLeaderCard(),
      player.game.dealer.dealLeaderCard(),
      player.game.dealer.dealLeaderCard(),
    ];

    return new SelectCard('Choose CEO card to play', 'Play', cardsDrawn, (foundCards: Array<IProjectCard>) => {
      return player.playCard(foundCards[0]);
    });
  };
}

