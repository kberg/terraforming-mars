import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {AresHandler} from '../../ares/AresHandler';
import {CardRenderer} from '../render/CardRenderer';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class DesperateMeasures extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DESPERATE_MEASURES,
      cost: 1,
      // 7% oxygen and -2 deg temperature track bonuses are handled in canPlay and play methods
      tr: {tr: 1},

      metadata: {
        cardNumber: 'A04',
        description: 'Place a bronze cube on a dust storm tile and raise oxygen 1 step, or place a bronze cube on an erosion tile and raise the temperature 1 step. The hazard tile with the bronze cube cannot be removed.',
        renderData: CardRenderer.builder((b) => {
          b.resourceCube().asterix().br;
          b.temperature(1).slash().oxygen(1);
        }),
        victoryPoints: -2,
      },
    });
  }

  private getHazardTiles(game: Game) {
    return game.board.spaces.filter((space) => AresHandler.hasHazardTile(space));
  }

  public canPlay(player: Player): boolean {
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    const oxygenLevel = player.game.getOxygenLevel();
    const temperature = player.game.getTemperature();

    let trGainFromTemperatureRaise = player.computeTerraformRatingBump(this);
    if (redsAreRuling && temperature === -2) trGainFromTemperatureRaise += 1;

    let trGainFromOxygenRaise = player.computeTerraformRatingBump(this);
    if (redsAreRuling && oxygenLevel === 7) trGainFromOxygenRaise += 1;

    const minTRGain = Math.min(trGainFromTemperatureRaise, trGainFromOxygenRaise);
    const maxTRGain = Math.max(trGainFromTemperatureRaise, trGainFromOxygenRaise);
    Card.setRedsWarningText(player, maxTRGain, this, minTRGain !== maxTRGain);

    const hasHazardTileInPlay = this.getHazardTiles(player.game).length > 0;
    // You can't play desperate measures if there isn't a hazard marker in play.
    if (!hasHazardTileInPlay) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: minTRGain * REDS_RULING_POLICY_COST});
      const actionDetailsForRaisingTemperature = this.getActionDetailsForRaisingTemperature(player, this);
      const actionDetailsForRaisingOxygen = this.getActionDetailsForRaisingOxygen(player, this);

      const hazardTileSpaces = this.getHazardTiles(player.game);

      if (hazardTileSpaces.some((space) => space.tile!.tileType === TileType.DUST_STORM_MILD || space.tile!.tileType === TileType.DUST_STORM_SEVERE)) {
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetailsForRaisingOxygen);

        // If we hit the bonus TR for oxygen, check if we can reduce the cost by placing on an erosion tile and raising temperature instead
        if (this.howToAffordReds.redTaxes > REDS_RULING_POLICY_COST && hazardTileSpaces.some((space) => space.tile!.tileType === TileType.EROSION_MILD || space.tile!.tileType === TileType.EROSION_SEVERE)) {
          const howToAffordRedsForTemperatureIncrease = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetailsForRaisingTemperature);

          if (howToAffordRedsForTemperatureIncrease.redTaxes < this.howToAffordReds.redTaxes) {
            this.howToAffordReds = howToAffordRedsForTemperatureIncrease;
          }
        }
      } else {
        // There are no dust storm tiles, we must place the marker on an erosion tile
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetailsForRaisingTemperature);
      }

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    let eligibleHazards = this.getHazardTiles(player.game);

    // Temperature
    const temperature = game.getTemperature();
    let raiseTemperatureCost = REDS_RULING_POLICY_COST;

    if (temperature === -2) {
      raiseTemperatureCost += REDS_RULING_POLICY_COST;
    } else if (this.temperatureIsMaxed(game) || !redsAreRuling) {
      raiseTemperatureCost = 0;
    }

    if (redsAreRuling && !player.canAfford(raiseTemperatureCost)) {
      eligibleHazards = eligibleHazards.filter((hazard) => hazard.tile!.tileType !== TileType.EROSION_MILD && hazard.tile!.tileType !== TileType.EROSION_SEVERE);
    }

    // Oxygen
    const oxygenLevel = game.getOxygenLevel();
    let raiseOxygenCost = REDS_RULING_POLICY_COST;

    if (oxygenLevel === 7) {
      raiseOxygenCost += REDS_RULING_POLICY_COST;
      if (temperature === -2) raiseOxygenCost += REDS_RULING_POLICY_COST;
    } else if (this.oxygenIsMaxed(game) || !redsAreRuling) {
      raiseOxygenCost = 0;
    }

    if (redsAreRuling && !player.canAfford(raiseOxygenCost)) {
      eligibleHazards = eligibleHazards.filter((hazard) => hazard.tile!.tileType !== TileType.DUST_STORM_MILD && hazard.tile!.tileType !== TileType.DUST_STORM_SEVERE);
    }

    return new SelectSpace('Select a hazard space to protect', eligibleHazards, (space: ISpace) => {
        space.tile!.protectedHazard = true;
        const tileType = space.tile!.tileType;
        if (TileType.DUST_STORM_MILD === tileType || TileType.DUST_STORM_SEVERE === tileType) {
          player.game.increaseOxygenLevel(player, 1);
        } else {
          // is an erosion tile when the expression above is false.
          player.game.increaseTemperature(player, 1);
        }
        return undefined;
    });
  }

  public getVictoryPoints() {
    return -2;
  }

  private temperatureIsMaxed(game: Game) {
    return game.getTemperature() === MAX_TEMPERATURE;
  }

  private oxygenIsMaxed(game: Game) {
    return game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
  }

  public getActionDetailsForRaisingTemperature(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, temperatureIncrease: 1});
  }

  public getActionDetailsForRaisingOxygen(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, oxygenIncrease: 1});
  }
}
