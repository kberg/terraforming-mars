import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {Tags} from '../../Tags';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Card} from '../../Card';
import {ResourceType} from '../../../ResourceType';
import {MAXIMUM_COLONY_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../../constants';
import {PlaceOceanTile} from '../../../deferredActions/PlaceOceanTile';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {Size} from '../../render/Size';
import {MoonExpansion} from '../../../moon/MoonExpansion';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../../turmoil/RedsPolicy';

export class TempestInc extends Card implements CorporationCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.TEMPEST_INC,
      tags: [Tags.SCIENCE],
      startingMegaCredits: 28,
      resourceType: ResourceType.FLOATER,
      initialActionText: 'Raise oxygen 2 steps',

      metadata: {
        cardNumber: 'R54',
        description: 'You start with 28 M€. As your first action, raise oxygen 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(28).oxygen(2);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action(undefined, (eb) => {
              eb.empty().startAction.floaters(1).or();
            });
            ce.vSpace(Size.SMALL);
            ce.action('Add 1 floater to this card, OR remove 1 floater from this card to raise any global parameter 1 step.', (eb) => {
              eb.floaters(1).startAction.temperature(1, Size.SMALL).slash().oxygen(1, Size.SMALL).slash().oceans(1, Size.SMALL);
            });
            ce.vSpace(Size.TINY);
          });
        }),
      },
    });
  }

  public resourceCount: number = 0;

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    player.game.increaseOxygenLevel(player, 2);
    return undefined;
  }

  public canAct(player: Player): boolean {
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsActionWarningText(player, 1, this, redsAreRuling, 'raise a global parameter', true);

    return true;
  }

  public action(player: Player) {
    if (this.resourceCount === 0) return this.addResource(player);

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    // We only need to check oceans here as this is the cheapest possible TR raise when Reds are ruling
    this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({oceansToPlace: 1}));

    const playerCanAffordReds = redsAreRuling && this.howToAffordReds.canAfford;
    if (redsAreRuling && !playerCanAffordReds) return this.addResource(player);

    const opts: Array<SelectOption> = [];
    const spendResource = new SelectOption('Remove 1 floater to raise a global parameter 1 step', 'Remove floater', () => this.spendResource(player));
    if (this.spendResource(player).options.length > 0) opts.push(spendResource);

    const addResource = new SelectOption('Add 1 floater to this card', 'Add floater', () => this.addResource(player));
    opts.push(addResource);

    const orOptions = new OrOptions(...opts);
    if (orOptions.options.length === 1) return orOptions.options[0].cb();

    return orOptions;
  }

  public addResource(player: Player) {
    player.addResourceTo(this, {qty: 1, log: true});
    return undefined;
  }

  public spendResource(player: Player): OrOptions {
    const orOptions = new OrOptions();
    const game = player.game;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    // TEMPERATURE
    const temperature = game.getTemperature();
    const howToAffordRedsForRaisingTemperature = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({temperatureIncrease: 1}));

    if (!redsAreRuling || temperature === MAX_TEMPERATURE || (redsAreRuling && howToAffordRedsForRaisingTemperature.canAfford)) {
      orOptions.options.push(new SelectOption('Increase temperature', 'Select', () => {
        const game = player.game;
        player.removeResourceFrom(this, 1);

        if (game.getTemperature() < MAX_TEMPERATURE) {
          game.log('${0} increased temperature 1 step', (b) => b.player(player));
        }

        game.increaseTemperature(player, 1);
        return undefined;
      }));
    }

    // OCEANS
    const howToAffordRedsForPlacingOcean = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({oceansToPlace: 1}));

    if (!redsAreRuling || game.noOceansAvailable() || (redsAreRuling && howToAffordRedsForPlacingOcean.canAfford)) {
      orOptions.options.push(new SelectOption('Place an ocean', 'Select', () => {
        player.removeResourceFrom(this, 1);
        player.game.defer(new PlaceOceanTile(player, 'Select space for ocean'));
        return undefined;
      }));
    }

    if (this.howToAffordReds !== undefined) player.howToAffordReds = this.howToAffordReds;

    // OXYGEN
    const oxygenLevel = game.getOxygenLevel();
    const howToAffordRedsForRaisingOxygen = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({oxygenIncrease: 1}));

    if (!redsAreRuling || oxygenLevel === MAX_OXYGEN_LEVEL || (redsAreRuling && howToAffordRedsForRaisingOxygen.canAfford)) {
      orOptions.options.push(new SelectOption('Increase oxygen level', 'Select', () => {
        const game = player.game;
        player.removeResourceFrom(this, 1);

        if (game.getOxygenLevel() < MAX_OXYGEN_LEVEL) {
          game.log('${0} increased oxygen level 1 step', (b) => b.player(player));
        }
        game.increaseOxygenLevel(player, 1);
        return undefined;
      }));
    }

    // VENUS
    const venusLevel = game.getVenusScaleLevel();
    const howToAffordRedsForRaisingVenus = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({oxygenIncrease: 1}));

    if (!redsAreRuling || venusLevel === MAX_VENUS_SCALE || (redsAreRuling && howToAffordRedsForRaisingVenus.canAfford)) {
      if (player.game.gameOptions.venusNextExtension === true) {
        orOptions.options.push(new SelectOption('Increase Venus scale', 'Select', () => {
          const game = player.game;
          player.removeResourceFrom(this, 1);

          if (game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            game.log('${0} increased Venus scale 1 step', (b) => b.player(player));
          }
          game.increaseVenusScaleLevel(player, 1);
          return undefined;
        }));
      }
    }

    // MOON
    if (player.game.gameOptions.moonExpansion === true) {
      const redsTaxFromRaisingMoonParameter = REDS_RULING_POLICY_COST;

      const moonColonyRate = MoonExpansion.getColonyRate(player);
      if (!redsAreRuling || moonColonyRate === MAXIMUM_COLONY_RATE || (redsAreRuling && player.canAfford(redsTaxFromRaisingMoonParameter))) {
        orOptions.options.push(new SelectOption('Increase Moon Colony rate', 'Select', () => {
          player.removeResourceFrom(this, 1);
          MoonExpansion.raiseColonyRate(player);
          return undefined;
        }));
      }

      const moonMiningRate = MoonExpansion.getMiningRate(player);
      if (!redsAreRuling || moonMiningRate === MAXIMUM_MINING_RATE || (redsAreRuling && player.canAfford(redsTaxFromRaisingMoonParameter))) {
        orOptions.options.push(new SelectOption('Increase Moon Mining rate', 'Select', () => {
          player.removeResourceFrom(this, 1);
          MoonExpansion.raiseMiningRate(player);
          return undefined;
        }));
      }

      const moonLogisticRate = MoonExpansion.getLogisticRate(player);
      if (!redsAreRuling || moonLogisticRate === MAXIMUM_LOGISTICS_RATE || (redsAreRuling && player.canAfford(redsTaxFromRaisingMoonParameter))) {
        orOptions.options.push(new SelectOption('Increase Moon Logistics rate', 'Select', () => {
          player.removeResourceFrom(this, 1);
          MoonExpansion.raiseLogisticRate(player);
          return undefined;
        }));
      }
    }

    return orOptions;
  }
}
