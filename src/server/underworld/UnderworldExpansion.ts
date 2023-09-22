import {Board} from '../boards/Board';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {UnderworldData, UnderworldPlayerData} from './UnderworldData';
import {Random} from '../../common/utils/Random';
import {ResourceToken} from './ResourceToken';
import {ResourceTokenType} from './ResourceToken';
import {inplaceShuffle} from '../utils/shuffle';

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
    };
  }

  public static identifyableSpaces(player: IPlayer): ReadonlyArray<Space> {
    const board = player.game.board;
    return board.spaces.filter((space) => space.undergroundResources === undefined);
  }

  public static identifiedSpaces(player: IPlayer): ReadonlyArray<Space>  {
    const board = player.game.board;
    return board.spaces.filter((space) => space.undergroundResources !== undefined);
  }

  public static identify(player: IPlayer, space: Space) {
    if (space.undergroundResources !== undefined) {
      throw new Error('Space alrady identified');
    }
    const token = player.game.underworldData?.tokens.pop();
    if (token === undefined) {
      throw new Error('Cannot identify excatation space, no available tokens.');
    }
    space.undergroundResources = token;
  }

  public static excavatableSpaces(player: IPlayer) {
    return this.identifiedSpaces(player).filter(
      (space) =>
        space.excavatedBy === undefined &&
        (!Board.isCitySpace(space) || space.player === player),
    );
  }

  public static excavate(_player: IPlayer, _space: Space) {
    // const board = player.game.board;
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
  add(1, 'steel production');

  // 3 2 Steel per Temperature increase

  add(3, 'titanium', 'plant');
  add(3, 'titanium', 'titanium');
  add(1, 'titanium production');

  // 3 1 Titanium per Temperature increase

  add(4, 'plant', 'plant');
  add(1, 'plant', 'plant', 'plant');
  add(4, 'plant production');

  // 3 2 Plants per Temperature increase

  add(5, 'energy production');
  add(3, 'heat production', 'heat production');

  add(4, 'microbe', 'microbe');

  // 1 1 Microbe per Temperature increase

  add(2, 'tr');
  add(2, 'ocean');

  return tokens;
}
