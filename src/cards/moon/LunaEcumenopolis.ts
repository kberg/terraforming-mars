import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {ISpace} from '../../boards/ISpace';
import {MAXIMUM_COLONY_RATE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';

export class LunaEcumenopolis extends MoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.LUNA_ECUMENOPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.CITY, Tags.MOON],
      cost: 35,
      reserveUnits: Units.of({titanium: 2}),

      metadata: {
        description: 'Spend 2 Titanium. ' +
        'Place 2 colony tiles adjacent to at least 2 other colony tiles and raise Colony rate 2 steps. ' +
        'Increase your TR 1 step for each 2 steps of the colony rate.',
        cardNumber: 'M84',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).nbsp();
          b.text('2').moonColony().secondaryTag(AltSecondaryTag.MOON_COLONY_RATE).asterix().br;
          b.tr(1).slash().moonColonyRate().moonColonyRate();
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  };

  public canPlay(player: Player) {
    if (!super.canPlay(player)) return false;

    const moonData = MoonExpansion.moonData(player.game);
    const initialMoonColonyRate = MoonExpansion.getColonyRate(player);

    // Initial TR gained from raising Colony rate 2 steps
    let trStepsIncreased = Math.min(MAXIMUM_COLONY_RATE - initialMoonColonyRate, 2);
    const newColonyRate = Math.min(initialMoonColonyRate + 2, MAXIMUM_COLONY_RATE);
    // Additional TR gained from raising 1 TR per 2 steps of Colony rate
    trStepsIncreased += Math.floor(newColonyRate / 2);

    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    const len = spaces.length;

    let firstSpaceId: string = '';
    let canPlaceTiles: boolean = false;

    // This function returns true when this space is next to two colonies. Don't try to understand firstSpaceId yet.
    const nextToTwoColonies = function(space: ISpace): boolean {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(space).filter((adjacentSpace) => {
        return MoonExpansion.spaceHasType(adjacentSpace, TileType.MOON_COLONY) || adjacentSpace.id === firstSpaceId;
      });
      return adjacentSpaces.length >= 2;
    };

    // Go through every available land space.
    for (let x = 0; x < len; x++) {
      const first = spaces[x];
      // If it's next to two colonies
      if (nextToTwoColonies(first) === true) {
        // Remember it.
        firstSpaceId = first.id;
        // Now go through all the land spaces again
        for (let y = 0; y < len; y++) {
          const second = spaces[y];
          if (second.id === firstSpaceId) continue;
          // Now if it's next to two colonies, it includes the first colony you placed. That's what firstSpaceId is for.
          if (nextToTwoColonies(second) === true) {
            canPlaceTiles = true;
          }
        }
      }
    }

    // We cannot place our 2 colony tiles
    if (!canPlaceTiles) return false;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    if (redsAreRuling) {
      Card.setRedsWarningText(trStepsIncreased, this);

      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trStepsIncreased * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    // These all have the same priority: Default.
    player.game.defer(new CustomPlaceMoonTile(player));
    player.game.defer(new CustomPlaceMoonTile(player));
    player.game.defer(new DeferredAction(player, () => {
      const colonyRate = MoonExpansion.getColonyRate(player);
      player.increaseTerraformRatingSteps(Math.floor(colonyRate / 2));
      return undefined;
    }));
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    const colonyRate = Math.min(MoonExpansion.getColonyRate(player) + 2, MAXIMUM_COLONY_RATE);
    return new ActionDetails({card: card, moonColonyRateIncrease: 2, TRIncrease: Math.floor(colonyRate / 2)});
  }
}

class CustomPlaceMoonTile extends PlaceMoonColonyTile {
  protected getSpaces() {
    const moonData = MoonExpansion.moonData(this.player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(this.player);
    const filtered = spaces.filter((space) => {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(space).filter((adjacentSpace) => {
        return MoonExpansion.spaceHasType(adjacentSpace, TileType.MOON_COLONY);
      });
      return adjacentSpaces.length >= 2;
    });
    return filtered;
  }
}
