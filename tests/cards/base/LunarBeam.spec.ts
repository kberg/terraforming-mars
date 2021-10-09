import {expect} from 'chai';
import {LunarBeam} from '../../../src/cards/base/LunarBeam';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LunarBeam', function() {
  let card : LunarBeam; let player : Player;

  beforeEach(() => {
    card = new LunarBeam();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Can play', function() {
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;

    player.addProduction(Resources.MEGACREDITS, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(-2);
    expect(player.getProduction(Resources.HEAT)).eq(2);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });
});
