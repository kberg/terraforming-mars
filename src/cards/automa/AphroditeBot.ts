import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {AutomaHandler} from '../../automa/AutomaHandler';
import {MAX_VENUS_SCALE} from '../../constants';

export class AphroditeBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.APHRODITE_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU09',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.vSpace(Size.LARGE);
            ce.action('Increase Venus 1 step. Gain 1 TR.', (eb) => {
              eb.empty().startAction.venus(1).nbsp().tr(1);
            });
            ce.vSpace(Size.MEDIUM);
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
    game.automaBotVictoryPointsBreakdown.terraformRating += 2;

    if (game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
      AutomaHandler.increaseVenusScale(game, 1);
      game.venusSilverCubeBonusMC = 0;
  
      const gotBonusTRFromVenusTrack = game.getVenusScaleLevel() === 16;
      if (gotBonusTRFromVenusTrack) game.automaBotVictoryPointsBreakdown.terraformRating++;

      // Check for Aphrodite corporation
      const aphrodite = game.getPlayers().find((player) => player.isCorporation(CardName.APHRODITE));
      if (aphrodite !== undefined) aphrodite.megaCredits += gotBonusTRFromVenusTrack ? 4 : 2;
    }

    game.log('${0} action: Increase Venus 1 step and gain 1 TR', (b) => b.card(this));

    return undefined;
  }
}
