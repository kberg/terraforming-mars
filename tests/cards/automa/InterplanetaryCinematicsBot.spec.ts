import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {InterplanetaryCinematicsBot} from '../../../src/cards/automa/InterplanetaryCinematicsBot';
import {Mine} from '../../../src/cards/base/Mine';
import {Flooding} from '../../../src/cards/base/Flooding';
import {AutomaHandler} from '../../../src/automa/AutomaHandler';

describe('InterplanetaryCinematicsBot', function() {
  let card : InterplanetaryCinematicsBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new InterplanetaryCinematicsBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(21);
  });

  it('Takes extra action when resolving Event tag', function() {
    // Put an event tag on top of the deck, followed by a building tag just below it
    // In generation 1 the bot will take 1 action, plus 1 more action for its corp effect
    game.dealer.deck.push(new Mine());
    game.dealer.deck.push(new Flooding());
    AutomaHandler.takeBotTurn(game);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(22);
  });
});
