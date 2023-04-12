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
import {Game} from '../../Game';
import {SpaceType} from '../../SpaceType';
import {TileType} from '../../TileType';

export class EcolineBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ECOLINE_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU01',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Place a greenery.', (eb) => {
              eb.empty().startAction.greenery();
            });
            ce.vSpace();
            ce.effect('If this bot places a Greenery that is not adjacent to their own City, their next action is to place a City regardless of the tag.', (eb) => {
              eb.wild(1).played.startEffect.city().asterix();
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
    const neutral = GameSetup.neutralPlayerFor(game.id);
    this.placeGreenery(game, neutral);

    return undefined;
  }

  // A good chunk of this code shares some similarities with UNMIBot's methods, and can be refactored in future
  private placeGreenery(game: Game, neutral: Player): void {
    const landSpacesCount = game.board.getAvailableSpacesOnLand(neutral).length;

    if (landSpacesCount === 0) {
      game.automaBotVictoryPointsBreakdown.terraformRating++;
      game.log('${0} action: Gain 1 TR as there are no greenery spots left', (b) => b.card(this));
      return undefined;
    }

    AutomaHandler.increaseOxygenLevel(game, 1);
    game.automaBotVictoryPointsBreakdown.terraformRating++;
    game.automaBotVictoryPointsBreakdown.greenery++;

    if (game.getOxygenLevel() === 8 && game.getTemperature() !== MAX_TEMPERATURE) {
      this.raiseTemperature(game, neutral);
    }

    const targetGreenerySpace = AutomaHandler.getTargetGreenerySpace(game, neutral);
    game.simpleAddTile(neutral, game.board.getSpace(targetGreenerySpace.id), {tileType: TileType.GREENERY});

    AutomaHandler.grantBonusesForBotTilePlacement(game, targetGreenerySpace, neutral, TileType.GREENERY);
    game.oxygenSilverCubeBonusMC = 0;
    game.log('${0} action: Place a greenery on row ${1} position ${2}', (b) => b.card(this).number(targetGreenerySpace.y + 1).number(targetGreenerySpace.x - Math.abs(targetGreenerySpace.y - 4) + 1));

    // Each adjacent bot city scores 1 VP for the newly placed greenery
    const adjacentCities = game.board.getAdjacentSpaces(targetGreenerySpace).filter((space) => space.spaceType === SpaceType.LAND && space.tile?.tileType === TileType.CITY && space.player?.name === neutral.name);
    game.automaBotVictoryPointsBreakdown.city += adjacentCities.length;

    // If we are placing a greenery that is not adjacent to any of our own cities
    if (adjacentCities.length === 0) {
      game.overwriteNextBotAction = true;
    }
  }

  private raiseTemperature(game: Game, neutral: Player): void {
    AutomaHandler.increaseTemperature(game, 1);
    game.automaBotVictoryPointsBreakdown.terraformRating++;

    game.temperatureSilverCubeBonusMC = 0;
    AutomaHandler.checkForTemperatureBonusOcean(game, neutral);

    AresHandler.ifAres(game, (aresData) => {
      AresHandler.onTemperatureChange(game, aresData);
    });
  }
}
