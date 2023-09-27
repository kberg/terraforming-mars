import {expect} from 'chai';
import {FloatingHabs} from '../../src/server/cards/venusNext/FloatingHabs';
import {CloudSocieties} from '../../src/server/turmoil/globalEvents/CloudSocieties';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {testGame} from '../TestGame';

describe('CloudSocieties', function() {
  it('resolve play', function() {
    const card = new CloudSocieties();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);
    player.playedCards.push(new FloatingHabs());
    turmoil.chairman = player.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player.id;
    turmoil.dominantParty.delegates.add(player.id);
    card.resolve(game, turmoil);
    game.deferredActions.runNext();
    expect(player.playedCards[0].resourceCount).to.eq(3);
  });
});
