import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IResourceCard} from '../ICard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class TitanAirScrapping extends Card implements IProjectCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cost: 21,
      tags: [Tags.JOVIAN],
      name: CardName.TITAN_AIRSCRAPPING,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: 'C43',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
            eb.titanium(1).startAction.floaters(2);
          }).br;
          b.or().br;
          b.action('Spend 2 floaters here to increase your TR 1 step.', (eb) => {
            eb.floaters(2).startAction.tr(1);
          });
        }),
        victoryPoints: 2,
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(player: Player): boolean {
    const hasTitanium = player.titanium > 0;
    const hasEnoughFloaters = this.resourceCount >= 2;

    if (!hasTitanium && !hasEnoughFloaters) return false;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    if (this.resourceCount >= 2) Card.setRedsActionWarningText(player, 1, this, redsAreRuling, 'raise TR');

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
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Spend 1 titanium to add 2 floaters on this card', 'Spend titanium', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters on this card to increase your TR 1 step', 'Remove floaters', () => this.spendResource(player));

    if (this.resourceCount >= 2) {
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(this.reserveUnits.megacredits))) {
        opts.push(spendResource);
      }
    }

    if (player.titanium > 0) opts.push(addResource);

    const orOptions = new OrOptions(...opts);
    if (orOptions.options.length === 1) return orOptions.options[0].cb();

    return orOptions;
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 2);
    player.titanium--;
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this, 2);
    player.increaseTerraformRatingSteps(1);
    return undefined;
  }

  public play() {
    return undefined;
  }

  public getVictoryPoints(): number {
    return 2;
  }

  public getActionDetails() {
    return new ActionDetails({TRIncrease: 1});
  }
}
