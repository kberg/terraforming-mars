import {expect} from 'chai';
import {SpaceStation} from '../../src/server/cards/base/SpaceStation';
import {testGame} from '../TestGame';
import {SolarFlare} from '../../src/server/turmoil/globalEvents/SolarFlare';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('SolarFlare', function() {
  it('resolve play', function() {
    const card = new SolarFlare();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    player.playedCards.push(new SpaceStation());
    player2.playedCards.push(new SpaceStation(), new SpaceStation(), new SpaceStation());
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).to.eq(10);
  });
});
