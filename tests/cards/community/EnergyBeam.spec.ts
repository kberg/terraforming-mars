import {expect} from 'chai';
import {EnergyBeam} from '../../../src/cards/community/preludes/EnergyBeam';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('EnergyBeam', function() {
  it('Should play', function() {
    const card = new EnergyBeam();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(-1);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
    expect(player.getProduction(Resources.HEAT)).eq(2);
  });
});
