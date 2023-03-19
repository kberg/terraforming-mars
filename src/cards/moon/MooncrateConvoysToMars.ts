import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {SellSteel} from '../../moon/SellSteel';
import {REDS_RULING_POLICY_COST, SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {Turmoil} from '../../turmoil/Turmoil';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {Units} from '../../Units';

export class MooncrateConvoysToMars extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.MOONCRATE_CONVOYS_TO_MARS,
      cardType: CardType.EVENT,
      cost: 13,
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. ' +
          'Raise the Logistic Rate 1 step. All players may sell their steel resources for 3M€ each.',
        cardNumber: 'M60',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate().br;
          b.text('X').steel(1).any.colon().text('X').megacredits(3);
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    let canAffordReds = true;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      canAffordReds = this.howToAffordReds.canAfford;
    }

    const turmoil = Turmoil.getTurmoil(player.game);

    if (turmoil.parties.find((p) => p.name === PartyName.MARS)) {
      const meetsPartyRequirements = turmoil.canPlay(player, PartyName.MARS);

      if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
        return meetsPartyRequirements && canAffordReds;
      }

      return meetsPartyRequirements;
    }

    // Total cost = card cost + SOCIETY_ADDITIONAL_CARD_COST + potential 3 reserved M€ for Reds
    let societyCost = player.getCardCost(this) + SOCIETY_ADDITIONAL_CARD_COST;
    if (this.reserveUnits.megacredits > 0) societyCost += this.reserveUnits.megacredits;

    return player.canAfford(societyCost);
  }

  public play(player: Player) {
    TurmoilHandler.handleSocietyPayment(player, PartyName.MARS);
    MoonExpansion.raiseLogisticRate(player, 1);
    const game = player.game;
    game.getPlayers().forEach((player) => {
      game.defer(new SellSteel(player));
    });
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1});
  }
}
