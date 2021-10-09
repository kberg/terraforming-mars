import {expect} from 'chai';
import {Biofuels} from '../../../src/cards/prelude/Biofuels';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Biofuels', function() {
  it('Should play', function() {
    const card = new Biofuels();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.plants).eq(2);
  });
});
