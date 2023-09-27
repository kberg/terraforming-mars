import {expect} from 'chai';
import {testGame} from '../TestGame';
import {StrongSociety} from '../../src/server/turmoil/globalEvents/StrongSociety';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {addCity} from '../TestingUtils';

describe('StrongSociety', function() {
  it('resolve play', function() {
    const card = new StrongSociety();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    addCity(player);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });
});
