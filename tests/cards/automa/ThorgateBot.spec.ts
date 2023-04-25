import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {ThorgateBot} from '../../../src/cards/automa/ThorgateBot';
import {AutomaHandler} from '../../../src/automa/AutomaHandler';
import {Tags} from '../../../src/cards/Tags';

describe('ThorgateBot', function() {
  let card : ThorgateBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new ThorgateBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Raises oxygen 1 step and gains 1 TR when resolving a power tag', function() {
    AutomaHandler.performActionForTag(game, Tags.ENERGY);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(23);
    expect(game.getTemperature()).to.eq(-28);
    expect(game.getOxygenLevel()).to.eq(2);
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.overwriteNextBotAction).is.true;

    // Next tag is treated as a power tag no matter what it is
    AutomaHandler.performActionForTag(game, Tags.MICROBE);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(23);
    expect(game.getTemperature()).to.eq(-28);
    expect(game.getOxygenLevel()).to.eq(2);
    expect(game.overwriteNextBotAction).is.false;
  });
});
