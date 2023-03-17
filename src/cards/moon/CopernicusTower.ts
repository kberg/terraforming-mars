import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {IActionCard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Size} from '../render/Size';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {MoonExpansion } from '../../moon/MoonExpansion';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class CopernicusTower extends Card implements IActionCard, IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.COPERNICUS_TOWER,
      cardType: CardType.ACTIVE,
      tags: [Tags.SCIENCE, Tags.MOON],
      cost: 36,
      resourceType: ResourceType.SCIENCE,
      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM, 2)),

      metadata: {
        cardNumber: 'M72',
        victoryPoints: CardRenderDynamicVictoryPoints.moon(1, 1),
        renderData: CardRenderer.builder((b) => {
          b.text('Requires you have 2 titanium production.', Size.TINY, false, false).br;
          b.action('Add 1 Science resource here, or spend 1 Science resource here to raise your TR 1 step.', (eb) => {
            eb.empty().startAction.science(1).nbsp().slash().nbsp().science(1).arrow().tr(1);
          });
          b.br;
          b.vpText('1 VP PER MOON TAG YOU HAVE.');
        }),
      },
    });
  };
  public resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    if (this.resourceCount > 0) Card.setRedsActionWarningText(1, this, redsAreRuling, 'raise TR');

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }
    }

    return true;
  }

  public action(player: Player) {
    if (this.resourceCount < 1) {
      this.addResource(player);
      return undefined;
    }

    const orOptions = new OrOptions();
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    MoonExpansion.ifMoon(player.game, () => {
      if (!redsAreRuling || (redsAreRuling && player.canAfford(this.reserveUnits.megacredits))) {
        orOptions.options.push(new SelectOption('Remove 1 science resource to increase TR 1 step', 'Remove resource', () => this.spendResource(player)));
      }
    });

    orOptions.options.push(new SelectOption('Add 1 science resource to this card', 'Add resource', () => this.addResource(player)));

    if (orOptions.options.length === 1) return orOptions.options[0].cb();
    return orOptions;
  }

  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.MOON, 'raw');
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.increaseTerraformRatingSteps(1);
    player.addProduction(Resources.MEGACREDITS, 1, {log: true});
    return undefined;
  }

  public getActionDetails() {
    return new ActionDetails({TRIncrease: 1});
  }
}
