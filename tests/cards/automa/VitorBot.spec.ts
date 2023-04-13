import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {VitorBot} from '../../../src/cards/automa/VitorBot';

describe('VitorBot', function() {
  let card : VitorBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new VitorBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.victoryPoints = 0;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.victoryPoints).eq(2);
  });
});
