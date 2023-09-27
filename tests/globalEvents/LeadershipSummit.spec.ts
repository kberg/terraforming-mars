import {expect} from 'chai';
import {LeadershipSummit} from '../../src/server/turmoil/globalEvents/LeadershipSummit';
import {testGame} from '../TestGame';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';

describe('LeadershipSummit', function() {
  it('resolve play', function() {
    const card = new LeadershipSummit();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.dominantParty = turmoil.getPartyByName(PartyName.REDS);
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player.id);

    card.resolve(game, turmoil);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player2.cardsInHand).has.lengthOf(3);
  });
});
