import {expect} from 'chai';
import {Board} from '../../../src/boards/Board';
import {ArcadianCommunities} from '../../../src/cards/promo/ArcadianCommunities';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {SpaceType} from '../../../src/SpaceType';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('ArcadianCommunities', function() {
  let card: ArcadianCommunities; let player: TestPlayer; let board: Board;

  beforeEach(() => {
    card = new ArcadianCommunities();
    player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);

    player.corporationCards = [card];
    board = game.board;
  });

  it('initial action', () => {
    const action = card.initialAction(player);
    expect(action).instanceOf(SelectSpace);

    const space = action.availableSpaces[0];
    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    action.cb(space);

    expect(space.tile).is.undefined;
    expect(space.player).eq(player);
    expect(player.megaCredits).to.eq(0);
  });

  it('Should play', function() {
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.steel).eq(10);
  });

  it('action + effect', () => {
    // Select an initial space next to which the action will occur.
    const initLands = board.getAvailableSpacesForGreenery(player);
    initLands[0].player = player;

    const action = card.action(player) as SelectSpace;
    const space = action.availableSpaces[0];

    expect(space.tile).is.undefined;
    expect(space.player).is.undefined;

    action.cb(space);

    expect(space.tile).is.undefined;
    expect(space.player).eq(player);
    expect(player.megaCredits).to.eq(0);

    // This describes the effect.
    player.game.addCityTile(player, space.id);
    TestingUtils.runAllActions(player.game);
    expect(player.megaCredits).to.eq(3);
  });

  it('available spaces do not include those where player already has token', () => {
    // Spaces 10 and 11 are valid, adjacent spaces.
    const first = board.getSpace('10');
    expect(first.spaceType).eq(SpaceType.LAND);

    const second = board.getSpace('11');
    expect(second.spaceType).eq(SpaceType.LAND);

    const neighbor = board.getSpace('05');
    expect(neighbor.spaceType).eq(SpaceType.LAND);

    expect(board.getAdjacentSpaces(first)).contains(second);
    expect(board.getAdjacentSpaces(second)).contains(neighbor);
    expect(board.getAdjacentSpaces(neighbor)).contains(first);

    neighbor.player = player;

    let action = card.action(player) as SelectSpace;
    expect(action.availableSpaces).contains(first);
    expect(action.availableSpaces).contains(second);

    first.player = player;
    action = card.action(player) as SelectSpace;
    expect(action.availableSpaces).does.not.contain(first);
    expect(action.availableSpaces).does.contain(second);
  });
});
