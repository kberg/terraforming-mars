import {expect} from 'chai';
import {PoliticalAlliance} from '../../../src/server/cards/turmoil/PoliticalAlliance';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('PoliticalAlliance', function() {
  let card: PoliticalAlliance;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new PoliticalAlliance();
    [game, player] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Can not play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player.id;
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    const reds = turmoil.getPartyByName(PartyName.REDS);
    greens.partyLeader = player.id;
    reds.partyLeader = player.id;
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
