import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';

export class Karen extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.KAREN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L11',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X').prelude().asterix();
        }),
        description: 'Once per game, draw Prelude cards equal to the current generation number and choose one to play.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const cardsDrawn: Array<IProjectCard> = [];

    for (let i = 0; i < player.game.generation; i++) {
      cardsDrawn.push(player.game.dealer.dealPreludeCard());
    }

    cardsDrawn.forEach((card) => {
      if ((card.canPlay === undefined || card.canPlay(player)) === false) {
        card.warning = "This prelude will be discarded for 15 M€ if you play it now as you cannot afford to pay for it.";
      }
    });

    return new SelectCard('Choose prelude card to play', 'Play', cardsDrawn, (foundCards: Array<IProjectCard>) => {
      if (foundCards[0].canPlay === undefined || foundCards[0].canPlay(player)) {
        this.isDisabled = true;
        return player.playCard(foundCards[0]);
      } else {
        // Same rationale as player.playPreludeCard()
        player.game.log('${0} was discarded for 15 M€ as ${1} could not afford to play it', (b) => b.card(foundCards[0]).player(player));
        player.addResource(Resources.MEGACREDITS, 15, {log: true});
        foundCards[0].warning = undefined;
        return undefined;
      }
    });
  }
}
