import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Riots} from '../../src/server/turmoil/globalEvents/Riots';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {addCity} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Riots', function() {
  it('resolve play', function() {
    const card = new Riots();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);
    turmoil.initGlobalEvent(game);
    addCity(player);
    player.stock.add(Resource.MEGACREDITS, 10);
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(6);
  });
});
