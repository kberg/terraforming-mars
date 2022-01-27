import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Priority} from '../../deferredActions/DeferredAction';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {DrawCards} from '../../deferredActions/DrawCards';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Resources} from '../../Resources';

export class Musk extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.MUSK,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L28',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.minus().text('X').cards(1).secondaryTag(Tags.EARTH).colon().nbsp.plus().text('X').cards(1).secondaryTag(Tags.SPACE);
          b.titanium(6);
          b.br.br;
        }),
        description: 'Once per game, discard any number of Earth cards up to the current generation number to draw that many Space cards. Gain 6 titanium.',
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
    const earthCardsInHand = player.cardsInHand.filter((card) => card.tags.includes(Tags.EARTH));
    const max = Math.min(earthCardsInHand.length, player.game.generation);

    return new SelectAmount(
      'Select number of Earth cards to discard',
      'Discard cards',
      (amount: number) => {
        player.game.defer(new DiscardCards(player, amount), Priority.DISCARD_BEFORE_DRAW);
        player.game.defer(DrawCards.keepAll(player, amount, {tag: Tags.SPACE}));
        player.addResource(Resources.TITANIUM, 6);
        this.isDisabled = true;
        return undefined;
      },
      1,
      max,
    );
  }
}
