import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';

export class CredicorBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CREDICOR_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU03',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.vSpace(Size.LARGE);
            ce.action('Gain 1 TR. Each opponent removes 3 plants.', (eb) => {
              eb.empty().startAction.tr(1).nbsp().minus().plants(-3).digit.any;
            });
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

    game.automaBotVictoryPointsBreakdown.terraformRating++;
    player.deductResource(Resources.PLANTS, 3, {log: true});
    game.log('${0} action: Gain 1 TR and remove up to 3 plants from each opponent', (b) => b.card(this));

    return undefined;
  }
}
