import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {PolyphemosBot} from '../../../src/cards/automa/PolyphemosBot';

describe('PolyphemosBot', function() {
  let card : PolyphemosBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new PolyphemosBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes initial action', function() {
    player.cardCost = 3; // Reset
    card.initialAction(player);
    expect(player.cardCost).to.eq(5);
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(21);
  });
});
