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
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class JetStreamMicroscrappers extends Card implements IActionCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.JET_STREAM_MICROSCRAPPERS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 12,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: '234',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 Floaters here', (eb) => {
            eb.titanium(1).startAction.floaters(2);
          }).br;
          b.or().br;
          b.action('Spend 2 Floaters here to raise Venus 1 step', (eb) => {
            eb.floaters(2).startAction.venus(1);
          });
        }),
      },
    });
  };
  public resourceCount: number = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    const trGain = this.getTotalTRGain(player);

    if (this.resourceCount >= 2) Card.setRedsActionWarningText(trGain, this, redsAreRuling, 'raise Venus');

    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canSpendResource = this.resourceCount > 1 && !venusMaxed;

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }
    }

    if (redsAreRuling && !venusMaxed) {
      return player.titanium > 0 || (canSpendResource && player.canAfford(REDS_RULING_POLICY_COST));
    }

    return player.titanium > 0 || canSpendResource;
  }

  public action(player: Player) {
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Spend one titanium to add 2 floaters to this card', 'Spend titanium', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters to raise Venus 1 step', 'Remove floaters', () => this.spendResource(player));

    if (this.resourceCount > 1 && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    }

    if (player.titanium > 0) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.addResourceTo(this, {qty: 2, log: true});
    player.titanium--;
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this, 2);
    player.game.increaseVenusScaleLevel(player, 1);
    LogHelper.logVenusIncrease( player, 1);
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
