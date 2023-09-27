import {expect} from 'chai';
import {AcquiredCompany} from '../../src/server/cards/base/AcquiredCompany';
import {testGame} from '../TestGame';
import {TiredEarth} from '../../src/server/turmoil/globalEvents/TiredEarth';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('TiredEarth', function() {
  it('resolve play', function() {
    const card = new TiredEarth();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());
    player2.playedCards.push(new AcquiredCompany());

    player.plants = 20;
    player2.plants = 20;

    turmoil.chairman = player2.id;
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);

    expect(player.plants).to.eq(19);
    expect(player2.plants).to.eq(20);
  });
});
