import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class NitrogenFromTitan extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cost: 25,
      tags: [Tags.JOVIAN, Tags.SPACE],
      name: CardName.NITROGEN_FROM_TITAN,
      cardType: CardType.AUTOMATED,
      tr: {tr: 2},

      metadata: {
        cardNumber: 'C28',
        renderData: CardRenderer.builder((b) => {
          b.tr(2).floaters(2).secondaryTag(Tags.JOVIAN);
        }),
        description: 'Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player) : boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN}));
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, TRIncrease: 2});
  }
}

