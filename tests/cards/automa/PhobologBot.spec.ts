import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {PhobologBot} from '../../../src/cards/automa/PhobologBot';
import {Satellites} from '../../../src/cards/base/Satellites';
import {SolarWindPower} from '../../../src/cards/base/SolarWindPower';

describe('PhobologBot', function() {
  let card : PhobologBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new PhobologBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes action', function() {
    // Set up the deck for testing
    game.dealer.deck.push(new Satellites(), new SolarWindPower());

    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(23);
    expect(game.dealer.discarded.length).greaterThanOrEqual(2);
  });
});
