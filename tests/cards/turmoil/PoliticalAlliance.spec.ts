import {expect} from 'chai';
import {PoliticalAlliance} from '../../../src/cards/turmoil/PoliticalAlliance';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('PoliticalAlliance', function() {
  let card : PoliticalAlliance; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(() => {
    card = new PoliticalAlliance();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can\'t play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    greens.partyLeader = player.id;
    reds.partyLeader = player.id;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Respects Reds', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    const unity = turmoil.getPartyByName(PartyName.UNITY)!;
    greens.partyLeader = player.id;
    unity.partyLeader = player.id;

    game.phase = Phase.ACTION;
    turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST;
    expect(player.canPlay(card)).is.true;
  });
});
