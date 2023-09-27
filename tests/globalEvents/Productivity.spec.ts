import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Resource} from '../../src/common/Resource';
import {Productivity} from '../../src/server/turmoil/globalEvents/Productivity';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('Productivity', function() {
  it('resolve play', function() {
    const card = new Productivity();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    player.production.add(Resource.STEEL, 3);
    player2.production.add(Resource.STEEL, 3);

    card.resolve(game, turmoil);
    expect(player.steel).to.eq(3);
    expect(player2.steel).to.eq(6);
  });
});
