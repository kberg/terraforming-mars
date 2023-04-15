import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Card} from '../Card';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class ThoriumRush extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.THORIUM_RUSH,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 39,
      tr: {moonColony: 1, moonMining: 1, moonLogistics: 1},

      metadata: {
        description: 'Place 1 colony tile, 1 mining tile and 1 road tile on the Moon. ' +
        'Raise the Colony Rate, Mining Rate and Logistic Rate 1 step.',
        cardNumber: 'M56',
        renderData: CardRenderer.builder((b) => {
          b.moonColony().secondaryTag(AltSecondaryTag.MOON_COLONY_RATE)
            .moonMine().secondaryTag(AltSecondaryTag.MOON_MINING_RATE)
            .moonRoad().secondaryTag(AltSecondaryTag.MOON_LOGISTICS_RATE);
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!super.canPlay(player)) return false;

    const moonData = MoonExpansion.moonData(player.game);

    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    if (spaces.length < 2) return false;

    const mineSpaces = moonData.moon.getAvailableSpacesForMine(player);
    if (mineSpaces.length === 0) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    player.game.defer(new PlaceMoonMineTile(player));
    player.game.defer(new PlaceMoonRoadTile(player));
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({
      card: card,
      moonColonyRateIncrease: 1,
      moonLogisticsRateIncrease: 1,
      moonMiningRateIncrease: 1,
    });
  }
}
