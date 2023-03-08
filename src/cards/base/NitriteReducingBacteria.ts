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
import {REDS_RULING_POLICY_COST} from '../../constants';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class NitriteReducingBacteria extends Card implements IActionCard, IProjectCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.NITRITE_REDUCING_BACTERIA,
      tags: [Tags.MICROBE],
      cost: 11,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: '157',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 3 Microbes to increase your TR 1 step.', (eb) => {
            eb.microbes(3).startAction.tr(1);
          }).br;
          b.microbes(3);
        }),
        description: 'Add 3 Microbes to this card.',
      },
    });
  }

    public resourceCount: number = 0;

    public play(player: Player) {
      player.game.defer(new DeferredAction(
        player,
        () => {
          player.addResourceTo(this, {qty: 3, log: true});
          return undefined;
        },
      ));
      return undefined;
    }
    public canAct(player: Player): boolean {
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
      const trGain = 1;

      Card.setRedsActionWarningText(trGain, this, redsAreRuling, 'raise TR');

      // The second clause here prevents this.reserveUnits.megacredits (which should be 3) from increasing to 12
      // This behaviour is probably caused by this card being the only one that adds 3 microbes to itself when played
      if (redsAreRuling && this.reserveUnits.megacredits < trGain * REDS_RULING_POLICY_COST) {
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
      if (this.resourceCount < 3) {
        player.addResourceTo(this, {log: true});
        return undefined;
      }

      const orOptions = new OrOptions();
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(this.reserveUnits.megacredits))) {
        orOptions.options.push(new SelectOption('Remove 3 microbes to increase your terraform rating 1 step', 'Remove microbes', () => {
          player.removeResourceFrom(this, 3);
          LogHelper.logRemoveResource(player, this, 3, 'gain 1 TR');
          player.increaseTerraformRatingSteps(1);
          return undefined;
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
      return new ActionDetails({TRIncrease: 1});
    }
}
