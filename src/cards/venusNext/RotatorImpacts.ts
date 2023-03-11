import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class RotatorImpacts extends Card implements IActionCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.ROTATOR_IMPACTS,
      cardType: CardType.ACTIVE,
      tags: [Tags.SPACE],
      cost: 6,
      resourceType: ResourceType.ASTEROID,

      requirements: CardRequirements.builder((b) => b.venus(14).max()),
      metadata: {
        cardNumber: '243',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 M€ to add an asteroid resource to this card [TITANIUM MAY BE USED].', (eb) => {
            eb.megacredits(6).titanium(1).brackets.startAction.asteroids(1);
          }).br;
          b.action('Spend 1 resource from this card to increase Venus 1 step.', (eb) => {
            eb.or().asteroids(1).startAction.venus(1);
          });
        }),
        description: 'Venus must be 14% or lower',
      },
    });
  };
  public resourceCount: number = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canSpendResource = this.resourceCount > 0;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    const trGain = this.getTotalTRGain(player);
    Card.setRedsActionWarningText(trGain, this, redsAreRuling, 'raise Venus');

    if (player.canAfford(6, {titanium: true})) return true;
    if (!canSpendResource) return false;
    if (canSpendResource && venusMaxed) return true;

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public action(player: Player) {
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Pay 6 to add 1 asteroid to this card', 'Pay', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 1 asteroid to raise Venus 1 step', 'Remove asteroid', () => this.spendResource(player));

    if (this.resourceCount > 0) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    }

    if (player.canAfford(6, {titanium: true})) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 6, {canUseTitanium: true, title: 'Select how to pay for action'}));
    player.addResourceTo(this, {log: true});
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.game.increaseVenusScaleLevel(player, 1);
    player.game.log('${0} removed an asteroid resource to increase Venus scale 1 step', (b) => b.player(player));
    return undefined;
  }

  private getTotalTRGain(player: Player): number {
    const venusScale = player.game.getVenusScaleLevel();
    let trGain = venusScale === MAX_VENUS_SCALE ? 0 : 1;
    if (venusScale === 14) trGain += 1;

    return trGain;
  }

  public getActionDetails() {
    return new ActionDetails({venusIncrease: 1});
  }
}
