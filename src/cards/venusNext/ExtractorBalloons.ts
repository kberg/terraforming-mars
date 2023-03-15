import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class ExtractorBalloons extends Card implements IActionCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.EXTRACTOR_BALLOONS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 21,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: '223',
        description: 'Add 3 Floaters to this card',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.action('Remove 2 Floaters here to raise Venus 1 step.', (eb) => {
            eb.or(Size.SMALL).floaters(2).startAction.venus(1);
          }).br.floaters(3);
        }),
      },
    });
  };

  public resourceCount: number = 0;

  public play(player: Player) {
    player.addResourceTo(this, 3);
    return undefined;
  }

  public canAct(player: Player): boolean {
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    const trGain = this.getTotalTRGain(player);

    if (this.resourceCount >= 2) Card.setRedsActionWarningText(trGain, this, redsAreRuling, 'raise Venus');

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
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const cannotAffordRed = PartyHooks.shouldApplyPolicy(player, PartyName.REDS) && !player.canAfford(this.reserveUnits.megacredits);
    if (this.resourceCount < 2 || venusMaxed || cannotAffordRed) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 2 floaters to raise Venus scale 1 step',
        'Remove floaters', () => {
          player.removeResourceFrom(this, 2);
          player.game.increaseVenusScaleLevel(player, 1);
          LogHelper.logVenusIncrease( player, 1);
          return undefined;
        }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }),
    );
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
