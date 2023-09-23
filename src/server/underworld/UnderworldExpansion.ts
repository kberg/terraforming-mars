import {Board} from '../boards/Board';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {UnderworldData, UnderworldPlayerData} from './UnderworldData';
import {Random} from '../../common/utils/Random';
import {ResourceToken} from '../../common/underworld/ResourceToken';
import {ResourceTokenType} from '../../common/underworld/ResourceToken';
import {inplaceShuffle} from '../utils/shuffle';
import {Resource} from '../../common/Resource';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardResource} from '../../common/CardResource';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {MultiSet} from 'mnemonist';
import {IGame} from '../IGame';
import {SpaceType} from '../../common/boards/SpaceType';

export class UnderworldExpansion {
  private constructor() {
  }

  public static initialize(rnd: Random): UnderworldData {
    const tokens = allTokens();
    inplaceShuffle(tokens, rnd);
    return {
      tokens: tokens,
    };
  }

  public static initializePlayer(): UnderworldPlayerData {
    return {
      corruption: 0,
      excavationTiles: 0,
    };
  }

  public static identifyableSpaces(player: IPlayer): ReadonlyArray<Space> {
    const board = player.game.board;
    return board.spaces.filter((space) => space.undergroundResources === undefined);
  }

  public static identifiedSpaces(player: IPlayer): ReadonlyArray<Space> {
    const board = player.game.board;
    return board.spaces.filter((space) => space.undergroundResources !== undefined);
  }

  public static identify(game: IGame, space: Space) {
    if (space.undergroundResources !== undefined) {
      return;
    }
    const token = game.underworldData?.tokens.pop();
    if (token === undefined) {
      throw new Error('Cannot identify excatation space, no available tokens.');
    }
    space.undergroundResources = token;
  }

  public static excavatableSpaces(player: IPlayer) {
    const board = player.game.board;
    const commonExcavatableSpaces = board.spaces.filter((space) => {
      if (space.excavator !== undefined) {
        return false;
      }
      if (space.spaceType === SpaceType.COLONY) {
        return false;
      }
      if (Board.isCitySpace(space) || space.player !== player) {
        return false;
      }
      return true;
    });
    const spaces = commonExcavatableSpaces.filter((space) => {
      if (space.tile !== undefined && space.player === player) {
        return true;
      }
      return board.getAdjacentSpaces(space).some((s) => s.excavator === player);
    });
    if (spaces.length === 0) {
      return commonExcavatableSpaces;
    }
    return spaces;
  }

  public static excavate(player: IPlayer, space: Space) {
    if (space.undergroundResources === undefined) {
      this.identify(player.game, space);
    }
    const multiset = MultiSet.from(space.undergroundResources ?? []);
    multiset.forEachMultiplicity((count, e) => this.grant(player, e, count));
    space.excavator = player;

    const game = player.game;
    game.board.getAdjacentSpaces(space)
      .forEach((s) => UnderworldExpansion.identify(game, s));
  }

  public static grant(player: IPlayer, reward: ResourceTokenType, count: number): void {
    const game = player.game;

    switch (reward) {
    case 'card':
      player.drawCard(count);
      break;
    case 'corruption':
      player.underworldData.corruption += count;
      break;
    case 'data':
      player.game.defer(
        new AddResourcesToCard(
          player,
          CardResource.DATA,
          {count: count}));
      break;
    case 'energy_production':
      player.production.add(Resource.ENERGY, count, {log: true});
      break;
    case 'heat_production':
      player.production.add(Resource.HEAT, count, {log: true});
      break;
    case 'ocean':
      game.defer(new PlaceOceanTile(player));
      break;
    case 'plant':
      player.stock.add(Resource.PLANTS, count, {log: true});
      break;
    case 'plant_production':
      player.production.add(Resource.PLANTS, count, {log: true});
      break;
    case 'steel':
      player.stock.add(Resource.STEEL, count, {log: true});
      break;
    case 'steel_production':
      player.production.add(Resource.STEEL, count, {log: true});
      break;
    case 'titanium':
      player.stock.add(Resource.TITANIUM, count, {log: true});
      break;
    case 'titanium_production':
      player.production.add(Resource.TITANIUM, count, {log: true});
      break;
    case 'tr':
      player.increaseTerraformRating(count);
      break;
    default:
      throw new Error('Unknown reward: ' + reward);
    }
  }
}

function allTokens(): Array<ResourceToken> {
  const tokens: Array<ResourceToken> = [];
  function add(count: number, ...tile: Array<ResourceTokenType>) {
    for (let idx = 0; idx < count; idx++) {
      tokens.push([...tile]);
    }
  }

  add(5); // nothing
  add(13, 'data');
  add(4, 'data', 'data');
  add(1, 'data', 'data', 'data');

  // 3 1 Data per Temperature increase

  add(10, 'corruption');
  add(2, 'corruption', 'corruption');

  add(4, 'card');
  add(1, 'card', 'card');

  add(3, 'steel', 'steel');
  add(1, 'steel_production');

  // 3 2 Steel per Temperature increase

  add(3, 'titanium', 'plant');
  add(3, 'titanium', 'titanium');
  add(1, 'titanium_production');

  // 3 1 Titanium per Temperature increase

  add(4, 'plant', 'plant');
  add(1, 'plant', 'plant', 'plant');
  add(4, 'plant_production');

  // 3 2 Plants per Temperature increase

  add(5, 'energy_production');
  add(3, 'heat_production', 'heat_production');

  add(4, 'microbe', 'microbe');

  // 1 1 Microbe per Temperature increase

  add(2, 'tr');
  add(2, 'ocean');

  return tokens;
}
