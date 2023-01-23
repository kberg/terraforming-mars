import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Rugged} from '../../src/awards/fanmade/Rugged';
import {TileType} from '../../src/TileType';
import {TestPlayers} from '../TestPlayers';
import {_AresHazardPlacement} from '../../src/ares/AresHazards';
import {TestingUtils} from '../TestingUtils';

describe('Rugged', function() {
  it('Correctly counts tiles adjacent to hazards', function() {
    const award = new Rugged();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({aresExtension: true, aresHazards: true});
    const game = Game.newInstance('test', [player, player2], player, gameOptions);

    const hazardSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(hazardSpace, TileType.DUST_STORM_MILD);
    
    const adjacentSpace = game.board.getAdjacentSpaces(hazardSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
    game.deferredActions.runAll(() => {});
    expect(award.getScore(player)).eq(1);
  });
});
