import {expect} from 'chai';
import {Io} from '../../src/colonies/Io';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';
import {TestPlayers} from '../TestPlayers';

describe('Io', function() {
  let io: Io; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    io = new Io();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(io);
  });

  it('Should build', function() {
    io.addColony(player);
    expect(player.getProduction(Resources.HEAT)).eq(1);
    expect(player2.getProduction(Resources.HEAT)).eq(0);
  });

  it('Should trade', function() {
    io.trade(player);
    expect(player.heat).eq(3);
    expect(player2.heat).eq(0);
  });

  it('Should give trade bonus', function() {
    io.addColony(player);

    io.trade(player2);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.HEAT)).eq(1);
    expect(player2.getProduction(Resources.HEAT)).eq(0);
    expect(player.heat).eq(2);
    expect(player2.heat).eq(3);
  });
});
