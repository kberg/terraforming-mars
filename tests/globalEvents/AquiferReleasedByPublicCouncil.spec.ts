import {expect} from 'chai';
import {AquiferReleasedByPublicCouncil} from '../../src/server/turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {testGame} from '../TestGame';

describe('AquiferReleasedByPublicCouncil', function() {
  it('resolve play', function() {
    const card = new AquiferReleasedByPublicCouncil();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player.id);
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.steel).to.eq(1);
    expect(player2.steel).to.eq(3);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(3);
  });
});
