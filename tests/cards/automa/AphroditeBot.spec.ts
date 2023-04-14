import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {AphroditeBot} from '../../../src/cards/automa/AphroditeBot';

describe('AphroditeBot', function() {
  let card : AphroditeBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new AphroditeBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true, venusNextExtension: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(22);
    expect(game.getVenusScaleLevel()).to.eq(4);
  });
});
