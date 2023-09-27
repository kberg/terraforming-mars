import {expect} from 'chai';
import {PowerPlant} from '../../src/server/cards/pathfinders/PowerPlant';
import {BalancedDevelopment} from '../../src/server/turmoil/globalEvents/BalancedDevelopment';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {testGame} from '../TestGame';

describe('BalancedDevelopment', function() {
  it('resolve play', function() {
    const card = new BalancedDevelopment();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new PowerPlant());
    player2.playedCards.push(new PowerPlant());
    player2.playedCards.push(new PowerPlant());

    turmoil.chairman = player2.id;
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });
});
