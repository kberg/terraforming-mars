import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {AresHandler} from '../../ares/AresHandler';
import {AutomaHandler, BLOCKED_OXYGEN_SPOTS, BLOCKED_TEMPERATURE_SPOTS, BLOCKED_VENUS_SPOTS} from '../../automa/AutomaHandler';
import {MAX_OCEAN_TILES_AUTOMA, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, MIN_OXYGEN_LEVEL, MIN_TEMPERATURE, MIN_VENUS_SCALE} from '../../constants';
import {GameSetup} from '../../GameSetup';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {SpaceType} from '../../SpaceType';

export class UNMIBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.UNMI_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU05',
        description: 'Start the game with +3 TR.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.br.br;
          b.tr(3);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Choose the action with the most global parameter steps left', (eb) => {
              eb.empty().startAction.oceans(1).slash().greenery().slash().temperature(1).asterix();
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
    player.game.automaBotVictoryPointsBreakdown.terraformRating += 3;
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    const neutral = GameSetup.neutralPlayerFor(game.id);

    const range = (start: number, stop: number, step: number) => Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);

    const temperatureStepsRemaining: number =
      range(MIN_TEMPERATURE, MAX_TEMPERATURE, 2)
      .filter((value) => BLOCKED_TEMPERATURE_SPOTS.includes(value) === false)
      .filter((value) => value > game.getTemperature()).length;

    const oceansRemaining: number = MAX_OCEAN_TILES_AUTOMA - game.board.getOceansOnBoard();

    const oxygenStepsRemaining: number =
      range(MIN_OXYGEN_LEVEL, MAX_OXYGEN_LEVEL, 1)
      .filter((value) => BLOCKED_OXYGEN_SPOTS.includes(value) === false)
      .filter((value) => value > game.getOxygenLevel()).length;

    let venusStepsRemaining: number = 0;

    if (game.gameOptions.venusNextExtension) {
      venusStepsRemaining =
        range(MIN_VENUS_SCALE, MAX_VENUS_SCALE, 2)
        .filter((value) => BLOCKED_VENUS_SPOTS.includes(value) === false)
        .filter((value) => value > game.getVenusScaleLevel()).length;
    }

    const mostStepsCount = Math.max(temperatureStepsRemaining, oceansRemaining, oxygenStepsRemaining, venusStepsRemaining);

    if (mostStepsCount === 0) {
      game.automaBotVictoryPointsBreakdown.terraformRating++;
      game.log('${0} action: Gain 1 TR as all global parameters are maxed', (b) => b.card(this));
      return undefined;
    }

    // In the case of a tie, go in the order: Oceans, Greenery, Temperature, Venus
    if (oceansRemaining === mostStepsCount) {
      this.placeOcean(game, neutral);
    } else if (oxygenStepsRemaining === mostStepsCount) {
      this.placeGreenery(game, neutral);
    } else if (temperatureStepsRemaining === mostStepsCount) {
      this.raiseTemperature(game, neutral);
    } else {
      this.raiseVenus(game);
    }

    return undefined;
  }

  private placeOcean(game: Game, neutral: Player): void {
    const targetOceanSpace: ISpace = AutomaHandler.getTargetOceanSpace(game);
    game.simpleAddTile(neutral, game.board.getSpace(targetOceanSpace.id), {tileType: TileType.OCEAN});
    game.automaBotVictoryPointsBreakdown.terraformRating++;

    game.oceansSilverCubeBonusMC = 0;
    AutomaHandler.grantBonusesForBotTilePlacement(game, targetOceanSpace, neutral, TileType.OCEAN);

    game.log('${0} action: Place an ocean on row ${1} position ${2}', (b) => b.card(this).number(targetOceanSpace.y + 1).number(targetOceanSpace.x - Math.abs(targetOceanSpace.y - 4) + 1));
  }

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
      this.raiseTemperature(game, neutral, false);
    }

    const targetGreenerySpace = AutomaHandler.getTargetGreenerySpace(game, neutral);
    game.simpleAddTile(neutral, game.board.getSpace(targetGreenerySpace.id), {tileType: TileType.GREENERY});

    AutomaHandler.grantBonusesForBotTilePlacement(game, targetGreenerySpace, neutral, TileType.GREENERY);
    game.oxygenSilverCubeBonusMC = 0;
    game.log('${0} action: Place a greenery on row ${1} position ${2}', (b) => b.card(this).number(targetGreenerySpace.y + 1).number(targetGreenerySpace.x - Math.abs(targetGreenerySpace.y - 4) + 1));

    // Each adjacent bot city scores 1 VP for the newly placed greenery
    const adjacentCities = game.board.getAdjacentSpaces(targetGreenerySpace).filter((space) => space.spaceType === SpaceType.LAND && space.tile?.tileType === TileType.CITY && space.player?.name === neutral.name);
    game.automaBotVictoryPointsBreakdown.city += adjacentCities.length;
  }

  private raiseTemperature(game: Game, neutral: Player, shouldLog: boolean = true): void {
    AutomaHandler.increaseTemperature(game, 1);
    game.automaBotVictoryPointsBreakdown.terraformRating++;

    game.temperatureSilverCubeBonusMC = 0;
    AutomaHandler.checkForTemperatureBonusOcean(game, neutral);

    AresHandler.ifAres(game, (aresData) => {
      AresHandler.onTemperatureChange(game, aresData);
    });

    if (shouldLog) {
      game.log('${0} action: Increase temperature 1 step', (b) => b.card(this));
    }
  }

  private raiseVenus(game: Game): void {
    AutomaHandler.increaseVenusScale(game, 1);
    game.automaBotVictoryPointsBreakdown.terraformRating++;
    game.venusSilverCubeBonusMC = 0;

    const gotBonusTRFromVenusTrack = game.getVenusScaleLevel() === 16;
    if (gotBonusTRFromVenusTrack) game.automaBotVictoryPointsBreakdown.terraformRating++;

    // Check for Aphrodite corporation
    const aphrodite = game.getPlayers().find((player) => player.isCorporation(CardName.APHRODITE));
    if (aphrodite !== undefined) aphrodite.megaCredits += gotBonusTRFromVenusTrack ? 4 : 2;

    game.log('${0} action: Increase Venus scale 1 step', (b) => b.card(this));
  }
}
