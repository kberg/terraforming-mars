import {expect} from 'chai';
import {RedInfluence} from '../../src/server/turmoil/globalEvents/RedInfluence';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {testGame} from '../TestGame';

describe('RedInfluence', function() {
  it('resolve play', function() {
    const card = new RedInfluence();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    player.setTerraformRating(23);
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(4);
    expect(player2.megaCredits).to.eq(4);
    expect(player.production.megacredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(3);
  });

  it('Max 5', function() {
    const card = new RedInfluence();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    player.setTerraformRating(59);
    player.megaCredits = 20;

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(5);
  });
});
