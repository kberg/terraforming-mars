import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';

export class PolyphemosBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.POLYPHEMOS_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU10',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.SMALL);
            ce.vSpace(Size.LARGE);
            ce.effect('Buying cards to hand costs 2 M€ more.', (eb) => {
              eb.cards(1).startEffect.plus(Size.SMALL).megacredits(2).asterix();
            });
            ce.vSpace();
            ce.action('Gain 1 TR.', (eb) => {
              eb.empty().startAction.tr(1);
            });
            ce.vSpace();
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    player.cardCost += 2;
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    game.automaBotVictoryPointsBreakdown.terraformRating++;
    game.log('${0} action: Gain 1 TR', (b) => b.card(this));

    return undefined;
  }
}
