import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {DrawCards, LogType} from '../../deferredActions/DrawCards';
import {SelectCard} from '../../inputs/SelectCard';
import {LogHelper} from '../../LogHelper';
import {IProjectCard} from '../IProjectCard';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Size} from '../render/Size';

export class Stefan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.STEFAN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L19',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.text('PAY').megacredits(0).multiplier.colon().text('X').cards(1).text('(MAX 5)', Size.SMALL);
          b.br;
          b.text('SELL').cards(1).colon().megacredits(3);
        }),
        description: 'Once per game, pay X M€ equal to the current generation number to draw X cards (max 5), then sell ANY number of cards from hand for 3 M€ each.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const cost = player.game.generation;
    return player.canAfford(cost) && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const cost = game.generation;
    const cardsDrawnQty = Math.min(game.generation, 5);
    game.defer(new SelectHowToPayDeferred(player, cost, {title: 'Select how to pay for action'}));
    game.defer(DrawCards.keepAll(player, cardsDrawnQty));

    return new SelectCard(
      'Sell patents',
      'Sell',
      player.cardsInHand,
      (foundCards: Array<IProjectCard>) => {
        player.megaCredits += foundCards.length * 3;

        foundCards.forEach((card) => {
          for (let i = 0; i < player.cardsInHand.length; i++) {
            if (player.cardsInHand[i].name === card.name) {
              player.cardsInHand.splice(i, 1);
              break;
            }
          }
          game.dealer.discard(card);
        });

        game.log('${0} sold ${1} patents', (b) => b.player(player).number(foundCards.length));
        LogHelper.logDrawnCards(player, foundCards.map((card) => card.name), true, LogType.SOLD);
        this.isDisabled = true;
        return undefined;
      }, {
        // Account for any new cards drawn by the DeferredAction
        max: player.cardsInHand.length + cardsDrawnQty,
      },
    );
  }
}
