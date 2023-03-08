import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class GHGProducingBacteria extends Card implements IActionCard, IProjectCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GHG_PRODUCING_BACTERIA,
      tags: [Tags.SCIENCE, Tags.MICROBE],
      cost: 8,
      resourceType: ResourceType.MICROBE,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      metadata: {
        description: 'Requires 4% oxygen.',
        cardNumber: '034',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 2 Microbes to raise temperature 1 step.', (eb) => {
            eb.microbes(2).startAction.temperature(1);
          });
        }),
      },
    });
  }

    public resourceCount: number = 0;

    public play() {
      return undefined;
    }

    public canAct(player: Player): boolean {
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
      const trGain = this.getTotalTRGain(player);

      Card.setRedsActionWarningText(trGain, this, redsAreRuling, 'raise temperature');

      if (redsAreRuling) {
        this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
        const actionDetails = this.getActionDetails();
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

        if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
          this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
        }
      }

      return true;
    }

    public action(player: Player) {
      if (this.resourceCount < 2) {
        player.addResourceTo(this, {log: true});
        return undefined;
      }

      // This line is needed if the action places or could potentially place a tile
      if (this.howToAffordReds !== undefined) player.howToAffordReds = this.howToAffordReds;

      const orOptions = new OrOptions();
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(this.reserveUnits.megacredits))) {
        orOptions.options.push(new SelectOption('Remove 2 microbes to raise temperature 1 step', 'Remove microbes', () => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(player, this, 2, 'raise temperature 1 step');
          return player.game.increaseTemperature(player, 1);
        }));
      }

      orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }));

      if (orOptions.options.length === 1) return orOptions.options[0].cb();
      return orOptions;
    }

    public getActionDetails() {
      return new ActionDetails({temperatureIncrease: 1});
    }

    private getTotalTRGain(player: Player): number {
      const temperature = player.game.getTemperature();
      let trGain = temperature === MAX_TEMPERATURE ? 0 : 1;
      if (temperature === -2) trGain += 1;

      return trGain;
    }
}
