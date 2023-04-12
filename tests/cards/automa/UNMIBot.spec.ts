import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {UNMIBot} from '../../../src/cards/automa/UNMIBot';

describe('UNMIBot', function() {
  let card : UNMIBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new UNMIBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(21);
    // Temperature has the most steps left at the start of the game
    expect(game.getTemperature()).to.eq(-28);
  });
});
