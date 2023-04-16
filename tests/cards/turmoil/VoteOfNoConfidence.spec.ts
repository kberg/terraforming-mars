import {expect} from 'chai';
import {VoteOfNoConfidence} from '../../../src/cards/turmoil/VoteOfNoConfidence';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('VoteOfNoConfidence', function() {
  let card : VoteOfNoConfidence; let player : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(() => {
    card = new VoteOfNoConfidence();
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.false;

    turmoil.chairman = 'NEUTRAL';
    expect(card.canPlay(player)).is.false;

    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.getPlayerById(turmoil.chairman)).eq(player);
    expect(player.getTerraformRating()).eq(15);
  });

  it('Neutral Delegate returns to Reserve', function() {
    const neutralReserve = turmoil.getDelegatesInReserve('NEUTRAL');
    turmoil.chairman = 'NEUTRAL';

    const greens = turmoil.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player.id;

    card.play(player);
    TestingUtils.runAllActions(game);
    expect(turmoil.getDelegatesInReserve('NEUTRAL')).to.eq(neutralReserve + 1);
  });
});
