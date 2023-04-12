import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {AresHandler} from '../../ares/AresHandler';
import {AutomaHandler} from '../../automa/AutomaHandler';
import {MAX_TEMPERATURE} from '../../constants';
import {GameSetup} from '../../GameSetup';

export class HelionBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.HELION_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU04',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.vSpace(Size.LARGE);
            ce.action('Increase temperature 1 step. Gain 1 TR.', (eb) => {
              eb.empty().startAction.temperature(1).nbsp().tr(1);
            });
            ce.vSpace(Size.SMALL);
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
    const neutral = GameSetup.neutralPlayerFor(game.id);
    game.automaBotVictoryPointsBreakdown.terraformRating += 2;

    if (game.getTemperature() < MAX_TEMPERATURE) {
      AutomaHandler.increaseTemperature(game, 1);
      game.temperatureSilverCubeBonusMC = 0;
      AutomaHandler.checkForTemperatureBonusOcean(game, neutral);
  
      AresHandler.ifAres(game, (aresData) => {
        AresHandler.onTemperatureChange(game, aresData);
      });
    }

    game.log('${0} action: Increase temperature 1 step and gain 1 TR', (b) => b.card(this));

    return undefined;
  }
}
