import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';

export class VitorBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.VITOR_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU07',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.vSpace(Size.LARGE);
            ce.action('Gain 2 VP.', (eb) => {
              eb.empty().startAction.vpIcon(2);
            });
            ce.vSpace();
            ce.vSpace(Size.LARGE);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    game.automaBotVictoryPointsBreakdown.victoryPoints += 2;
    game.log('${0} action: Gain 2 VP', (b) => b.card(this));

    return undefined;
  }
}
