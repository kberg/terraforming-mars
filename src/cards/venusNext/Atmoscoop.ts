import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';
import {MAX_TEMPERATURE, MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from './../../constants';

export class Atmoscoop extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ATMOSCOOP,
      cost: 22,
      tags: [Tags.JOVIAN, Tags.SPACE],
      // 16% Venus and -2 deg temperature track bonuses are handled in canPlay and play methods
      tr: {tr: 2},

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      metadata: {
        cardNumber: '217',
        description: 'Requires 3 Science tags. Either raise the temperature 2 steps, or raise Venus 2 steps. Add 2 Floaters to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).or(Size.SMALL).venus(2).br;
          b.floaters(2).asterix();
        }),
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    const venusScale = player.game.getVenusScaleLevel();
    const temperature = player.game.getTemperature();

    let trGainFromTemperatureRaise = player.computeTerraformRatingBump(this);
    if (redsAreRuling && (temperature === -4 || temperature === -2)) trGainFromTemperatureRaise += 1;

    let trGainFromVenusRaise = player.computeTerraformRatingBump(this);
    if (redsAreRuling && (venusScale === 12 || venusScale === 14)) trGainFromVenusRaise += 1;

    const minTRGain = Math.min(trGainFromTemperatureRaise, trGainFromVenusRaise);
    const maxTRGain = Math.max(trGainFromTemperatureRaise, trGainFromVenusRaise);
    Card.setRedsWarningText(player, maxTRGain, this, minTRGain !== maxTRGain);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: minTRGain * REDS_RULING_POLICY_COST});
      const actionDetailsForRaisingTemperature = this.getActionDetailsForRaisingTemperature(player, this);
      const actionDetailsForRaisingVenus = this.getActionDetailsForRaisingVenus(player, this);

      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetailsForRaisingTemperature, false, true);

      // If we hit the temperature track's bonus ocean, check if we can reduce the cost by raising Venus instead
      if (this.howToAffordReds.redTaxes === 3 * REDS_RULING_POLICY_COST) {
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetailsForRaisingVenus, false, true);
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
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);

    if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game) && floaterCards.length === 0) {
      return undefined;
    }

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    const venusScale = game.getVenusScaleLevel();
    const increaseVenus = new SelectOption('Raise Venus 2 steps', 'Raise venus', () => {
      game.increaseVenusScaleLevel(player, 2);
      return undefined;
    });

    let raiseVenusCost = 2 * REDS_RULING_POLICY_COST;
    if (venusScale === 12 || venusScale === 14) {
      raiseVenusCost += REDS_RULING_POLICY_COST;
    } else if (this.venusIsMaxed(game) || !redsAreRuling) {
      raiseVenusCost = 0;
    } else {
      const venusStepsRaised = Math.min((MAX_VENUS_SCALE - venusScale) / 2, 2);
      raiseVenusCost = venusStepsRaised * REDS_RULING_POLICY_COST;
    }

    const temperature = game.getTemperature();
    const increaseTemp = new SelectOption('Raise temperature 2 steps', 'Raise temperature', () => {
      game.increaseTemperature(player, 2);
      return undefined;
    });

    let raiseTemperatureCost = 2 * REDS_RULING_POLICY_COST;
    if (temperature === -4 || temperature === -2) {
      raiseTemperatureCost += REDS_RULING_POLICY_COST;
    } else if (this.temperatureIsMaxed(game) || !redsAreRuling) {
      raiseTemperatureCost = 0;
    } else {
      const temperatureStepsRaised = Math.min((MAX_TEMPERATURE - temperature) / 2, 2);
      raiseTemperatureCost = temperatureStepsRaised * REDS_RULING_POLICY_COST;
    }

    const increaseTempOrVenus = new OrOptions();
    increaseTempOrVenus.title = 'Choose global parameter to raise';
    if (player.canAfford(raiseTemperatureCost - (this.howToAffordReds?.bonusMCFromPlay || 0))) increaseTempOrVenus.options.push(increaseTemp);
    if (player.canAfford(raiseVenusCost)) increaseTempOrVenus.options.push(increaseVenus);

    const addFloaters = new SelectCard(
      'Select card to add 2 floaters',
      'Add floaters',
      floaterCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {qty: 2, log: true});
        return undefined;
      },
    );

    switch (floaterCards.length) {
    case 1:
      player.addResourceTo(floaterCards[0], {qty: 2, log: true});
      // Intentional fall-through

    case 0:
      if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) return undefined;
      return increaseTempOrVenus;

    default:
      if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) return addFloaters;

      increaseTempOrVenus.cb = () => addFloaters;
      return increaseTempOrVenus;
    }
  }

  public getVictoryPoints() {
    return 1;
  }

  private temperatureIsMaxed(game: Game) {
    return game.getTemperature() === MAX_TEMPERATURE;
  }

  private venusIsMaxed(game: Game) {
    return game.getVenusScaleLevel() === MAX_VENUS_SCALE;
  }

  public getActionDetailsForRaisingTemperature(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, temperatureIncrease: 2});
  }

  public getActionDetailsForRaisingVenus(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 2});
  }
}
