import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {PlaceSpecialMoonTile} from '../../moon/PlaceSpecialMoonTile';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class LunaMiningHub extends MoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.LUNA_MINING_HUB,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 16,
      productionBox: Units.of({steel: 1, titanium: 1}),
      reserveUnits: Units.of({titanium: 1, steel: 1}),
      tr: {moonMining: 1},

      requirements: CardRequirements.builder((b) => b.miningRate(5)),
      metadata: {
        cardNumber: 'M14',
        description: {
          text: '2 VP PER MINING TILE ADJACENT TO THIS TILE.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.text('Requires a Mining Rate of 5 or higher.', Size.TINY, false, false).br;
          b.minus().steel(1).minus().titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
          b.text('Spend 1 steel and 1 titanium and raise your steel and titanium production 1 step.', Size.TINY, false, false).br;
          b.tile(TileType.LUNA_MINING_HUB, true).moonMiningRate({size: Size.SMALL});
          b.text('Place this tile on the Moon and raise the Mining Rate 1 step.', Size.TINY, false, false);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.moonMiningTile(2, true),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!super.canPlay(player)) return false;

    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    if (spaces.length === 0) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    this.howToAffordReds = undefined;
    return true;
  }

  public play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceSpecialMoonTile(
      player, {
        tileType: TileType.LUNA_MINING_HUB,
        card: this.name,
      },
      'Select a space for Luna Mining Hub.'));
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }

  public getVictoryPoints(player: Player) {
    const moonData = MoonExpansion.moonData(player.game);
    const usedSpace = moonData.moon.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(usedSpace);
      const adjacentMines = adjacentSpaces.filter((s) => MoonExpansion.spaceHasType(s, TileType.MOON_MINE));
      return 2 * adjacentMines.length;
    }
    return 0;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonMiningRateIncrease: 1});
  }
}
