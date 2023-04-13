import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {CredicorBot} from '../../../src/cards/automa/CredicorBot';

describe('CredicorBot', function() {
  let card : CredicorBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new CredicorBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes action', function() {
    player.plants = 3;

    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(21);
    expect(player.plants).eq(0);
    
    player.plants = 2;
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(22);
    expect(player.plants).eq(0);
  });
});
