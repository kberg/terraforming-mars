import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {Resources} from '../../Resources';

export class Eunice extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.EUNICE,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L38',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.megacredits(-12).colon().text('COPY').prelude().any.megacredits(3).multiplier.asterix();
          b.br.br;
        }),
        description: 'Once per game, pay 12 M€ to copy the direct effect of any prelude in play. Then gain 3X M€, where X is the current generation number.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(12) && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    game.defer(new SelectHowToPayDeferred(player, 12));

    const allPlayedPreludes = game.getPlayers().map((player) => player.playedCards.filter((c) => c.cardType === CardType.PRELUDE)).reduce((a, b) => a.concat(b));
    const eligiblePreludes = allPlayedPreludes.filter((c) => c.canPlay === undefined || c.canPlay(player));

    game.defer(new DeferredAction(player, () => {
      return new SelectCard('Choose prelude card to copy', 'Select', eligiblePreludes, (foundCards: Array<IProjectCard>) => {
        game.defer(new DeferredAction(player, () => foundCards[0].play(player)));
        game.log('${0} copied ${1} effect', (b) => b.player(player).card(foundCards[0]));
        return undefined;
      });
    }));

    game.defer(new DeferredAction(player, () => {
      player.addResource(Resources.MEGACREDITS, game.generation * 3);
      return undefined;
    }));

    this.isDisabled = true;
    return undefined;
  }
}
