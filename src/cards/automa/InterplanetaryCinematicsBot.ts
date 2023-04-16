import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';

export class InterplanetaryCinematicsBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INTERPLANETARY_CINEMATICS_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU11',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.SMALL);
            ce.vSpace(Size.LARGE);
            ce.effect('When this bot resolves an Event tag, it takes an extra action.', (eb) => {
              eb.event().played.startEffect.arrow(Size.LARGE).asterix();
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

  public initialAction() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    game.automaBotVictoryPointsBreakdown.terraformRating++;
    game.log('${0} action: Gain 1 TR and take an extra action', (b) => b.card(this));

    return undefined;
  }
}
