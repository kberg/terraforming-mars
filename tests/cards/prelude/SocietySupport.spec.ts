import {expect} from 'chai';
import {SocietySupport} from '../../../src/cards/prelude/SocietySupport';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SocietySupport', function() {
  it('Should play', function() {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const card = new SocietySupport();
    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).eq(-1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.getProduction(Resources.HEAT)).eq(1);
  });
});
