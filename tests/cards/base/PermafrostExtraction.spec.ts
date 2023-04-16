import {expect} from 'chai';
import {PermafrostExtraction} from '../../../src/cards/base/PermafrostExtraction';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils } from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('PermafrostExtraction', function() {
  let card : PermafrostExtraction; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new PermafrostExtraction();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    game.setTemperature(-8);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    action!.cb(action!.availableSpaces[0]);
    expect(game.board.getOceansOnBoard()).eq(1);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.setTemperature(-8);
    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST;
    expect(player.canPlay(card)).is.true;
  });
});
