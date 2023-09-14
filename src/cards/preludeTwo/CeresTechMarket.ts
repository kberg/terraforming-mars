import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {DeferredAction, Priority} from '../../deferredActions/DeferredAction';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {SelectAmount} from '../../inputs/SelectAmount';

export class CeresTechMarket extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.CERES_TECH_MARKET,
      tags: [Tags.SCIENCE, Tags.SPACE],
      cost: 12,

      metadata: {
        cardNumber: '??',
        description: 'Gain 2 M€ per colony you own.',
        renderData: CardRenderer.builder((b) => {
          b.action('Discard any number of cards from your hand to gain 2 M€ for each discarded card.', (eb) => {
            eb.minus().text('X').cards(1).startAction.megacredits(2).multiplier;
          });
          b.br;
          b.megacredits(2).slash().colonies(1);
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    const coloniesCount = player.getColoniesCount();
    player.addResource(Resources.MEGACREDITS, coloniesCount * 2, {log: true});
    return undefined;
  }

  public canAct(player: Player) {
    return player.cardsInHand.length > 0;
  }

  public action(player: Player) {
    return new SelectAmount(
      'Select number of cards to discard',
      'Discard cards',
      (amount: number) => {
        player.game.defer(new DiscardCards(player, amount), Priority.DISCARD_BEFORE_DRAW);
        player.game.defer(new DeferredAction(player, () => {
          player.addResource(Resources.MEGACREDITS, amount * 2);
          return undefined;
        }));

        return undefined;
      },
      1,
      player.cardsInHand.length,
    );
  }

  public getVictoryPoints(): number {
    return 1;
  }
}
