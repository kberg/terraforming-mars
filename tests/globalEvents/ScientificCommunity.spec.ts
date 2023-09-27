import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {SecurityFleet} from '../../src/server/cards/base/SecurityFleet';
import {testGame} from '../TestGame';
import {ScientificCommunity} from '../../src/server/turmoil/globalEvents/ScientificCommunity';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('ScientificCommunity', function() {
  it('resolve play', function() {
    const card = new ScientificCommunity();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    player.cardsInHand.push(new Ants());
    player2.cardsInHand.push(new SecurityFleet(), new Ants());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(1);
    expect(player2.megaCredits).to.eq(5);
  });
});
