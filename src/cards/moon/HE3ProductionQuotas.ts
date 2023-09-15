import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {Turmoil} from '../../turmoil/Turmoil';
import {REDS_RULING_POLICY_COST, SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {Units} from '../../Units';

export class HE3ProductionQuotas extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.HE3_PRODUCTION_QUOTAS,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 10,
      tr: {moonMining: 1},

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS).miningTiles(1).any()),
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there, and 1 mine tile on the Moon. ' +
        'Pay 1 steel per mine tile on the Moon to gain 4 heat per mine tile on the Moon. Raise the Mining Rate 1 step.',
        cardNumber: 'M57',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).slash().moonMine({size: Size.SMALL}).any
            .colon().text('4').heat(1).slash().moonMine({size: Size.SMALL}).any.br;
          b.moonMiningRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);
    
    const turmoil = Turmoil.getTurmoil(player.game);
    const hasMiningTileOnMoon = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {surfaceOnly: true}).length >= 1;
    const moonTiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    const canAffordSteelCost = player.steel >= moonTiles.length;

    if (!hasMiningTileOnMoon) return false;
    if (!canAffordSteelCost) return false;

    let canAffordReds = true;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      canAffordReds = this.howToAffordReds.canAfford;
    } else {
      this.howToAffordReds = undefined;
    }

    if (turmoil.parties.find((p) => p.name === PartyName.KELVINISTS)) {
      const meetsPartyRequirements = turmoil.canPlay(player, PartyName.KELVINISTS);

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
    const moonTiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    player.steel -= moonTiles.length;
    player.heat += (4 * moonTiles.length);
    MoonExpansion.raiseMiningRate(player);
    TurmoilHandler.handleSocietyPayment(player, PartyName.KELVINISTS);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonMiningRateIncrease: 1});
  }
}
