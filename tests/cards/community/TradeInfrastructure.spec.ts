import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TradeInfrastructure} from '../../../src/cards/community/preludes/TradeInfrastructure';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';

describe('TradeInfrastructure', function() {
  let card : TradeInfrastructure; let player : Player;

  beforeEach(() => {
    card = new TradeInfrastructure();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.energy).eq(3);
    expect(player.getFleetSize()).eq(2);
  });
});
