import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST, SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class PROffice extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PR_OFFICE,
      tags: [Tags.EARTH],
      cost: 7,
      tr: {tr: 1},

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      metadata: {
        cardNumber: 'T09',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.megacredits(1).slash().earth().played;
        }),
        description: 'Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 M€ for each Earth tag you have, including this.',
      },
    });
  }

  // Avoid checking super.canPlay(player) here due to Society's alternate rule for parties not in game
  public canPlay(player: Player): boolean {
    const turmoil = player.game.turmoil;
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (turmoil === undefined) return false;

    let canAffordReds = true;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      canAffordReds = this.howToAffordReds.canAfford;
    } else {
      this.howToAffordReds = undefined;
    }

    if (turmoil.parties.find((p) => p.name === PartyName.UNITY)) {
      const meetsPartyRequirements = turmoil.canPlay(player, PartyName.UNITY);

      if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
        return meetsPartyRequirements && canAffordReds;
      }

      return meetsPartyRequirements;
    }

    // There is no Unity party in play, but we still need to check for Reds reserved M€
    // If some M€ has to be reserved, it increases the total cost to play the card
    // As the M€ gained from playing PR Office can only be used to pay Reds tax, but not SOCIETY_ADDITIONAL_CARD_COST
    let societyCost = player.getCardCost(this) + SOCIETY_ADDITIONAL_CARD_COST;
    if (this.reserveUnits.megacredits > 0) societyCost += this.reserveUnits.megacredits;
    Card.setSocietyWarningText(this, PartyName.UNITY);

    return player.canAfford(societyCost);
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(1);
    const amount = player.getTagCount(Tags.EARTH) + 1;
    player.addResource(Resources.MEGACREDITS, amount);
    TurmoilHandler.handleSocietyPayment(player, PartyName.UNITY);
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({
      card: card,
      TRIncrease: 1,
      bonusMegaCredits: player.getTagCount(Tags.EARTH) + 1,
    });
  }
}
