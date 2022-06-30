import {expect} from 'chai';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TollStation', function() {
  it('Should play', function() {
    const card = new TollStation();
    const player = TestPlayers.BLUE.newPlayer();
    const anotherPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, anotherPlayer], player);

    player.tagsForTest = {space: 5};
    anotherPlayer.tagsForTest = {space: 5, wild: 2};
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(5);
  });
});
