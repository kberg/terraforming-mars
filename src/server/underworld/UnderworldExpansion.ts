import {Board} from '../boards/Board';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {UnderworldData, UnderworldPlayerData} from './UnderworldData';
import {Random} from '../../common/utils/Random';
import {ExcavationToken} from '../../common/underworld/ExcavationToken';
import {inplaceShuffle} from '../utils/shuffle';
import {Resource} from '../../common/Resource';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardResource} from '../../common/CardResource';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {IGame} from '../IGame';
import {SpaceType} from '../../common/boards/SpaceType';
import {CardName} from '../../common/cards/CardName';

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

  public static onIdentification(player: IPlayer, count: number) {
    for (const p of player.game.getPlayersInGenerationOrder()) {
      for (const card of p.tableau) {
        card.onIdentification?.(player, p, count);
      }
    }
  }

  public static excavatableSpaces(player: IPlayer, ignorePlacementRestrictions: boolean = false) {
    const board = player.game.board;
    const anyExcavatableSpaces = board.spaces.filter((space) => {
      if (space.excavator !== undefined) {
        return false;
      }
      return space.spaceType !== SpaceType.COLONY;
    });

    if (ignorePlacementRestrictions === true) {
      return anyExcavatableSpaces;
    }

    const commonExcavatableSpaces = anyExcavatableSpaces.filter((space) => {
      return !Board.isCitySpace(space) || space.player === player;
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
    this.grant(player, space.undergroundResources ?? 'nothing');
    space.excavator = player;

    const game = player.game;
    game.board.getAdjacentSpaces(space)
      .forEach((s) => UnderworldExpansion.identify(game, s));
    const leaser = game.getCardPlayerOrUndefined(CardName.EXCAVATOR_LEASING);
    if (leaser !== undefined) {
      leaser.stock.add(Resource.MEGACREDITS, 1, {log: true});
    }
    player.tableau.forEach((card) => card.onExcavation?.(player, space));
  }

  public static grant(player: IPlayer, reward: ExcavationToken): void {
    const game = player.game;

    switch (reward) {
    case 'card1':
      player.drawCard(1);
      break;
    case 'card2':
      player.drawCard(2);
      break;
    case 'corruption1':
      player.underworldData.corruption += 1;
      break;
    case 'corruption2':
      player.underworldData.corruption += 2;
      break;
    case 'data1':
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 1}));
      break;
    case 'data2':
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
      break;
    case 'data3':
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 3}));
      break;
    case 'steel2':
      player.stock.add(Resource.STEEL, 2, {log: true});
      break;
    case 'steel1production':
      player.production.add(Resource.STEEL, 1, {log: true});
      break;
    case 'titanium2':
      player.stock.add(Resource.TITANIUM, 2, {log: true});
      break;
    case 'titanium1production':
      player.production.add(Resource.TITANIUM, 1, {log: true});
      break;
    case 'plant1':
      player.stock.add(Resource.PLANTS, 1, {log: true});
      break;
    case 'plant2':
      player.stock.add(Resource.PLANTS, 2, {log: true});
      break;
    case 'plant3':
      player.stock.add(Resource.PLANTS, 3, {log: true});
      break;
    case 'plant1production':
      player.production.add(Resource.PLANTS, 1, {log: true});
      break;
    case 'titaniumandplant':
      break;
    case 'energy1production':
      player.production.add(Resource.ENERGY, 1, {log: true});
      break;
    case 'heat2production':
      player.production.add(Resource.HEAT, 2, {log: true});
      break;
    case 'microbe1':
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 1}));
      break;
    case 'microbe2':
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
      break;
    case 'tr':
      player.increaseTerraformRating();
      break;
    case 'ocean':
      game.defer(new PlaceOceanTile(player));
      break;
    case 'data1pertemp':
    case 'microbe1pertemp':
    case 'plant2pertemp':
    case 'steel2pertemp':
    case 'titanium1pertemp':
      player.stock.add(Resource.MEGACREDITS, 5, {log: true});
      break;
    default:
      throw new Error('Unknown reward: ' + reward);
    }
  }
}

function allTokens(): Array<ExcavationToken> {
  const tokens: Array<ExcavationToken> = [];
  function add(count: number, token: ExcavationToken) {
    for (let idx = 0; idx < count; idx++) {
      tokens.push(token);
    }
  }

  add(5, 'nothing');
  add(13, 'data1');
  add(4, 'data2');
  add(1, 'data3');

  add(10, 'corruption1');
  add(2, 'corruption2');

  add(4, 'card1');
  add(1, 'card2');

  add(3, 'steel2');
  add(1, 'steel1production');

  add(3, 'titaniumandplant');
  add(3, 'titanium2');
  add(1, 'titanium1production');

  add(4, 'plant2');
  add(1, 'plant3');
  add(4, 'plant1production');

  add(5, 'energy1production');
  add(3, 'heat2production');

  add(4, 'microbe2');

  add(2, 'tr');
  add(2, 'ocean');


  add(3, 'data1pertemp');
  add(1, 'microbe1pertemp');
  add(3, 'plant2pertemp');
  add(3, 'steel2pertemp');
  add(3, 'titanium1pertemp');

  return tokens;
}
