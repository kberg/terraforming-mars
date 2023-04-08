import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {TestingUtils} from '../TestingUtils';
import {AutomaHandler} from '../../src/automa/AutomaHandler';
import {MAX_OXYGEN_LEVEL, MAX_VENUS_SCALE} from '../../src/constants';

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

  it('Sets Venus scale correctly after decrease', function() {
    game.setVenusScaleLevel(24);
    AutomaHandler.decreaseVenusScale(game, -1);
    expect(game.getVenusScaleLevel()).to.eq(20);

    game.setVenusScaleLevel(24);
    AutomaHandler.decreaseVenusScale(game, -2);
    expect(game.getVenusScaleLevel()).to.eq(16);

    // Cannot decrease parameter if Venus is maxed
    game.setVenusScaleLevel(MAX_VENUS_SCALE);
    game.increaseVenusScaleLevel(player, -1);
    expect(game.getVenusScaleLevel()).to.eq(MAX_VENUS_SCALE);
    game.increaseVenusScaleLevel(player, -2);
    expect(game.getVenusScaleLevel()).to.eq(MAX_VENUS_SCALE);
  });

  it('Sets Venus scale correctly after increase', function() {
    game.setVenusScaleLevel(24);
    AutomaHandler.increaseVenusScale(game, 1);
    expect(game.getVenusScaleLevel()).to.eq(MAX_VENUS_SCALE);

    game.setVenusScaleLevel(20);
    AutomaHandler.increaseVenusScale(game, 2);
    expect(game.getVenusScaleLevel()).to.eq(MAX_VENUS_SCALE);

    game.setVenusScaleLevel(4);
    AutomaHandler.increaseVenusScale(game, 3);
    expect(game.getVenusScaleLevel()).to.eq(16);
  });

  it('Sets oxygen level correctly after decrease', function() {
    game.setOxygenLevel(6);
    AutomaHandler.decreaseOxygenLevel(game, -1);
    expect(game.getOxygenLevel()).to.eq(4);

    game.setOxygenLevel(6);
    AutomaHandler.decreaseOxygenLevel(game, -2);
    expect(game.getOxygenLevel()).to.eq(2);

    // Cannot decrease parameter if oxygen is maxed
    game.setOxygenLevel(MAX_OXYGEN_LEVEL);
    game.increaseOxygenLevel(player, -1);
    expect(game.getOxygenLevel()).to.eq(MAX_OXYGEN_LEVEL);
  });

  it('Sets oxygen level correctly after increase', function() {
    game.setOxygenLevel(6);
    AutomaHandler.increaseOxygenLevel(game, 1);
    expect(game.getOxygenLevel()).to.eq(8);

    AutomaHandler.increaseOxygenLevel(game, 2);
    expect(game.getOxygenLevel()).to.eq(12);
  });
});
