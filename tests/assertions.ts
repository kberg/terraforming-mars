import {expect} from 'chai';
import {cast} from './TestingUtils';
import {IPlayer} from '../src/server/IPlayer';
import {PlayerInput} from '../src/server/PlayerInput';
import {SelectSpace} from '../src/server/inputs/SelectSpace';
import {ICard} from '../src/server/cards/ICard';
import {SelectCard} from '../src/server/inputs/SelectCard';
import {TileType} from '../src/common/TileType';
import {Space} from '../src/server/boards/Space';

export function assertIsAddResourceToCard(input: PlayerInput | undefined, count: number, expectedCards: Array<ICard>, card: ICard) {
  const selectCard = cast(input, SelectCard);
  expect(selectCard.cards).to.have.members(expectedCards);

  const initialValue = card.resourceCount;
  selectCard.cb([card]);
  expect(initialValue + count).eq(card.resourceCount);
}

export function assertPlaceCity(player: IPlayer, input: PlayerInput | undefined, idx: number = 0) {
  return assertPlaceTile(player, input, TileType.CITY, idx);
}

export function assertPlaceOcean(player: IPlayer, input: PlayerInput | undefined, idx: number = 0) {
  return assertPlaceTile(player, input, TileType.OCEAN, idx);
}

export function assertPlaceGreenery(player: IPlayer, input: PlayerInput | undefined, idx: number = 0) {
  return assertPlaceTile(player, input, TileType.GREENERY, idx);
}

export function assertPlaceMoonMine(player: IPlayer, input: PlayerInput | undefined, idx: number = 0) {
  return assertPlaceTile(player, input, TileType.MOON_MINE, idx);
}

export function assertPlaceMoonHabitat(player: IPlayer, input: PlayerInput | undefined, idx: number = 0) {
  return assertPlaceTile(player, input, TileType.MOON_HABITAT, idx);
}

export function assertPlaceMoonRoad(player: IPlayer, input: PlayerInput | undefined, idx: number = 0) {
  return assertPlaceTile(player, input, TileType.MOON_ROAD, idx);
}

export function assertPlaceTile(player: IPlayer, input: PlayerInput | undefined, tileType: TileType, idx: number = 0): Space {
  const selectSpace = cast(input, SelectSpace);
  const space = selectSpace.spaces[idx];
  space.bonus = [];
  expect(space?.tile?.tileType).is.undefined;
  expect(space.player).is.undefined;

  selectSpace.cb(space);

  expect(space?.tile?.tileType).eq(tileType);
  if (tileType !== TileType.OCEAN) {
    expect(space.player).eq(player);
  }

  return space;
}
