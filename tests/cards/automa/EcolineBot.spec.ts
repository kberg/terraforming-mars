import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {EcolineBot} from '../../../src/cards/automa/EcolineBot';
import {TileType} from '../../../src/TileType';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {AutomaHandler} from '../../../src/automa/AutomaHandler';
import {Tags} from '../../../src/cards/Tags';

describe('EcolineBot', function() {
  let card : EcolineBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new EcolineBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(21);
    expect(game.getOxygenLevel()).to.eq(2);
    expect(game.board.spaces.filter((s) => s.tile?.tileType === TileType.GREENERY).length).to.eq(2); // including initial greenery
  });

  it('Effect: Overwrite next tag and place a city instead', function() {
    game.board = EmptyBoard.newInstance();
    expect(game.overwriteNextBotAction).is.false;
    expect(game.getCitiesInPlayOnMars()).to.eq(0);

    // First place a greenery not adjacent to own city
    AutomaHandler.performActionForTag(game, Tags.MICROBE);
    expect(game.overwriteNextBotAction).is.true;

    // Place a city on the next action regardless of the tag
    AutomaHandler.performActionForTag(game, Tags.ANIMAL);
    expect(game.overwriteNextBotAction).is.false;
    expect(game.getCitiesInPlayOnMars()).to.eq(1);
  });
});
