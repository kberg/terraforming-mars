import {SpaceType} from '@/common/boards/SpaceType';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {MarsBoard} from './MarsBoard';
import {Space} from './Space';
import {AresHandler} from '../ares/AresHandler';
import {CardName} from '@/common/cards/CardName';
import {TileType} from '@/common/TileType';

type Filter = (space: Space) => boolean;

class FilterFactory {
  constructor(
    private board: MarsBoard,
    private player: IPlayer,
    private canAffordOptions: CanAffordOptions) {}

  public type(type: SpaceType): Filter {
    // Not Arabia Terra/Cove compatible
    return (space) => space.spaceType === type;
  }

  public isolated(): Filter {
    return (space) => this.board.getAdjacentSpaces(space).every((space) => space.tile === undefined);
  }

  public volcanic(): Filter {
    const volcanicSpaceIds = this.board.getVolcanicSpaceIds();
    if (volcanicSpaceIds.length === 0) {
      return () => true;
    }
    return (space) => volcanicSpaceIds.includes(space.id);
  }

  public available(): Filter {
    return (space) => {
      // A space is available if it doesn't have a player marker on it, or it belongs to |player|
      if (space.player !== undefined && space.player !== this.player) {
        return false;
      }

      // TODO If this is FOR placing an ocean, this actually gets a lot simpler. Figure that out.
      const playableSpace = space.tile === undefined || (AresHandler.hasHazardTile(space) && space.tile?.protectedHazard !== true);

      if (!playableSpace) {
        return false;
      }

      if (space.id === this.player.game.nomadSpace) {
        return false;
      }

      return this.board.canAfford(this.player, space, this.canAffordOptions);
    };
  }

  forGreenery(): Filter {
    return (space) => {
      // Gordon CEO can ignore placement restrictions for Cities+Greenery
      if (this.player.cardIsInEffect(CardName.GORDON)) {
        return true;
      }
      // Spaces next to Red City are always unavialable.
      if (this.player.game.gameOptions.pathfindersExpansion === true) {
        if (this.board.getAdjacentSpaces(space).some((neighbor) => neighbor.tile?.tileType === TileType.RED_CITY)) {
          return false;
        }
      }

      return this.board.getAdjacentSpaces(space).some((adj) => {
        return adj.tile !== undefined && adj.player === this.player && adj.tile.tileType !== TileType.OCEAN;
      });

      // // Spaces next to tiles you own
      // if (spacesForGreenery.length > 0) {
      //   return spacesForGreenery;
      // }
    };
  }

  forCity(): Filter {
    return (space) => {
      // Gordon CEO can ignore placement restrictions for Cities+Greenery
      if (this.player.cardIsInEffect(CardName.GORDON)) {
        return true;
      }
      // Spaces next to Red City are always unavialable.
      if (this.player.game.gameOptions.pathfindersExpansion === true) {
        if (this.board.getAdjacentSpaces(space).some((neighbor) => neighbor.tile?.tileType === TileType.RED_CITY)) {
          return false;
        }
      }

      // Kingdom of Tauraro can place cities next to cities, but also must place them
      // next to tiles they own, if possible.
      if (this.player.isCorporation(CardName.KINGDOM_OF_TAURARO)) {
        const spacesNextToMySpaces = spacesOnLand.filter(
          (space) => this.getAdjacentSpaces(space).some(
            (adj) => adj.tile !== undefined && adj.player === player));

        return (spacesNextToMySpaces.length > 0) ? spacesNextToMySpaces : spacesOnLand;
      }
      // A city cannot be adjacent to another city
      return spacesOnLand.filter(
        (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)) === false,
    );
  }
}

class SpacePipeline {
  private filters: Array<Filter> = [];
  private filterFactory: FilterFactory;

  constructor(
    private board: MarsBoard,
    player: IPlayer,
    canAffordOptions: CanAffordOptions) {
    this.filterFactory = new FilterFactory(board, player, canAffordOptions);
  }

  public type(type: SpaceType) {
    this.filters.push(this.filterFactory.type(type));
  }

  public isolated() {
    this.filters.push(this.filterFactory.isolated());
  }

  public volcanic() {
    this.filters.push(this.filterFactory.volcanic());
  }

  public available() {
    this.filters.push(this.filterFactory.available());
  }

  public forCity() {
    this.filters.push(this.filterFactory.forCity());
  }

  public forGreenery() {
    this.filters.push(this.filterFactory.forGreenery());
  }

  public run() {
    let spaces = [...this.board.spaces];
    for (const filter of this.filters) {
      spaces = spaces.filter(filter);
    }
    return spaces;
  }
}
