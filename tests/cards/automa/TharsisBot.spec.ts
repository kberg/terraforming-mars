import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TharsisBot} from '../../../src/cards/automa/TharsisBot';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {AutomaHandler} from '../../../src/automa/AutomaHandler';

describe('TharsisBot', function() {
  let card : TharsisBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new TharsisBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;

    // We need to reset the bot and call card.initialAction as the bot receives a random corp during setup
    game.board = EmptyBoard.newInstance();
    AutomaHandler.placeInitialGreenery(game);
  });

  it('Should take initial action', function() {
    card.initialAction(player);

    expect(game.getCitiesInPlayOnMars()).eq(1);
    expect(game.automaBotVictoryPointsBreakdown.victoryPoints).eq(0);
  });

  it('Takes action', function() {
    card.initialAction(player);

    card.action(player);
    card.action(player);
    expect(game.getCitiesInPlayOnMars()).eq(3);
    expect(game.automaBotVictoryPointsBreakdown.victoryPoints).eq(1);
    
    card.action(player);
    card.action(player);
    expect(game.getCitiesInPlayOnMars()).eq(5);
    expect(game.automaBotVictoryPointsBreakdown.victoryPoints).eq(1);

    card.action(player);
    expect(game.getCitiesInPlayOnMars()).eq(6);
    expect(game.automaBotVictoryPointsBreakdown.victoryPoints).eq(2);

    game.addGreenery(player, game.board.getAvailableSpacesForGreenery(player)[0].id);
    game.deferredActions.runAll(() => {});
    expect(game.automaBotVictoryPointsBreakdown.victoryPoints).eq(2);
  });
});
