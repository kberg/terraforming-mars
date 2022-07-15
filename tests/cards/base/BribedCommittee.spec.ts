import {expect} from 'chai';
import {BribedCommittee} from '../../../src/cards/base/BribedCommittee';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('BribedCommittee', function() {
  let card : BribedCommittee; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new BribedCommittee();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    card.play(player);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(-2);
    expect(player.getTerraformRating()).eq(22);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST * 2;
    expect(player.canPlay(card)).is.true;
  });
});
