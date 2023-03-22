import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST, MAX_OXYGEN_LEVEL, SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';
import {Turmoil} from '../../turmoil/Turmoil';
import {TileType} from '../../TileType';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class WildlifeDome extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.WILDLIFE_DOME,
      cost: 15,
      tags: [Tags.ANIMAL, Tags.PLANT, Tags.BUILDING],
      cardType: CardType.AUTOMATED,
      requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),
      tr: {oxygen: 1},

      metadata: {
        cardNumber: 'T15',
        renderData: CardRenderer.builder((b) => {
          b.greenery();
        }),
        description: 'Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.',
      },
    });
  }

  // Avoid checking super.canPlay(player) here due to Society's alternate rule for parties not in game
  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const canPlaceTile = player.game.board.getAvailableSpacesForGreenery(player).length > 0;
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (turmoil === undefined) return false;
    if (!canPlaceTile) return false;

    let canAffordReds = true;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      canAffordReds = this.howToAffordReds.canAfford;
    }

    if (turmoil.parties.find((p) => p.name === PartyName.GREENS)) {  
      const meetsPartyRequirements = turmoil.canPlay(player, PartyName.GREENS);
      const oxygenMaxed = player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

      if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS) && !oxygenMaxed) {
        return meetsPartyRequirements && canAffordReds;
      }

      return meetsPartyRequirements;
    }

    // There is no Greens party in play, but we still need to check for Reds reserved M€
    // If some M€ has to be reserved, it increases the total cost to play the card
    // As the M€ gained from playing Wildlife Dome can only be used to pay Reds tax, but not SOCIETY_ADDITIONAL_CARD_COST
    let societyCost = player.getCardCost(this) + SOCIETY_ADDITIONAL_CARD_COST;
    if (this.reserveUnits.megacredits > 0) societyCost += this.reserveUnits.megacredits;
    Card.setSocietyWarningText(this, PartyName.GREENS);

    return player.canAfford(societyCost);
  }

  public play(player: Player) {
    player.game.defer(new DeferredAction(player, () => new SelectSpace('Select space for greenery tile', player.game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
      return player.game.addGreenery(player, space.id);
    })));

    TurmoilHandler.handleSocietyPayment(player, PartyName.GREENS);
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({
      card: card,
      oxygenIncrease: 1,
      nonOceanToPlace: TileType.GREENERY,
      nonOceanAvailableSpaces: player.game.board.getAvailableSpacesForGreenery(player),
    });
  }
}
