import {expect} from 'chai';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('TollStation', function() {
  it('Should play in multiplayer game', function() {
    const card = new TollStation();
    const player = TestPlayers.BLUE.newPlayer();
    const anotherPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, anotherPlayer], player);

    player.tagsForTest = {space: 5};
    anotherPlayer.tagsForTest = {space: 5, wild: 2};
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(5);
  });

  it('Should play in solo game with Automa', function() {
    const card = new TollStation();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));

    game.generation = 1;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });
});
