import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {RestrictedAreaAres} from '../../../src/cards/ares/RestrictedAreaAres';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {SelectSpace} from '../../../src/inputs/SelectSpace';

describe('RestrictedAreaAres', function() {
  let card : RestrictedAreaAres; let player : Player; let game: Game;

  beforeEach(() => {
    card = new RestrictedAreaAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    const space = selectSpace.availableSpaces[0];

    selectSpace.cb(space);
    expect(space.tile && space.tile.tileType).eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.DRAW_CARD]});
  });
});
