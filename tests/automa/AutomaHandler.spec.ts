import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {TestingUtils} from '../TestingUtils';
import {AutomaHandler} from '../../src/automa/AutomaHandler';

describe('AutomaHandler', function() {
  let player : Player; let game : Game;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({automaSoloVariant: true});
    game = Game.newInstance('foobar', [player], player, gameOptions);
  });

  it('Sets temperature correctly after decrease', function() {
    game.setTemperature(-22);
    AutomaHandler.decreaseTemperature(game, -1);
    expect(game.getTemperature()).to.eq(-28);

    game.setTemperature(-20);
    AutomaHandler.decreaseTemperature(game, -2);
    expect(game.getTemperature()).to.eq(-28);

    game.setTemperature(-12);
    AutomaHandler.decreaseTemperature(game, -1);
    expect(game.getTemperature()).to.eq(-16);

    game.setTemperature(-8);
    AutomaHandler.decreaseTemperature(game, -2);
    expect(game.getTemperature()).to.eq(-16);
  });

  it('Sets temperature correctly after increase', function() {
    game.setTemperature(-28);
    AutomaHandler.increaseTemperature(game, 1);
    expect(game.getTemperature()).to.eq(-22);

    game.setTemperature(-30);
    AutomaHandler.increaseTemperature(game, 2);
    expect(game.getTemperature()).to.eq(-22);

    game.setTemperature(-16);
    AutomaHandler.increaseTemperature(game, 1);
    expect(game.getTemperature()).to.eq(-12);

    game.setTemperature(-16);
    AutomaHandler.increaseTemperature(game, 2);
    expect(game.getTemperature()).to.eq(-8);
  });
});
