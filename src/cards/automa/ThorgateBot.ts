import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {Game} from '../../Game';
import {AresHandler} from '../../ares/AresHandler';
import {AutomaHandler} from '../../automa/AutomaHandler';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE} from '../../constants';

export class ThorgateBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THORGATE_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU08',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.SMALL);
            ce.vSpace(Size.LARGE);
            ce.action('The bot\'s next action is treated as resolving a power tag regardless of the tag.', (eb) => {
              eb.empty().startAction.text('next tag', Size.MEDIUM, true).nbsp(Size.SMALL).colon().nbsp(Size.SMALL).energy(1).played.asterix();
            });
            ce.vSpace();
            ce.effect('When resolving a power tag, additionally raise oxygen 1 step.', (eb) => {
              eb.energy(1).played.startEffect.oxygen(1);
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
    game.overwriteNextBotAction = true;
    game.log('${0} action: The next tag will be resolved as a power tag', (b) => b.card(this));

    return undefined;
  }

  public static handleOxygenIncreaseFromPowerTag(game: Game, neutral: Player): void {
    game.automaBotVictoryPointsBreakdown.terraformRating++;

    if (game.getOxygenLevel() !== MAX_OXYGEN_LEVEL) {
      AutomaHandler.increaseOxygenLevel(game, 1);

      if (game.getOxygenLevel() === 8 && game.getTemperature() !== MAX_TEMPERATURE) {
        AutomaHandler.increaseTemperature(game, 1);
        game.temperatureSilverCubeBonusMC = 0;
        game.automaBotVictoryPointsBreakdown.terraformRating++;
        AutomaHandler.checkForTemperatureBonusOcean(game, neutral);

        AresHandler.ifAres(game, (aresData) => {
          AresHandler.onTemperatureChange(game, aresData);
        });
      }
    }
  }
}
