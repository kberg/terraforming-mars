import {expect} from 'chai';
import {Virus} from '../../src/server/cards/base/Virus';
import {CelebrityLeaders} from '../../src/server/turmoil/globalEvents/CelebrityLeaders';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {testGame} from '../TestGame';

describe('CelebrityLeaders', function() {
  it('resolve play', function() {
    const card = new CelebrityLeaders();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new Virus());
    player2.playedCards.push(new Virus());
    player2.playedCards.push(new Virus());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    player.megaCredits = 10;
    player2.megaCredits = 10;

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(12);
    expect(player2.megaCredits).to.eq(20);
  });
});
