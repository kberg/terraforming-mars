import {expect} from 'chai';
import {AresHandler} from '../../../src/ares/AresHandler';
import {BoardName} from '../../../src/boards/BoardName';
import {LandClaim} from '../../../src/cards/base/LandClaim';
import * as constants from '../../../src/constants';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {SpaceName} from '../../../src/SpaceName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('LandClaim', function() {
  let card : LandClaim; let player : TestPlayer; let player2 : TestPlayer;

  beforeEach(() => {
    card = new LandClaim();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.not.undefined;

    const landSpace = player.game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(landSpace);
    expect(landSpace.player).eq(player);
    expect(landSpace.tile).is.undefined;
  });

  it('can claim south pole on hellas board', function() {
    Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({
      boardName: BoardName.HELLAS,
    }));

    const action = card.play(player) as SelectSpace;
    expect(action).is.not.undefined;
    expect(player.canAfford(constants.HELLAS_BONUS_OCEAN_COST)).to.be.false;
    expect(action.availableSpaces.some((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.be.true;
  });

  it('can claim hazard spaces', function() {
    const gameOptions = TestingUtils.setCustomGameOptions({aresExtension: true, aresHazards: true});
    const game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    const hazardSpace = game.board.spaces.filter((s) => AresHandler.hasHazardTile(s))[0];
    player.playCard(card);
    TestingUtils.runAllActions(game);

    const selectSpace = player.popWaitingFor() as SelectSpace;
    expect(selectSpace.availableSpaces).includes(hazardSpace);
    selectSpace.cb(hazardSpace);
    expect(hazardSpace.player).eq(player);
  });
});
