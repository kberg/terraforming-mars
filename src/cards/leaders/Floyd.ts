import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class Floyd extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.FLOYD,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L06',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.text('PLAY').cards(1).colon().megacredits(-13).megacredits(-2).multiplier.asterix();
          b.br.br;
        }),
        description: 'Once per game, play a card from hand for 13 + 2X M€ less, where X is the current generation number.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.cardsInHand.length > 0 && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    player.game.defer(new PlayProjectCard(player));
    player.game.defer(new DeferredAction(player, () => {
      this.isDisabled = true;
      return undefined;
    }));
    return undefined;
  }

  public getCardDiscount(player: Player) {
    if (player.actionsThisGeneration.has(this.name) && this.isDisabled === false) {
      return 13 + 2 * player.game.generation;
    }
    return 0;
  }
}
